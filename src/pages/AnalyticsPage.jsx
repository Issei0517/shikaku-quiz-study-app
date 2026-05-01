import { BarChart3, CalendarDays, CheckCircle2, Clock3, Target, TrendingUp } from "lucide-react";

const trend = [54, 62, 59, 71, 68, 76, 82];
const categories = [
  ["法令", 82, "bg-app-primary"],
  ["安全管理", 68, "bg-app-teal"],
  ["設備", 57, "bg-app-review"],
  ["記録", 74, "bg-app-success"],
];

const periodOptions = [
  ["7", "7日"],
  ["30", "30日"],
  ["90", "90日"],
  ["365", "1年"],
];

const defaultStats = {
  score: 78,
  accuracy: 72,
  studyHours: 18.5,
  solvedCount: 346,
};

function pickNumber(stats, keys, fallback) {
  const value = keys.map((key) => stats?.[key]).find((item) => typeof item === "number" && Number.isFinite(item));
  return value ?? fallback;
}

function Card({ children, className = "" }) {
  return <section className={`panel ${className}`}>{children}</section>;
}

export default function AnalyticsPage({ stats, analyticsPeriod = "7", onGoToPage, onStartPractice, onSetAnalyticsPeriod }) {
  const selectedPeriod = String(analyticsPeriod);
  const displayStats = {
    score: pickNumber(stats, ["score", "overallScore"], defaultStats.score),
    accuracy: pickNumber(stats, ["accuracy", "correctRate", "accuracyRate"], defaultStats.accuracy),
    studyHours: pickNumber(stats, ["studyHours", "learningHours"], defaultStats.studyHours),
    solvedCount: pickNumber(stats, ["solvedCount", "answeredCount", "totalAnswered"], defaultStats.solvedCount),
  };
  const metrics = [
    ["総合スコア", displayStats.score, "点", Target],
    ["正答率", displayStats.accuracy, "%", CheckCircle2],
    ["学習時間", displayStats.studyHours, "h", Clock3],
    ["解いた問題", displayStats.solvedCount, "問", BarChart3],
  ];

  return (
    <main data-testid="analytics-page" className="page-content mx-auto max-w-7xl">
      <div className="mb-6">
        <p className="muted-label">ANALYTICS</p>
        <h1 className="mt-2 text-3xl font-extrabold">成績・分析</h1>
        <p className="mt-2 text-sm text-app-muted">学習の進み具合と苦手分野を、まとめて確認できます。</p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {periodOptions.map(([value, label]) => (
          <button
            key={value}
            data-testid={value === "7" ? "analytics-period-7" : value === "30" ? "analytics-period-30" : undefined}
            className={`rounded-md border px-4 py-2 text-sm font-extrabold transition ${
              selectedPeriod === value ? "border-app-primary bg-app-primary text-white" : "border-app-line bg-white text-app-muted hover:text-app-primary"
            }`}
            onClick={() => onSetAnalyticsPeriod?.(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {metrics.map(([label, value, unit, Icon]) => (
          <Card key={label} className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-app-muted">{label}</p>
              <Icon className="text-app-primary" size={22} />
            </div>
            <p className="mt-3 text-3xl font-extrabold">
              {value}
              <span className="ml-1 text-base font-bold text-app-muted">{unit}</span>
            </p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-app-muted">正答率推移</p>
              <h2 className="mt-1 text-xl font-extrabold">直近7回の学習</h2>
            </div>
            <TrendingUp className="text-app-teal" />
          </div>
          <div className="mt-6 flex h-64 items-end gap-3 rounded-lg bg-app-soft p-4">
            {trend.map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-md bg-app-primary transition hover:bg-app-primaryStrong" style={{ height: `${height}%` }} />
                <span className="text-xs font-bold text-app-muted">{index + 1}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-bold text-app-muted">カテゴリ別成績</p>
          <h2 className="mt-1 text-xl font-extrabold">得意・苦手</h2>
          <div className="mt-5 space-y-5">
            {categories.map(([name, value, color]) => (
              <div key={name}>
                <div className="flex justify-between text-sm font-bold">
                  <span>{name}</span>
                  <span className="text-app-muted">{value}%</span>
                </div>
                <div className="mt-2 h-3 rounded-full bg-app-soft">
                  <div className={`h-3 rounded-full ${color}`} style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <CalendarDays className="text-app-primary" size={22} />
            <h2 className="text-xl font-extrabold">学習カレンダー</h2>
          </div>
          <div className="mt-5 grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, index) => {
              const active = [1, 2, 5, 8, 9, 12, 16, 18, 19, 23, 24, 28, 30].includes(index);
              return (
                <div
                  key={index}
                  className={`aspect-square rounded-md border ${active ? "border-app-teal bg-app-successSoft" : "border-app-line bg-white"}`}
                />
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-bold text-app-muted">NEXT ACTION</p>
          <h2 className="mt-1 text-xl font-extrabold">次に学ぶべきこと</h2>
          <div className="mt-5 space-y-3">
            {[
              ["設備カテゴリを10問解く", "正答率が57%と一番低いため、先に補強します。"],
              ["法令の復習を5問だけ確認", "点数は高めですが、忘れやすい語句を短く見直します。"],
              ["週末に模擬テスト", "今週の学習量なら30問の確認がちょうど良いです。"],
            ].map(([title, body], index) => (
              <div key={title} className="rounded-lg border border-app-line bg-white p-4">
                <div className="flex items-start gap-3">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-app-primary text-sm font-extrabold text-white">{index + 1}</span>
                  <div>
                    <p className="font-extrabold text-app-text">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-app-muted">{body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button data-testid="analytics-practice-link" className="button-primary" onClick={onStartPractice}>
              該当問題を解く
            </button>
            <button className="button-secondary" onClick={() => onGoToPage?.("questions")}>
              問題一覧を見る
            </button>
          </div>
        </Card>
      </div>
    </main>
  );
}
