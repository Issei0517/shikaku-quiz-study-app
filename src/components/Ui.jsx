import { Icons } from "./Icons.jsx";

const toneClasses = {
  default: "border-[#D9E2EC] bg-white text-[#334155]",
  primary: "border-[#BFDBFE] bg-[#DBEAFE] text-[#1D4ED8]",
  success: "border-[#BBF7D0] bg-[#DCFCE7] text-[#15803D]",
  error: "border-[#FECACA] bg-[#FEE2E2] text-[#B91C1C]",
  review: "border-[#FDE68A] bg-[#FEF3C7] text-[#D97706]",
  muted: "border-[#D9E2EC] bg-[#EEF3F8] text-[#64748B]",
};

const buttonVariants = {
  primary: "border-[#2563EB] bg-[#2563EB] text-white shadow-sm hover:bg-[#1D4ED8]",
  secondary: "border-[#D9E2EC] bg-white text-[#334155] hover:border-[#BFDBFE] hover:bg-[#F8FAFC]",
  ghost: "border-transparent bg-transparent text-[#64748B] hover:bg-[#EEF3F8] hover:text-[#172033]",
  danger: "border-[#FECACA] bg-[#FEE2E2] text-[#B91C1C] hover:bg-[#FECACA]",
};

export function Card({ children, className = "", delay = 0, ...props }) {
  return (
    <section
      className={`animate-rise rounded-xl border border-[#D9E2EC] bg-white shadow-[0_8px_24px_rgba(23,32,51,0.04)] ${className}`}
      style={{ animationDelay: `${delay}ms`, ...props.style }}
      {...props}
    >
      {children}
    </section>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  className = "",
  type = "button",
  ...props
}) {
  const sizeClass = size === "sm" ? "h-9 px-3 text-sm" : "h-11 px-4 text-sm";
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition duration-200 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#93C5FD] focus:ring-offset-2 ${buttonVariants[variant]} ${sizeClass} ${className}`}
      {...props}
    >
      {Icon ? <Icon aria-hidden="true" className="h-4 w-4" strokeWidth={2} /> : null}
      {children}
    </button>
  );
}

export function Badge({ children, tone = "default", className = "", ...props }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClasses[tone]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export function ProgressBar({ value = 0, max = 100, tone = "primary", label, className = "" }) {
  const width = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  const fillClass = tone === "success" ? "bg-[#0F766E]" : tone === "review" ? "bg-[#D97706]" : "bg-[#2563EB]";

  return (
    <div className={className} data-testid="progress-bar">
      {label ? (
        <div className="mb-2 flex items-center justify-between text-sm text-[#64748B]">
          <span>{label}</span>
          <span className="font-semibold text-[#334155]">{width}%</span>
        </div>
      ) : null}
      <div className="h-2.5 overflow-hidden rounded-full bg-[#EEF3F8]">
        <div
          className={`h-full origin-left animate-stretch rounded-full transition-[width] duration-700 ease-out ${fillClass}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export function MetricCard({ label, value, helper, icon: Icon, tone = "primary", className = "" }) {
  return (
    <Card className={`p-5 ${className}`} data-testid="metric-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#64748B]">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-normal text-[#172033]">{value}</p>
          {helper ? <p className="mt-2 text-sm text-[#64748B]">{helper}</p> : null}
        </div>
        {Icon ? (
          <div className={`rounded-lg border p-2.5 ${toneClasses[tone]}`}>
            <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.9} />
          </div>
        ) : null}
      </div>
    </Card>
  );
}

export function SelectBox({ label, value, options = [], onChange, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      {label ? <span className="mb-2 block text-sm font-semibold text-[#334155]">{label}</span> : null}
      <span className="relative block">
        <select
          value={value}
          onChange={onChange}
          className="h-11 w-full appearance-none rounded-lg border border-[#D9E2EC] bg-white px-3 pr-10 text-sm text-[#334155] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#DBEAFE]"
          {...props}
        >
          {options.map((option) => (
            <option key={option.value ?? option} value={option.value ?? option}>
              {option.label ?? option}
            </option>
          ))}
        </select>
        <Icons.chevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
      </span>
    </label>
  );
}

export function Toggle({ checked = false, onChange, label, description, className = "" }) {
  return (
    <label className={`flex cursor-pointer items-center justify-between gap-4 ${className}`}>
      <span>
        {label ? <span className="block text-sm font-semibold text-[#334155]">{label}</span> : null}
        {description ? <span className="mt-1 block text-sm text-[#64748B]">{description}</span> : null}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span className="relative h-6 w-11 rounded-full bg-[#CBD5E1] transition peer-checked:bg-[#2563EB]">
        <span className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition ${checked ? "translate-x-5" : ""}`} />
      </span>
    </label>
  );
}

export function SegmentedControl({ options = [], value, onChange, className = "" }) {
  return (
    <div className={`inline-flex rounded-lg border border-[#D9E2EC] bg-[#EEF3F8] p-1 ${className}`} data-testid="segmented-control">
      {options.map((option) => {
        const optionValue = option.value ?? option;
        const active = optionValue === value;
        return (
          <button
            key={optionValue}
            type="button"
            onClick={() => onChange?.(optionValue)}
            className={`h-9 rounded-md px-3 text-sm font-semibold transition ${
              active ? "bg-white text-[#2563EB] shadow-sm" : "text-[#64748B] hover:text-[#172033]"
            }`}
          >
            {option.label ?? option}
          </button>
        );
      })}
    </div>
  );
}

export function SearchField({ value, onChange, placeholder = "検索", className = "" }) {
  return (
    <label className={`relative block ${className}`}>
      <Icons.search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-[#D9E2EC] bg-white pl-10 pr-3 text-sm text-[#334155] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#DBEAFE]"
      />
    </label>
  );
}
