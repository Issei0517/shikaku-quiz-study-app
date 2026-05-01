import { useEffect, useMemo, useState } from "react";
import AppLayout from "./components/AppLayout.jsx";
import {
  categories,
  csvFiles as initialCsvFiles,
  questions as initialQuestions,
} from "./data/sampleData.js";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import CsvPage from "./pages/CsvPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import PracticePage from "./pages/PracticePage.jsx";
import ProblemsPage from "./pages/ProblemsPage.jsx";
import ReviewPage from "./pages/ReviewPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

const pageMeta = {
  dashboard: {
    title: "ダッシュボード",
    subtitle: "今日の学習状況を確認して、次の問題に進みましょう。",
    component: DashboardPage,
  },
  practice: {
    title: "問題演習",
    subtitle: "問題を解きながら、理解できている範囲を確認しましょう。",
    component: PracticePage,
  },
  questions: {
    title: "問題一覧",
    subtitle: "カテゴリや年度で絞り込み、確認したい問題を探せます。",
    component: ProblemsPage,
  },
  review: {
    title: "復習リスト",
    subtitle: "間違えた問題や自信のない問題を優先して見直しましょう。",
    component: ReviewPage,
  },
  analytics: {
    title: "成績・分析",
    subtitle: "学習の進み具合と苦手分野をまとめて確認できます。",
    component: AnalyticsPage,
  },
  csv: {
    title: "CSV管理",
    subtitle: "問題データの追加と、読み込み済みファイルの管理ができます。",
    component: CsvPage,
  },
  settings: {
    title: "設定",
    subtitle: "出題方法、画面表示、通知、データ管理を調整できます。",
    component: SettingsPage,
  },
};

const defaultProblemFilters = {
  search: "",
  category: "all",
  year: "all",
  status: "all",
};

const defaultSettings = {
  order: "random",
  questionCount: 10,
  mixReview: true,
  sessionMinutes: 25,
  timer: true,
  autosave: true,
  theme: "light",
  fontSize: "standard",
  studyReminder: true,
  reviewReminder: true,
  weeklyReport: false,
};

const storageKeys = {
  questions: "quiz-app-questions",
  reviewIds: "quiz-app-review-ids",
  answers: "quiz-app-answers",
  csvFiles: "quiz-app-csv-files",
  settings: "quiz-app-settings",
  uiState: "quiz-app-ui-state",
};

const defaultUiState = {
  activePage: "dashboard",
  currentQuestionId: "",
  selectedChoice: null,
  showResult: false,
  selectedProblemId: "",
  selectedReviewId: "",
  problemFilters: defaultProblemFilters,
  analyticsPeriod: "30",
};

function getPageIdFromHash() {
  const pageId = window.location.hash.replace("#", "");
  return pageMeta[pageId] ? pageId : "dashboard";
}

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 保存できない環境でも画面操作は続けられるようにする。
  }
}

function normalizeStatus(status) {
  if (status === "correct") return "正解";
  if (status === "wrong") return "不正解";
  if (status === "review") return "復習";
  return "未回答";
}

