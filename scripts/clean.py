import os
import glob
import json
import time
import pandas as pd
from pathlib import Path

# Configuration
RAW_DIR = "datasets/raw"
OUT_DIR = "public/data"
TARGET_COUNTRIES = ["India", "United States", "China", "Japan", "Germany", "United Kingdom", "Brazil", "South Korea", "Russia"]
MIN_YEAR = 2000

FILE_MAPPINGS = {
    "gdp": {"category": "economy", "title": "Gross Domestic Product", "tags": ["gdp", "economy", "growth", "finance"]},
    "gdp_growth": {"category": "economy", "title": "GDP Growth", "tags": ["gdp", "growth", "economy"]},
    "gdp_per_capita": {"category": "economy", "title": "GDP per Capita", "tags": ["gdp", "per capita", "economy"]},
    "inflation": {"category": "economy", "title": "Inflation", "tags": ["inflation", "prices", "economy"]},
    
    "life_expectancy": {"category": "healthcare", "title": "Life Expectancy", "tags": ["health", "life expectancy", "healthcare"]},
    "infant_mortality": {"category": "healthcare", "title": "Infant Mortality", "tags": ["health", "mortality", "infants"]},
    "maternal_mortality": {"category": "healthcare", "title": "Maternal Mortality", "tags": ["health", "mortality", "maternal"]},
    "uhc": {"category": "healthcare", "title": "Universal Health Coverage", "tags": ["health", "coverage", "uhc"]},
    
    "literacy": {"category": "education", "title": "Literacy Rate", "tags": ["education", "literacy"]},
    "school_enrollment": {"category": "education", "title": "School Enrollment", "tags": ["education", "enrollment"]},
    
    "co2": {"category": "environment", "title": "CO2 Emissions", "tags": ["environment", "emissions", "co2"]},
    "pm25": {"category": "environment", "title": "PM2.5 Air Pollution", "tags": ["environment", "pollution", "pm25", "air quality"]},
    "epi_rankings": {"category": "environment", "title": "Environmental Performance Index", "tags": ["environment", "epi", "rankings"], "out_name": "epi"},
    
    "innovation": {"category": "technology", "title": "Global Innovation Index", "tags": ["innovation", "technology", "index"]},
    "ai_readiness": {"category": "technology", "title": "AI Readiness Index", "tags": ["ai", "technology", "readiness"]},
    
    "gini": {"category": "equality", "title": "Gini Index", "tags": ["equality", "gini", "inequality", "income"]},
    
    "happiness": {"category": "society", "title": "World Happiness Report", "tags": ["society", "happiness", "wellbeing"]},
    
    "hdi": {"category": "overview", "title": "Human Development Index", "tags": ["hdi", "development", "overview"]}
}

def standardize_country(name):
    if pd.isna(name):
        return name
    name = str(name).strip()
    mapping = {
        "United States of America": "United States",
        "USA": "United States",
        "UK": "United Kingdom",
        "Great Britain": "United Kingdom",
        "Russian Federation": "Russia",
        "Korea, Rep.": "South Korea",
        "Republic of Korea": "South Korea"
    }
    return mapping.get(name, name)

def read_dataset(filepath):
    ext = filepath.suffix.lower()
    df = None
    
    def is_header_row(row_values):
        row_str = ' '.join(str(x).lower() for x in row_values if pd.notna(x))
        return 'country' in row_str or 'entity' in row_str or 'ref_area' in row_str
        
    try:
        if ext in ['.csv']:
            # Read first 30 lines to find header
            lines = []
            with open(filepath, 'r', encoding='utf-8') as f:
                for _ in range(30):
                    line = f.readline()
                    if not line: break
                    lines.append(line)
            
            header_idx = 0
            for i, line in enumerate(lines):
                if is_header_row(line.split(',')):
                    header_idx = i
                    break
                    
            df = pd.read_csv(filepath, skiprows=header_idx)
            
        elif ext in ['.xlsx', '.xls']:
            df = pd.read_excel(filepath, header=None)
            header_idx = 0
            for i, row in df.head(30).iterrows():
                if is_header_row(row.values):
                    header_idx = i
                    break
            df = pd.read_excel(filepath, header=header_idx)
            df = df.dropna(how='all')
            
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        
    return df

