import {
  AlertTriangle,
  ArrowRight,
  BookOpenCheck,
  Clock3,
  Flame,
  RotateCcw,
} from "lucide-react";
import { useMemo, useState } from "react";

const sampleReviewItems = [
  { id: "sample-review-1", title: "労働安全衛生法の目的", category: "法令", priority: "高", due: "今日", rate: 42, tab: "今日" },
  { id: "sample-review-2", title: "ヒューマンエラー対策", category: "安全管理", priority: "中", due: "明日", rate: 58, tab: "苦手" },
  { id: "sample-review-3", title: "設備点検の記録", category: "現場管理", priority: "低", due: "3日後", rate: 76, tab: "未復習" },
];

const tabs = ["すべて", "今日", "苦手", "未復習"];

function Card({ children, className = "" }) {
  return <section className={`panel ${className}`}>{children}</section>;
}

function Badge({ children, tone = "blue" }) {
  const tones = {
    blue: "bg-app-primarySoft text-app-primary",
    amber: "bg-app-reviewSoft text-app-review",
    red: "bg-app-errorSoft text-app-error",
    green: "bg-app-successSoft text-app-success",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${tones[tone]}`}>
      {children}
    </span>
  );
}

function normalizeReviewItem(question, index) {
  const title = question.title || question.question || question.text || `復習問題 ${index + 1}`;
  return {
    ...question,
    id: question.id || question.questionId || `review-${index}`,
    title,
    category: question.category || "未分類",
    priority: question.priority || (question.isWeak ? "高" : "中"),
    due: question.due || question.nextReview || "今日",
    rate: question.rate ?? question.correctRate ?? question.lastRate ?? 50,
    tab: question.tab || question.status || (question.isWeak ? "苦手" : "今日"),
    body: question.body || question.question || question.text || "問題文を選択すると、ここに内容が表示されます。",
    previousAnswer: question.previousAnswer || question.lastAnswer || "前回の解答記録はまだありません。",
    explanation: question.explanation || "解説は問題データに登録されている内容が表示されます。",
  };
}

export default function ReviewPage({
  reviewQuestions = sampleReviewItems,
  selectedReviewId,
  onSelectReview,
  onStartPractice,
  onMarkUnderstood,
}) {
  const [activeTab, setActiveTab] = useState("すべて");
  const [localSelectedId, setLocalSelectedId] = useState(selectedReviewId);
  const reviewItems = useMemo(
    () => reviewQuestions.map((question, index) => normalizeReviewItem(question, index)),
    [reviewQuestions],
  );
  const currentSelectedId = selectedReviewId ?? localSelectedId ?? reviewItems[0]?.id;
  const visibleItems = activeTab === "すべて" ? reviewItems : reviewItems.filter((item) => item.tab === activeTab || item.due === activeTab);
  const selectedItem = reviewItems.find((item) => item.id === currentSelectedId) || visibleItems[0] || reviewItems[0];

  const handleSelect = (questionId) => {
    setLocalSelectedId(questionId);
    onSelectReview?.(questionId);
  };

  return (
    <main data-testid="review-page" className="page-content mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="muted-label">REVIEW</p>
          <h1 className="mt-2 text-3xl font-extrabold text-app-text">復習リスト</h1>
          <p className="mt-2 text-sm text-app-muted">間違えた問題や自信のない問題を、優先して見直します。</p>
        </div>
        <button className="button-primary" onClick={() => selectedItem && onStartPractice?.(selectedItem.id)}>
          今日の復習を始める
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["復習する問題", "24問", BookOpenCheck, "blue"],
          ["優先度 高", "8問", Flame, "amber"],
          ["平均復習間隔", "2.4日", Clock3, "green"],
        ].map(([label, value, Icon, tone]) => (
          <Card key={label} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-app-muted">{label}</p>
                <p className="mt-2 text-3xl font-extrabold">{value}</p>
              </div>
              <div className="rounded-lg bg-app-soft p-3 text-app-primary">
                <Icon size={24} />
              </div>
            </div>
            <div className="mt-4 h-2 rounded-full bg-app-soft">
              <div className={`progress-fill h-2 rounded-full ${tone === "amber" ? "bg-app-review" : tone === "green" ? "bg-app-teal" : "bg-app-primary"}`} style={{ width: tone === "amber" ? "72%" : tone === "green" ? "54%" : "66%" }} />
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-5">
          <div className="flex flex-wrap gap-2 border-b border-app-line pb-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                data-testid={tab === "すべて" ? "review-tab-all" : undefined}
                onClick={() => setActiveTab(tab)}
                className={`rounded-md px-4 py-2 text-sm font-bold ${activeTab === tab ? "bg-app-primary text-white" : "bg-app-soft text-app-body"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-3">
            {visibleItems.map((item) => (
              <button
                key={item.id}
                data-testid={`review-item-${item.id}`}
                onClick={() => handleSelect(item.id)}
                className={`w-full rounded-lg border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-soft ${selectedItem?.id === item.id ? "border-app-review bg-app-reviewSoft/50" : "border-app-line bg-white"}`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={item.priority === "高" ? "red" : item.priority === "中" ? "amber" : "green"}>
                        優先度 {item.priority}
                      </Badge>
                      <span className="text-xs font-bold text-app-muted">{item.category}</span>
                    </div>
                    <h2 className="mt-3 text-lg font-extrabold text-app-text">{item.title}</h2>
                    <p className="mt-1 text-sm text-app-muted">次回確認: {item.due}</p>
                  </div>
                  <div className="min-w-32">
                    <p className="text-right text-sm font-bold text-app-muted">前回正答率 {item.rate}%</p>
                    <div className="mt-2 h-2 rounded-full bg-app-soft">
                      <div className="h-2 rounded-full bg-app-primary" style={{ width: `${item.rate}%` }} />
                    </div>
                  </div>
                </div>
              </button>
            ))}
            {visibleItems.length === 0 && (
              <div className="rounded-lg border border-app-line bg-white p-5 text-sm font-bold text-app-muted">
                このタブに表示する復習問題はありません。
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          {selectedItem ? (
            <>
              <div className="flex items-center justify-between">
                <Badge tone="amber">選択中</Badge>
                <RotateCcw className="text-app-muted" size={20} />
              </div>
              <h2 className="mt-4 text-2xl font-extrabold">{selectedItem.title}</h2>
              <p className="mt-3 text-app-body">{selectedItem.body}</p>

              <div className="mt-5 rounded-lg border border-app-error bg-app-errorSoft p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-app-error">
                  <AlertTriangle size={18} />
                  前回の解答
                </div>
                <p className="mt-2 text-sm text-app-body">{selectedItem.previousAnswer}</p>
              </div>

              <div className="mt-4 rounded-lg border border-app-line bg-app-soft p-4">
                <p className="text-sm font-bold text-app-text">解説</p>
                <p className="mt-2 text-sm leading-7 text-app-body">{selectedItem.explanation}</p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button data-testid="review-start" className="button-secondary w-full" onClick={() => onStartPractice?.(selectedItem.id)}>
                  もう一度解く
                </button>
                <button data-testid="review-understood" className="button-primary w-full" onClick={() => onMarkUnderstood?.(selectedItem.id)}>
                  理解済みにする
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm font-bold text-app-muted">復習問題はありません。</p>
          )}
        </Card>
      </div>
    </main>
  );
}