export default function App() {
  const savedUiState = useMemo(() => readStorage(storageKeys.uiState, defaultUiState), []);
  const hashPageId = getPageIdFromHash();
  const initialPageId =
    window.location.hash && pageMeta[hashPageId]
      ? hashPageId
      : pageMeta[savedUiState.activePage]
        ? savedUiState.activePage
        : "dashboard";

  const [activePage, setActivePage] = useState(initialPageId);
  const [questions, setQuestions] = useState(() =>
    readStorage(storageKeys.questions, initialQuestions),
  );
  const [reviewIds, setReviewIds] = useState(() =>
    readStorage(
      storageKeys.reviewIds,
      initialQuestions.filter((question) => question.isReview).map((question) => question.id),
    ),
  );
  const [answers, setAnswers] = useState(() => readStorage(storageKeys.answers, {}));
  const [currentQuestionId, setCurrentQuestionId] = useState(
    savedUiState.currentQuestionId || questions[0]?.id || "",
  );
  const [selectedChoice, setSelectedChoice] = useState(savedUiState.selectedChoice ?? null);
  const [showResult, setShowResult] = useState(Boolean(savedUiState.showResult));
  const [selectedProblemId, setSelectedProblemId] = useState(
    savedUiState.selectedProblemId || questions[0]?.id || "",
  );
  const [selectedReviewId, setSelectedReviewId] = useState(
    savedUiState.selectedReviewId || reviewIds[0] || questions[0]?.id || "",
  );
  const [problemFilters, setProblemFilters] = useState({
    ...defaultProblemFilters,
    ...(savedUiState.problemFilters || {}),
  });
  const [csvFiles, setCsvFiles] = useState(() =>
    readStorage(storageKeys.csvFiles, initialCsvFiles),
  );
  const [settings, setSettings] = useState(() =>
    readStorage(storageKeys.settings, defaultSettings),
  );
  const [analyticsPeriod, setAnalyticsPeriod] = useState(savedUiState.analyticsPeriod || "30");
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const handleHashChange = () => setActivePage(getPageIdFromHash());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => writeStorage(storageKeys.questions, questions), [questions]);
  useEffect(() => writeStorage(storageKeys.reviewIds, reviewIds), [reviewIds]);
  useEffect(() => writeStorage(storageKeys.answers, answers), [answers]);
  useEffect(() => writeStorage(storageKeys.csvFiles, csvFiles), [csvFiles]);
  useEffect(() => writeStorage(storageKeys.settings, settings), [settings]);
  useEffect(
    () =>
      writeStorage(storageKeys.uiState, {
        activePage,
        currentQuestionId,
        selectedChoice,
        showResult,
        selectedProblemId,
        selectedReviewId,
        problemFilters,
        analyticsPeriod,
      }),
    [
      activePage,
      analyticsPeriod,
      currentQuestionId,
      problemFilters,
      selectedChoice,
      selectedProblemId,
      selectedReviewId,
      showResult,
    ],
  );

  const currentIndex = Math.max(
    0,
    questions.findIndex((question) => question.id === currentQuestionId),
  );
  const currentQuestion = questions[currentIndex] ?? questions[0];

  const reviewQuestions = useMemo(
    () => questions.filter((question) => reviewIds.includes(question.id)),
    [questions, reviewIds],
  );

  const filteredQuestions = useMemo(() => {
    const search = problemFilters.search.trim().toLowerCase();
    return questions.filter((question) => {
      const status = answers[question.id]?.correct
        ? "correct"
        : answers[question.id]
          ? "wrong"
          : reviewIds.includes(question.id)
            ? "review"
            : question.status;
      const text = `${question.id} ${question.category} ${question.question}`.toLowerCase();
      return (
        (!search || text.includes(search)) &&
        (problemFilters.category === "all" ||
          question.categoryId === problemFilters.category ||
          question.category === problemFilters.category) &&
        (problemFilters.year === "all" || question.year === problemFilters.year) &&
        (problemFilters.status === "all" || status === problemFilters.status)
      );
    });
  }, [answers, problemFilters, questions, reviewIds]);

  const stats = useMemo(() => {
    const answeredCount = Object.keys(answers).length;
    const correctCount = Object.values(answers).filter((answer) => answer.correct).length;
    const accuracy = answeredCount ? Math.round((correctCount / answeredCount) * 100) : 78;
    return {
      totalQuestions: questions.length,
      answeredCount,
      correctCount,
      accuracy,
      reviewCount: reviewIds.length,
      todayAnswered: Math.max(answeredCount, 36),
      streakDays: 14,
      studyMinutes: 45,
      analyticsPeriod,
    };
  }, [answers, analyticsPeriod, questions.length, reviewIds.length]);

  function goToPage(pageId) {
    window.location.hash = pageId;
    setActivePage(pageId);
  }

  function startPractice(questionId = currentQuestionId || questions[0]?.id) {
    const nextQuestionId = questionId || questions[0]?.id;
    if (nextQuestionId) {
      setCurrentQuestionId(nextQuestionId);
      setSelectedProblemId(nextQuestionId);
      setSelectedChoice(null);
      setShowResult(false);
    }
    goToPage("practice");
  }

  function chooseChoice(choiceIndex) {
    setSelectedChoice(choiceIndex);
    setShowResult(false);
  }

  function submitAnswer() {
    if (!currentQuestion || selectedChoice == null) return;
    const correct = selectedChoice === currentQuestion.answerIndex;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        choiceIndex: selectedChoice,
        correct,
        answeredAt: new Date().toISOString(),
      },
    }));
    if (!correct) {
      setReviewIds((prev) =>
        prev.includes(currentQuestion.id) ? prev : [...prev, currentQuestion.id],
      );
    }
    setShowResult(true);
  }

  function moveQuestion(step) {
    const nextIndex = Math.min(Math.max(currentIndex + step, 0), questions.length - 1);
    const nextQuestion = questions[nextIndex];
    if (!nextQuestion) return;
    setCurrentQuestionId(nextQuestion.id);
    setSelectedProblemId(nextQuestion.id);
    setSelectedChoice(null);
    setShowResult(false);
  }

  function toggleReview(questionId) {
    setReviewIds((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId],
    );
    setSavedMessage(
      reviewIds.includes(questionId) ? "復習リストから外しました。" : "復習リストに追加しました。",
    );
  }

  function markUnderstood(questionId) {
    setReviewIds((prev) => prev.filter((id) => id !== questionId));
    const nextReviewId = reviewQuestions.find((question) => question.id !== questionId)?.id;
    if (nextReviewId) setSelectedReviewId(nextReviewId);
    setSavedMessage("理解済みにしました。");
  }

  function updateProblemFilter(name, value) {
    setProblemFilters((prev) => ({ ...prev, [name]: value }));
  }

  async function addCsv(file) {
    if (!file) return;
    const text = await file.text();
    const rows = text.split(/\r?\n/).filter(Boolean).length > 0
      ? text.split(/\r?\n/).filter(Boolean).length - 1
      : 0;
    const nextFile = {
      id: `csv-${Date.now()}`,
      name: file.name,
      rows: Math.max(rows, 0),
      importedAt: new Date().toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "読み込み済み",
    };
    setCsvFiles((prev) => [nextFile, ...prev]);
    setSavedMessage(`${file.name} を追加しました。`);
  }

  function previewCsv(csvId) {
    const file = csvFiles.find((item) => item.id === csvId);
    setSavedMessage(file ? `${file.name} の内容を確認できます。` : "");
  }

  function removeCsv(csvId) {
    const file = csvFiles.find((item) => item.id === csvId);
    setCsvFiles((prev) => prev.filter((item) => item.id !== csvId));
    setSavedMessage(file ? `${file.name} を一覧から削除しました。` : "");
  }

  function changeSetting(name, value) {
    setSettings((prev) => ({ ...prev, [name]: value }));
  }

  function saveSettings() {
    writeStorage(storageKeys.settings, settings);
    setSavedMessage("設定を保存しました。");
  }

  const page = pageMeta[activePage];
  const PageComponent = page.component;
  const sharedProps = {
    questions,
    categories,
    currentQuestion,
    currentIndex,
    selectedChoice,
    showResult,
    reviewIds,
    reviewQuestions,
    filteredQuestions,
    selectedProblemId,
    selectedReviewId,
    problemFilters,
    csvFiles,
    settings,
    stats,
    analyticsPeriod,
    savedMessage,
    answers,
    normalizeStatus,
    onGoToPage: goToPage,
    onStartPractice: startPractice,
    onChooseChoice: chooseChoice,
    onSubmitAnswer: submitAnswer,
    onNextQuestion: () => moveQuestion(1),
    onPrevQuestion: () => moveQuestion(-1),
    onToggleReview: toggleReview,
    onSelectProblem: setSelectedProblemId,
    onProblemSearch: (value) => updateProblemFilter("search", value),
    onProblemFilter: updateProblemFilter,
    onSelectReview: setSelectedReviewId,
    onMarkUnderstood: markUnderstood,
    onAddCsv: addCsv,
    onPreviewCsv: previewCsv,
    onRemoveCsv: removeCsv,
    onChangeSetting: changeSetting,
    onSaveSettings: saveSettings,
    onSetAnalyticsPeriod: setAnalyticsPeriod,
  };

  return (
    <AppLayout activeNav={activePage} title={page.title} subtitle={page.subtitle}>
      <PageComponent {...sharedProps} />
    </AppLayout>
  );
}