def process_worldbank(df):
    """ Wide format: Country Name, Country Code, Indicator Name, Indicator Code, 1960, 1961... """
    year_cols = [c for c in df.columns if str(c).isdigit()]
    id_vars = ['Country Name']
    if not year_cols or 'Country Name' not in df.columns:
        return None
        
    df_melt = pd.melt(df, id_vars=id_vars, value_vars=year_cols, var_name='year', value_name='value')
    df_melt.rename(columns={'Country Name': 'country'}, inplace=True)
    return df_melt

def process_long_format(df, file_stem):
    """ Typical long format: REF_AREA_LABEL or Country, TIME_PERIOD or Year, OBS_VALUE or Value """
    col_map = {}
    
    # Identify country column
    for c in df.columns:
        cl = str(c).lower().strip()
        if cl in ['country', 'country name', 'ref_area_label', 'entity']:
            col_map[c] = 'country'
            break
            
    # Identify year column
    for c in df.columns:
        cl = str(c).lower().strip()
        if cl in ['year', 'time_period', 'date']:
            col_map[c] = 'year'
            break
            
    # Identify value column
    val_col = None
    
    # 1. Prioritize the column that matches the file stem
    for c in df.columns:
        if str(c).lower().strip() == file_stem.lower():
            val_col = c
            break
            
    # 2. Check for common value names
    if not val_col:
        for c in df.columns:
            cl = str(c).lower().strip()
            if cl in ['value', 'obs_value', 'score', 'rank', 'total score'] or 'co2' in cl or 'hdi' in cl:
                val_col = c
                break
                
    # 3. Fallback for OWID metrics (Self-reported life satisfaction, PM2.5) 
    # Pick the first unassigned numeric column that isn't an ID
    if not val_col:
        for c in df.columns:
            if c not in col_map and df[c].dtype in ['float64', 'int64']:
                cl = str(c).lower().strip()
                if cl not in ['code', 'iso_code']:
                    val_col = c
                    break
    
    if val_col:
        col_map[val_col] = 'value'
        
    # If no year column exists, inject a default year (e.g. Oxford AI Readiness or UNDP HDI)
    if 'year' not in col_map.values():
        df['year'] = 2023
        col_map['year'] = 'year'
        
    if 'country' not in col_map.values() or 'year' not in col_map.values() or 'value' not in col_map.values():
        return None
        
    df = df.rename(columns=col_map)
    return df[['country', 'year', 'value']]

