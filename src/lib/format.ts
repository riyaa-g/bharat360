export type FormatOptions = {
  type?: "currency" | "percentage" | "compact" | "rank" | "raw";
  maxDecimals?: number;
};

export function formatNumber(
  value: number | string | null | undefined,
  options?: FormatOptions
): string {
  if (value === null || value === undefined || value === "") return "N/A";

  const num = typeof value === "string" ? parseFloat(value.replace(/[^0-9.-]/g, "")) : value;
  
  if (isNaN(num)) return typeof value === "string" ? value : "0";

  const type = options?.type || "compact";
  const maxDec = options?.maxDecimals !== undefined ? options.maxDecimals : 2;

  let prefix = "";
  let suffix = "";

  if (type === "currency") prefix = "$";
  else if (type === "rank") prefix = "#";
  else if (type === "percentage") suffix = "%";

  if (type === "raw") {
    // Just add commas for large numbers, e.g. 1,000,000
    const parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${prefix}${parts.join(".")}${suffix}`;
  }

  let formatted = "";
  const absNum = Math.abs(num);

  if (absNum >= 1e12) {
    formatted = (num / 1e12).toFixed(maxDec).replace(/\.?0+$/, "") + "T";
  } else if (absNum >= 1e9) {
    formatted = (num / 1e9).toFixed(maxDec).replace(/\.?0+$/, "") + "B";
  } else if (absNum >= 1e6) {
    formatted = (num / 1e6).toFixed(maxDec).replace(/\.?0+$/, "") + "M";
  } else if (absNum >= 1e3) {
    // For smaller numbers like thousands, only format to K if it makes sense, but we'll do it strictly here
    formatted = (num / 1e3).toFixed(maxDec).replace(/\.?0+$/, "") + "K";
  } else {
    // For smaller numbers, just fix decimal to maxDec if it has decimals, then strip trailing zeros
    formatted = num.toFixed(maxDec).replace(/\.?0+$/, "");
  }

  return `${prefix}${formatted}${suffix}`;
}
