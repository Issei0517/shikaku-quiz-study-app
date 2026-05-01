import { ArrowRight, BookOpen, CalendarDays, Flame, LineChart, Trophy } from "lucide-react";

const trend = [42, 54, 48, 68, 62, 76, 84];
const weakCategories = [
  { name: "行政手続法", rate: 48, count: 18 },
  { name: "地方自治", rate: 52, count: 14 },
  { name: "情報公開", rate: 57, count: 12 },
  { name: "民法総則", rate: 61, count: 16 },
  { name: "会社法", rate: 64, count: 10 },
];

const defaultStats = {
  todayAnswered: 36,
  accuracy: 78,
  streakDays: 14,
  reviewCount: 21,
  todayGoalRemaining: 15,
};

function pickNumber(stats, keys, fallback) {
  const value = keys.map((key) => stats?.[key]).find((item) => typeof item === "number" && Number.isFinite(item));
  return value ?? fallback;
}

function Metric({ icon: Icon, label, value, note }) {
  return (
    <section className="panel p-5">
      <div className="flex items-center justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-md bg-app-primarySoft text-app-primary">
          <Icon size={21} />
        </span>
        <span className="rounded-full bg-app-successSoft px-3 py-1 text-xs font-bold text-app-success">{note}</span>
      </div>
      <p className="mt-5 text-sm font-bold text-app-muted">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-app-text">{value}</p>
    </section>
  );
}

export default function DashboardPage({ stats, reviewQuestions = [], onGoToPage, onStartPractice }) {
  const displayStats = {
    todayAnswered: pickNumber(stats, ["todayAnswered", "answeredToday", "todayCount"], defaultStats.todayAnswered),
    accuracy: pickNumber(stats, ["accuracy", "correctRate", "accuracyRate"], defaultStats.accuracy),
    streakDays: pickNumber(stats, ["streakDays", "streak", "continuousDays"], defaultStats.streakDays),
    reviewCount: pickNumber(stats, ["reviewCount", "reviewQuestionsCount"], reviewQuestions.length || defaultStats.reviewCount),
    todayGoalRemaining: pickNumber(stats, ["todayGoalRemaining", "remainingToday"], defaultStats.todayGoalRemaining),
  };

  return (
    <main data-testid="dashboard-page" className="page-content">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="muted-label">学習ダッシュボード</p>
          <h1 className="mt-2 text-3xl font-extrabold text-app-text">今日の進み具合</h1>
        </div>
        <button data-testid="dashboard-start" className="button-primary" onClick={onStartPractice}>
          学習を続ける
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Metric icon={BookOpen} label="今日解いた問題数" value={`${displayStats.todayAnswered}問`} note="今日" />
        <Metric icon={Trophy} label="正答率" value={`${displayStats.accuracy}%`} note="現在" />
        <Metric icon={Flame} label="連続学習" value={`${displayStats.streakDays}日`} note="継続中" />
        <Metric icon={CalendarDays} label="残りの復習" value={`${displayStats.reviewCount}問`} note="優先" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(340px,0.8fr)]">
        <section className="panel p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="muted-label">学習推移</p>
              <h2 className="mt-2 text-xl font-extrabold">直近7日の回答数</h2>
            </div>
            <LineChart className="text-app-muted" size={22} />
          </div>
          <div className="mt-8 flex h-72 items-end gap-4 rounded-lg bg-app-soft p-5">
            {trend.map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-3">
                <div className="flex h-56 w-full items-end rounded-md bg-white/80 px-2">
                  <div className="progress-fill w-full rounded-t-md bg-app-primary" style={{ height: `${height}%` }} />
                </div>
                <span className="text-xs font-bold text-app-muted">{["月", "火", "水", "木", "金", "土", "日"][index]}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel p-6">
          <p className="muted-label">苦手カテゴリ TOP5</p>
          <h2 className="mt-2 text-xl font-extrabold">優先して復習する範囲</h2>
          <div className="mt-6 space-y-4">
            {weakCategories.map((category, index) => (
              <div key={category.name} className="rounded-lg border border-app-line bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-md bg-app-reviewSoft text-sm font-extrabold text-app-review">{index + 1}</span>
                    <div>
                      <p className="font-extrabold text-app-body">{category.name}</p>
                      <p className="text-xs text-app-muted">{category.count}問を復習リストに追加済み</p>
                    </div>
                  </div>
                  <span className="text-lg font-extrabold text-app-error">{category.rate}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="panel mt-6 p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="muted-label">学習を続ける</p>
            <h2 className="mt-2 text-2xl font-extrabold">前回の続き: 行政手続法 第3章</h2>
            <p className="mt-2 text-sm leading-6 text-app-muted">
              あと{displayStats.todayGoalRemaining}問で今日の目標に届きます。苦手カテゴリを中心に出題します。
            </p>
          </div>
          <div className="flex gap-3">
            <button data-testid="dashboard-review-link" className="button-secondary" onClick={() => onGoToPage?.("review")}>
              復習から始める
            </button>
            <button className="button-primary" onClick={onStartPractice}>
              続きから始める
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