def main():
    start_time = time.time()
    files_processed = 0
    files_skipped = 0
    jsons_created = 0
    warnings = []
    datasets_index = []
    sources = set()

    # Make output dirs
    for cat in set(m["category"] for m in FILE_MAPPINGS.values()):
        os.makedirs(os.path.join(OUT_DIR, cat), exist_ok=True)
        
    raw_path = Path(RAW_DIR)
    
    for filepath in raw_path.rglob('*'):
        if filepath.is_dir():
            continue
            
        if 'epi2026rawdata' in str(filepath).lower():
            continue
            
        # Parse file stem handling .csv.csv
        file_stem = filepath.stem.replace('.csv', '').replace('.xlsx', '')
        if file_stem == 'epi_rankings':
            pass # allow this
        elif file_stem not in FILE_MAPPINGS:
            continue
            
        print(f"Processing: {filepath}")
        df = read_dataset(filepath)
        if df is None or df.empty:
            files_skipped += 1
            warnings.append(f"Failed to read or empty dataframe: {filepath}")
            continue

        # Extract source from parent folder
        source = filepath.parent.name.upper() if filepath.parent.name else "Unknown"
        sources.add(source)

        # Detect schema and melt
        clean_df = None
        parser_used = "Unknown"
        
        if 'Country Name' in df.columns and any(str(c).isdigit() for c in df.columns):
            clean_df = process_worldbank(df)
            parser_used = "WorldBank Wide Format"
        else:
            clean_df = process_long_format(df, file_stem)
            parser_used = "Long Format (OWID/WHO/Oxford/UNDP)"

        if clean_df is None:
            files_skipped += 1
            warnings.append(f"Could not parse schema for: {filepath}")
            continue
            
        print(f"  -> Schema auto-detected: {parser_used}")

        # Clean Country Names
        clean_df['country'] = clean_df['country'].apply(standardize_country)
        
        # Filter for Target Countries
        clean_df = clean_df[clean_df['country'].isin(TARGET_COUNTRIES)]
        
        # Filter and cast Year
        clean_df['year'] = pd.to_numeric(clean_df['year'], errors='coerce')
        clean_df = clean_df.dropna(subset=['year'])
        clean_df['year'] = clean_df['year'].astype(int)
        clean_df = clean_df[clean_df['year'] >= MIN_YEAR]
        
        # Filter Value
        clean_df['value'] = pd.to_numeric(clean_df['value'], errors='coerce')
        clean_df = clean_df.dropna(subset=['value'])

        if clean_df.empty:
            files_skipped += 1
            warnings.append(f"No data remaining after filtering for: {filepath}")
            continue
            
        # Group to format
        output_data = []
        all_years = sorted(clean_df['year'].unique().tolist())
        
        for country, group in clean_df.groupby('country'):
            country_record = {"country": country}
            for _, row in group.iterrows():
                country_record[str(row['year'])] = round(float(row['value']), 2)
            output_data.append(country_record)

        mapping = FILE_MAPPINGS[file_stem]
        category = mapping["category"]
        out_name = mapping.get("out_name", file_stem)
        
        out_filepath = Path(OUT_DIR) / category / f"{out_name}.json"
        
        # Final JSON payload
        payload = {
            "title": mapping["title"],
            "source": source,
            "unit": "Value",
            "lastUpdated": str(max(all_years)),
            "countries": TARGET_COUNTRIES,
            "years": all_years,
            "data": output_data
        }

        try:
            with open(out_filepath, 'w', encoding='utf-8') as f:
                json.dump(payload, f, indent=2)
            files_processed += 1
            jsons_created += 1
            
            # Add to repository index
            datasets_index.append({
                "id": out_name,
                "title": mapping["title"],
                "category": category.capitalize(),
                "source": source,
                "description": f"{mapping['title']} dataset covering {min(all_years)} to {max(all_years)}.",
                "years": all_years,
                "countries": TARGET_COUNTRIES,
                "file": f"/data/{category}/{out_name}.json",
                "tags": mapping["tags"]
            })
            
        except Exception as e:
            warnings.append(f"Failed to write JSON for {filepath}: {e}")

    # Write datasets.json
    try:
        with open(os.path.join(OUT_DIR, "datasets.json"), 'w', encoding='utf-8') as f:
            json.dump(datasets_index, f, indent=2)
        jsons_created += 1
    except Exception as e:
        warnings.append(f"Failed to write datasets.json: {e}")

    # Write overview.json
    try:
        overview = {
            "lastUpdated": str(pd.Timestamp.now().year),
            "totalDatasets": len(datasets_index),
            "sources": list(sources)
        }
        with open(os.path.join(OUT_DIR, "overview.json"), 'w', encoding='utf-8') as f:
            json.dump(overview, f, indent=2)
        jsons_created += 1
    except Exception as e:
        warnings.append(f"Failed to write overview.json: {e}")

    # Print Summary
    print("\n--- Pipeline Execution Summary ---")
    print(f"Time Elapsed: {time.time() - start_time:.2f} seconds")
    print(f"Files Processed: {files_processed}")
    print(f"Files Skipped: {files_skipped}")
    print(f"JSON Files Created: {jsons_created}")
    
    if warnings:
        print("\nWarnings:")
        for w in warnings:
            print(f" - {w}")

if __name__ == "__main__":
    main()
