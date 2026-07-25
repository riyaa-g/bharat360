export function Footer() {
  return (
    <footer className="border-t hairline">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-6 py-10 text-[13px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="h-5 w-5 rounded-full"
            style={{ background: "var(--gradient-tiranga)" }}
          />
          <span className="font-medium text-foreground">Bharat360</span>
          <span className="ml-2">India, measured through data.</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-foreground">Methodology</a>
          <a href="#" className="hover:text-foreground">Data sources</a>
          <a href="#" className="hover:text-foreground">Privacy</a>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
