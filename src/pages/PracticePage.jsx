import { useMemo, useState } from "react";
import { BookmarkPlus, CheckCircle2, ChevronLeft, ChevronRight, Clock, FileText, Target, XCircle } from "lucide-react";
import { categories as sampleCategories, questions as sampleQuestions } from "../data/sampleData.js";

const toneMap = {
  blue: "bg-app-primary",
  teal: "bg-app-teal",
  amber: "bg-app-review",
  indigo: "bg-app-primary",
  rose: "bg-app-error",
};

function ProgressBar({ value, tone = "bg-app-primary" }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-app-soft">
      <div className={`progress-fill h-full rounded-full ${tone}`} style={{ width: `${value}%` }} />
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-app-line bg-white p-4">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-app-primarySoft text-app-primary">
          <Icon size={20} />
        </span>
        <div>
          <p className="text-xs font-bold text-app-muted">{label}</p>
          <p className="mt-1 text-xl font-extrabold text-app-text">{value}</p>
        </div>
      </div>
    </div>
  );
}

function choiceLabel(index) {
  return String.fromCharCode(65 + index);
}

export default function PracticePage({
  questions = sampleQuestions,
  categories = sampleCategories,
  currentQuestion,
  currentIndex = 0,
  selectedChoice,
  showResult = false,
  reviewIds = [],
  onChooseChoice,
  onSubmitAnswer,
  onNextQuestion,
  onPrevQuestion,
  onToggleReview,
}) {
  const [localIndex, setLocalIndex] = useState(0);
  const [localChoice, setLocalChoice] = useState(null);
  const [localShowResult, setLocalShowResult] = useState(false);
  const [localReviewIds, setLocalReviewIds] = useState(() => sampleQuestions.filter((question) => question.isReview).map((question) => question.id));

  const activeIndex = currentQuestion ? currentIndex : localIndex;
  const question = currentQuestion || questions[activeIndex] || questions[0];
  const activeChoice = selectedChoice ?? localChoice;
  const resultVisible = showResult || localShowResult;
  const activeReviewIds = reviewIds.length ? reviewIds : localReviewIds;
  const isReview = question ? activeReviewIds.includes(question.id) : false;
  const isCorrect = question && activeChoice === question.answerIndex;
  const answeredCount = questions.filter((item) => item.status && item.status !== "unanswered").length;
  const progressPercent = questions.length ? Math.round(((activeIndex + 1) / questions.length) * 100) : 0;

  const categoryStats = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        done: category.answered ?? questions.filter((item) => item.categoryId === category.id && item.status !== "unanswered").length,
        total: category.total ?? questions.filter((item) => item.categoryId === category.id).length,
      })),
    [categories, questions],
  );

  const handleChooseChoice = (choiceIndex) => {
    setLocalChoice(choiceIndex);
    setLocalShowResult(false);
    onChooseChoice?.(choiceIndex);
  };

  const handleSubmit = () => {
    setLocalShowResult(true);
    onSubmitAnswer?.();
  };

  const handleNext = () => {
    setLocalIndex((index) => Math.min(index + 1, questions.length - 1));
    setLocalChoice(null);
    setLocalShowResult(false);
    onNextQuestion?.();
  };

  const handlePrev = () => {
    setLocalIndex((index) => Math.max(index - 1, 0));
    setLocalChoice(null);
    setLocalShowResult(false);
    onPrevQuestion?.();
  };

  const handleToggleReview = () => {
    if (!question) return;
    setLocalReviewIds((ids) => (ids.includes(question.id) ? ids.filter((id) => id !== question.id) : [...ids, question.id]));
    onToggleReview?.(question.id);
  };

  if (!question) {
    return (
      <main data-testid="practice-page" className="page-content">
        <section className="panel p-8 text-app-muted">表示できる問題がありません。</section>
      </main>
    );
  }

  return (
    <main data-testid="practice-page" className="page-content">
      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <section className="panel p-6">
            <p className="muted-label">現在の試験</p>
            <h1 className="mt-2 text-2xl font-extrabold text-app-text">資格試験 問題演習</h1>
            <p className="mt-3 text-sm leading-6 text-app-muted">実際の問題を解きながら、カテゴリごとの理解度を確認します。</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <StatCard icon={FileText} label="問題数" value={`${questions.length}問`} />
              <StatCard icon={Clock} label="目安時間" value={`${Math.max(5, questions.length * 2)}分`} />
            </div>
          </section>

          <section className="panel p-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="muted-label">演習の進み具合</p>
                <p className="mt-2 text-3xl font-extrabold">{progressPercent}%</p>
              </div>
              <span className="rounded-full bg-app-successSoft px-3 py-1 text-xs font-bold text-app-success">
                {activeIndex + 1} / {questions.length}問
              </span>
            </div>
            <div className="mt-4">
              <ProgressBar value={progressPercent} tone="bg-app-teal" />
            </div>
          </section>

          <section className="panel p-6">
            <div className="flex items-center justify-between">
              <p className="muted-label">カテゴリ別進捗</p>
              <Target size={18} className="text-app-muted" />
            </div>
            <div className="mt-5 space-y-4">
              {categoryStats.map((category) => {
                const percent = category.total ? Math.round((category.done / category.total) * 100) : 0;
                return (
                  <div key={category.id || category.name}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-bold text-app-body">{category.name}</span>
                      <span className="text-app-muted">
                        {category.done}/{category.total}
                      </span>
                    </div>
                    <ProgressBar value={percent} tone={toneMap[category.color] || "bg-app-primary"} />
                  </div>
                );
              })}
            </div>
          </section>
        </aside>

        <section className="panel min-h-[720px] p-6 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-app-line pb-5">
            <div>
              <p className="muted-label">
                問題 {activeIndex + 1} / {questions.length} ・ {question.year}
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-app-text lg:text-3xl">{question.question}</h2>
            </div>
            <span className="rounded-full bg-app-reviewSoft px-4 py-2 text-sm font-bold text-app-review">
              {isReview ? "復習リストに追加済み" : question.category}
            </span>
          </div>

          <div className="mt-8 rounded-lg bg-app-soft p-5 text-lg leading-8 text-app-body">
            {question.difficulty}レベルの問題です。最も適切な選択肢を選んでください。
          </div>

          <div className="mt-6 space-y-3">
            {question.choices.map((choice, index) => {
              const selected = activeChoice === index;
              const correct = resultVisible && index === question.answerIndex;
              const wrong = resultVisible && selected && !correct;
              const stateClass = correct
                ? "border-app-success bg-app-successSoft text-app-success"
                : wrong
                  ? "border-app-error bg-app-errorSoft text-app-error"
                  : selected
                    ? "border-app-primary bg-app-primarySoft text-app-primary"
                    : "border-app-line bg-white text-app-body hover:border-app-primary";
              return (
                <button
                  key={`${question.id}-${choice}`}
                  type="button"
                  data-testid={`practice-choice-${index}`}
                  onClick={() => handleChooseChoice(index)}
                  className={`flex w-full items-start gap-4 rounded-lg border p-4 text-left transition ${stateClass}`}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-white text-sm font-extrabold">{choiceLabel(index)}</span>
                  <span className="pt-1 text-base font-bold leading-7">{choice}</span>
                </button>
              );
            })}
          </div>

          {resultVisible && (
            <div className="mt-8 rounded-lg border border-app-line bg-white p-5">
              <div className={`flex items-center gap-2 ${isCorrect ? "text-app-success" : "text-app-error"}`}>
                {isCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                <p className="font-extrabold">{isCorrect ? "正解です" : "不正解です"}</p>
              </div>
              <p className="mt-3 leading-7 text-app-body">
                正解は{choiceLabel(question.answerIndex)}です。{question.explanation}
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button type="button" data-testid="practice-review-toggle" onClick={handleToggleReview} className="button-secondary">
              <BookmarkPlus size={18} />
              {isReview ? "復習から解除" : "復習に追加"}
            </button>
            <button type="button" data-testid="practice-prev" onClick={handlePrev} disabled={activeIndex === 0} className="button-secondary disabled:opacity-50">
              <ChevronLeft size={18} />
              前へ
            </button>
            <button type="button" data-testid="practice-submit" onClick={handleSubmit} disabled={activeChoice === null || activeChoice === undefined} className="button-secondary disabled:opacity-50">
              回答する
            </button>
            <button type="button" data-testid="practice-next" onClick={handleNext} disabled={activeIndex >= questions.length - 1} className="button-primary disabled:opacity-50">
              次へ
              <ChevronRight size={18} />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
