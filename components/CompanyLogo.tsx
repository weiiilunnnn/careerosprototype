const companyStyles: Record<
  string,
  { label: string; background: string; color: string; border?: string }
> = {
  grab: { label: "Grab", background: "#FFFFFF", color: "#00B14F", border: "#D9F7E7" },
  maybank: { label: "MAYBANK", background: "#FFC600", color: "#111111" },
  cimb: { label: "CIMB", background: "#A6192E", color: "#FFFFFF" },
  shopee: { label: "Shopee", background: "#EE4D2D", color: "#FFFFFF" },
  airasia: { label: "airasia", background: "#E31B23", color: "#FFFFFF" },
  petronas: { label: "PETRONAS", background: "#00A19C", color: "#FFFFFF" },
  maxis: { label: "maxis", background: "#78BE20", color: "#111111" },
  axiata: { label: "axiata", background: "#6B2FBF", color: "#FFFFFF" },
  carsome: { label: "CARSOME", background: "#111827", color: "#FFFFFF" },
  accenture: { label: "accenture", background: "#A100FF", color: "#FFFFFF" },
  microsoft: { label: "Microsoft", background: "#FFFFFF", color: "#2563EB", border: "#CBD5E1" },
  fintechcompany: { label: "Fintech", background: "#081433", color: "#FFFFFF", border: "#F5CBD6" },
};

const sizeClasses = {
  sm: "h-10 w-10 rounded-full text-[9px]",
  md: "h-[52px] w-[52px] rounded-xl text-[10px]",
  lg: "h-16 w-16 rounded-xl text-xs sm:h-20 sm:w-20 sm:rounded-3xl",
} as const;

const microsoftGridClasses = {
  sm: "h-6 w-6",
  md: "h-9 w-9",
  lg: "h-10 w-10 sm:h-12 sm:w-12",
} as const;

function normalizeCompanyName(company: string) {
  return company.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function getInitials(company: string) {
  return company
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

export default function CompanyLogo({
  company,
  size = "md",
}: {
  company: string;
  size?: keyof typeof sizeClasses;
}) {
  const normalized = normalizeCompanyName(company);

  if (normalized === "microsoft") {
    return (
      <div
        className={`flex shrink-0 items-center justify-center border bg-white shadow-sm ${sizeClasses[size]}`}
        style={{
          borderColor: "#CBD5E1",
        }}
        aria-label={`${company} logo`}
        title={company}
      >
        <div className={`grid grid-cols-2 gap-0.5 ${microsoftGridClasses[size]}`}>
          <span className="bg-[#f25022]" />
          <span className="bg-[#7fba00]" />
          <span className="bg-[#00a4ef]" />
          <span className="bg-[#ffb900]" />
        </div>
      </div>
    );
  }

  const config = companyStyles[normalizeCompanyName(company)] ?? {
    label: getInitials(company) || "CO",
    background: "linear-gradient(135deg, #F04D7A, #E00046)",
    color: "#FFFFFF",
  };

  return (
    <div
      className={`flex shrink-0 items-center justify-center border text-center font-black leading-none tracking-tight shadow-sm ${sizeClasses[size]}`}
      style={{
        background: config.background,
        borderColor: config.border ?? "rgba(15, 23, 42, 0.08)",
        color: config.color,
      }}
      aria-label={`${company} logo`}
      title={company}
    >
      {config.label}
    </div>
  );
}
