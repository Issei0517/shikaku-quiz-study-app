import { useMemo, useState } from "react";
import { Eye, Search, Star } from "lucide-react";
import { categories as sampleCategories, questions as sampleQuestions } from "../data/sampleData.js";

const statusLabels = {
  correct: "正解",
  wrong: "不正解",
  review: "復習",
  unanswered: "未回答",
};

function StatusBadge({ status }) {
  const label = statusLabels[status] || status || "未回答";
  const className =
    label === "正解"
      ? "bg-app-successSoft text-app-success"
      : label === "不正解"
        ? "bg-app-errorSoft text-app-error"
        : label === "復習"
          ? "bg-app-reviewSoft text-app-review"
          : "bg-app-soft text-app-muted";
  return <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${className}`}>{label}</span>;
}

function normalizeId(id) {
  return String(id).replace(/[^a-zA-Z0-9_-]/g, "-");
}

export default function ProblemsPage({
  questions = sampleQuestions,
  categories = sampleCategories,
  filteredQuestions,
  selectedProblemId,
  problemFilters = {},
  onSelectProblem,
  onStartPractice,
  onProblemSearch,
  onProblemFilter,
}) {
  const [localSelectedId, setLocalSelectedId] = useState(selectedProblemId || questions[0]?.id);
  const [localFilters, setLocalFilters] = useState({ search: "", category: "all", year: "all", status: "all" });

  const filters = {
    search: problemFilters.search ?? localFilters.search,
    category: problemFilters.category ?? localFilters.category,
    year: problemFilters.year ?? localFilters.year,
    status: problemFilters.status ?? localFilters.status,
  };

  const visibleQuestions = useMemo(() => {
    if (filteredQuestions) return filteredQuestions;
    return questions.filter((question) => {
      const keyword = filters.search.trim().toLowerCase();
      const matchesKeyword =
        !keyword ||
        question.id.toLowerCase().includes(keyword) ||
        question.question.toLowerCase().includes(keyword) ||
        question.category.toLowerCase().includes(keyword);
      const matchesCategory = filters.category === "all" || question.categoryId === filters.category || question.category === filters.category;
      const matchesYear = filters.year === "all" || question.year === filters.year;
      const matchesStatus = filters.status === "all" || question.status === filters.status;
      return matchesKeyword && matchesCategory && matchesYear && matchesStatus;
    });
  }, [filteredQuestions, filters.category, filters.search, filters.status, filters.year, questions]);

  const activeSelectedId = selectedProblemId || localSelectedId || visibleQuestions[0]?.id;
  const selectedProblem = questions.find((question) => question.id === activeSelectedId) || visibleQuestions[0] || questions[0];
  const years = [...new Set(questions.map((question) => question.year))];

  const handleSearch = (value) => {
    setLocalFilters((current) => ({ ...current, search: value }));
    onProblemSearch?.(value);
  };

  const handleFilter = (name, value) => {
    setLocalFilters((current) => ({ ...current, [name]: value }));
    onProblemFilter?.(name, value);
  };

  const handleSelectProblem = (questionId) => {
    setLocalSelectedId(questionId);
    onSelectProblem?.(questionId);
  };

  const handleStartPractice = () => {
    if (selectedProblem) onStartPractice?.(selectedProblem.id);
  };

  return (
    <main data-testid="problems-page" className="page-content">
      <div className="mb-6">
        <p className="muted-label">問題一覧</p>
        <h1 className="mt-2 text-3xl font-extrabold text-app-text">問題を探す</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="space-y-5">
          <div className="panel p-5">
            <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_180px_180px_160px]">
              <label className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" size={18} />
                <input
                  data-testid="problems-search"
                  className="input-like w-full pl-10"
                  placeholder="キーワードで検索"
                  value={filters.search}
                  onChange={(event) => handleSearch(event.target.value)}
                />
              </label>
              <select data-testid="problems-category-filter" className="input-like" value={filters.category} onChange={(event) => handleFilter("category", event.target.value)}>
                <option value="all">すべてのカテゴリ</option>
                {categories.map((category) => (
                  <option key={category.id || category.name} value={category.id || category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select data-testid="problems-year-filter" className="input-like" value={filters.year} onChange={(event) => handleFilter("year", event.target.value)}>
                <option value="all">すべての年度</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select data-testid="problems-status-filter" className="input-like" value={filters.status} onChange={(event) => handleFilter("status", event.target.value)}>
                <option value="all">すべての状態</option>
                <option value="unanswered">未回答</option>
                <option value="correct">正解</option>
                <option value="wrong">不正解</option>
                <option value="review">復習</option>
              </select>
            </div>
          </div>

          <div className="panel overflow-hidden">
            <div className="grid grid-cols-[100px_1fr_110px_100px_80px] border-b border-app-line bg-app-soft px-5 py-3 text-xs font-extrabold text-app-muted">
              <span>問題ID</span>
              <span>カテゴリ</span>
              <span>年度</span>
              <span>状態</span>
              <span>正答率</span>
            </div>
            {visibleQuestions.map((problem, index) => (
              <button
                key={problem.id}
                type="button"
                data-testid={`problem-row-${normalizeId(problem.id)}`}
                onClick={() => handleSelectProblem(problem.id)}
                className={`grid w-full grid-cols-[100px_1fr_110px_100px_80px] items-center px-5 py-4 text-left transition hover:bg-app-primarySoft/50 ${
                  activeSelectedId === problem.id ? "bg-app-primarySoft/60" : "bg-white"
                } ${index !== visibleQuestions.length - 1 ? "border-b border-app-line" : ""}`}
              >
                <span className="font-extrabold text-app-text">{problem.id}</span>
                <span className="font-bold text-app-body">{problem.category}</span>
                <span className="text-app-muted">{problem.year}</span>
                <StatusBadge status={problem.status} />
                <span className="font-bold text-app-body">{problem.correctRate ?? "-"}%</span>
              </button>
            ))}
            {visibleQuestions.length === 0 && <div className="bg-white px-5 py-8 text-center font-bold text-app-muted">条件に合う問題がありません。</div>}
          </div>
        </section>

        <aside className="panel p-6">
          {selectedProblem ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="muted-label">問題プレビュー</p>
                  <h2 className="mt-2 text-xl font-extrabold">
                    {selectedProblem.id} {selectedProblem.category}
                  </h2>
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-md bg-app-reviewSoft text-app-review">
                  <Star size={19} />
                </span>
              </div>

              <div className="mt-6 rounded-lg bg-app-soft p-5">
                <p className="text-sm font-bold text-app-muted">問題文</p>
                <p className="mt-3 text-lg font-extrabold leading-8 text-app-text">{selectedProblem.question}</p>
              </div>

              <div className="mt-5 space-y-3">
                {selectedProblem.choices.map((choice, index) => (
                  <div key={`${selectedProblem.id}-${choice}`} className="rounded-lg border border-app-line bg-white p-4">
                    <span className="mr-3 font-extrabold text-app-primary">{String.fromCharCode(65 + index)}</span>
                    <span className="text-sm font-bold text-app-body">{choice}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-lg border border-app-line p-4">
                <p className="text-sm font-extrabold text-app-text">学習メモ</p>
                <p className="mt-2 text-sm leading-6 text-app-muted">
                  {selectedProblem.correctRate}%の正答率です。解く前にカテゴリ「{selectedProblem.category}」の基本を確認すると進めやすくなります。
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <button type="button" data-testid="problem-preview-detail" onClick={() => handleSelectProblem(selectedProblem.id)} className="button-secondary flex-1">
                  <Eye size={17} />
                  詳細
                </button>
                <button type="button" data-testid="start-selected-problem" onClick={handleStartPractice} className="button-primary flex-1">
                  この問題を解く
                </button>
              </div>
            </>
          ) : (
            <p className="font-bold text-app-muted">プレビューできる問題がありません。</p>
          )}
        </aside>
      </div>
    </main>
  );
}
