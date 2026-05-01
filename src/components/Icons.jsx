import {
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Database,
  FileSpreadsheet,
  LayoutDashboard,
  ListChecks,
  Menu,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  XCircle,
} from "lucide-react";

export const Icons = {
  analytics: BarChart3,
  check: CheckCircle2,
  chevronDown: ChevronDown,
  csv: FileSpreadsheet,
  dashboard: LayoutDashboard,
  database: Database,
  list: ClipboardList,
  menu: Menu,
  practice: BookOpenCheck,
  review: RotateCcw,
  search: Search,
  settings: Settings,
  shield: ShieldCheck,
  tasks: ListChecks,
  wrong: XCircle,
};

export function NavIcon({ name, className = "h-5 w-5" }) {
  const Icon = Icons[name] ?? Icons.dashboard;
  return <Icon aria-hidden="true" className={className} strokeWidth={1.8} />;
}
