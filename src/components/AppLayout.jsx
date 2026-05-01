import { Bell, UserCircle } from "lucide-react";
import { navItems } from "../data/sampleData.js";
import { NavIcon } from "./Icons.jsx";
import { Button } from "./Ui.jsx";

const navIconNames = {
  dashboard: "dashboard",
  practice: "practice",
  questions: "list",
  review: "review",
  analytics: "analytics",
  csv: "csv",
  settings: "settings",
};

export default function AppLayout({
  children,
  activeNav = "dashboard",
  title = "資格問題トレーニング",
  subtitle = "今日の学習状況を確認して、次の問題に進みましょう。",
  actions,
}) {
  return (
    <div className="min-h-screen bg-[#F6F8FB] font-['Noto_Sans_JP',sans-serif] text-[#172033]" data-testid="app-layout">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-[#D9E2EC] bg-white lg:block" data-testid="sidebar">
        <div className="flex h-20 items-center border-b border-[#D9E2EC] px-6">
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-[#2563EB]">学習ツール</p>
            <h1 className="mt-1 text-lg font-bold tracking-normal">資格問題Webアプリ</h1>
          </div>
        </div>
        <nav className="space-y-1 px-3 py-5" aria-label="メインメニュー">
          {navItems.map((item) => {
            const active = item.id === activeNav;
            return (
              <a
                key={item.id}
                href={item.href}
                className={`flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition ${
                  active
                    ? "bg-[#DBEAFE] text-[#1D4ED8]"
                    : "text-[#64748B] hover:bg-[#EEF3F8] hover:text-[#172033]"
                }`}
                data-testid={`nav-${item.id}`}
              >
                <NavIcon name={navIconNames[item.id]} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-[#D9E2EC] bg-white/95 backdrop-blur" data-testid="top-header">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <div className="lg:hidden">
              <p className="text-xs font-bold tracking-[0.14em] text-[#2563EB]">学習ツール</p>
              <h1 className="mt-1 text-base font-bold tracking-normal">資格問題Webアプリ</h1>
            </div>
            <div className="hidden text-sm font-semibold text-[#64748B] lg:block">{subtitle}</div>
            <div className="flex items-center gap-2">
              {actions}
              <Button variant="secondary" size="sm" icon={Bell} aria-label="通知" title="通知" />
              <Button variant="ghost" size="sm" icon={UserCircle} aria-label="アカウント" title="アカウント" />
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8" data-testid="page-content">
          <div className="animate-rise mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
