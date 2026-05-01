export const categories = [
  { id: "network", name: "ネットワーク", color: "blue", total: 42, answered: 31, accuracy: 78 },
  { id: "security", name: "セキュリティ", color: "teal", total: 38, answered: 28, accuracy: 82 },
  { id: "database", name: "データベース", color: "amber", total: 30, answered: 17, accuracy: 65 },
  { id: "strategy", name: "経営戦略", color: "indigo", total: 24, answered: 13, accuracy: 58 },
  { id: "management", name: "プロジェクト管理", color: "rose", total: 20, answered: 11, accuracy: 70 },
];

export const questions = [
  {
    id: "q-001",
    year: "令和5年 秋",
    categoryId: "network",
    category: "ネットワーク",
    difficulty: "標準",
    status: "review",
    isReview: true,
    correctRate: 64,
    question: "TCP/IPネットワークにおいて、IPアドレスからMACアドレスを調べるために使われるプロトコルはどれか。",
    choices: ["ARP", "DNS", "HTTP", "SMTP"],
    answerIndex: 0,
    explanation: "ARPは、同じネットワーク内でIPアドレスに対応するMACアドレスを調べるための仕組みです。",
    lastAnsweredAt: "2026-04-29",
  },
  {
    id: "q-002",
    year: "令和5年 春",
    categoryId: "security",
    category: "セキュリティ",
    difficulty: "やや難しい",
    status: "correct",
    isReview: false,
    correctRate: 72,
    question: "情報セキュリティの三要素として、機密性、完全性と並ぶものはどれか。",
    choices: ["可用性", "拡張性", "保守性", "移植性"],
    answerIndex: 0,
    explanation: "機密性、完全性、可用性は情報セキュリティの基本となる三要素です。",
    lastAnsweredAt: "2026-04-28",
  },
  {
    id: "q-003",
    year: "令和4年 秋",
    categoryId: "database",
    category: "データベース",
    difficulty: "標準",
    status: "wrong",
    isReview: true,
    correctRate: 51,
    question: "関係データベースで、表の行を一意に識別するために設定するものはどれか。",
    choices: ["主キー", "外部キー", "ビュー", "インデックス"],
    answerIndex: 0,
    explanation: "主キーは、表の中で各行を一意に識別するために使います。",
    lastAnsweredAt: "2026-04-27",
  },
  {
    id: "q-004",
    year: "令和4年 春",
    categoryId: "strategy",
    category: "経営戦略",
    difficulty: "基礎",
    status: "unanswered",
    isReview: false,
    correctRate: 69,
    question: "SWOT分析で、自社の内部環境に分類されるものはどれか。",
    choices: ["強み", "市場機会", "法規制の変化", "競合の参入"],
    answerIndex: 0,
    explanation: "強みと弱みは内部環境、機会と脅威は外部環境として整理します。",
    lastAnsweredAt: null,
  },
  {
    id: "q-005",
    year: "令和3年 秋",
    categoryId: "management",
    category: "プロジェクト管理",
    difficulty: "標準",
    status: "correct",
    isReview: false,
    correctRate: 76,
    question: "プロジェクトの作業を細かい単位に分解して階層的に示すものはどれか。",
    choices: ["WBS", "SLA", "RFI", "BCP"],
    answerIndex: 0,
    explanation: "WBSは作業分解構成図のことで、プロジェクト作業を管理しやすい単位に分けます。",
    lastAnsweredAt: "2026-04-25",
  },
];

export const learningTrend = [
  { date: "4/24", answered: 12, correct: 8, minutes: 28 },
  { date: "4/25", answered: 18, correct: 14, minutes: 41 },
  { date: "4/26", answered: 10, correct: 7, minutes: 22 },
  { date: "4/27", answered: 24, correct: 15, minutes: 53 },
  { date: "4/28", answered: 16, correct: 13, minutes: 36 },
  { date: "4/29", answered: 21, correct: 17, minutes: 48 },
  { date: "4/30", answered: 9, correct: 7, minutes: 19 },
];

export const weakCategories = [
  { id: "strategy", name: "経営戦略", accuracy: 58, reviewCount: 8, priority: "高" },
  { id: "database", name: "データベース", accuracy: 65, reviewCount: 6, priority: "中" },
  { id: "management", name: "プロジェクト管理", accuracy: 70, reviewCount: 4, priority: "中" },
];

export const csvFiles = [
  { id: "csv-001", name: "基本情報_令和5年秋.csv", rows: 80, importedAt: "2026-04-28 21:15", status: "読み込み済み" },
  { id: "csv-002", name: "セキュリティ分野_復習用.csv", rows: 36, importedAt: "2026-04-27 19:42", status: "読み込み済み" },
  { id: "csv-003", name: "経営戦略_追加問題.csv", rows: 24, importedAt: "2026-04-26 08:30", status: "確認が必要" },
];

export const reviewItems = questions
  .filter((question) => question.isReview)
  .map((question, index) => ({
    ...question,
    priority: index === 0 ? "高" : "中",
    reason: index === 0 ? "前回不正解・正答率が低め" : "理解を定着させたい問題",
  }));

export const settingsSections = [
  {
    id: "quiz",
    title: "出題設定",
    items: [
      { id: "questionCount", label: "1回の問題数", value: "10問" },
      { id: "shuffleChoices", label: "選択肢を並び替える", value: true },
      { id: "reviewOnly", label: "復習問題を優先する", value: true },
    ],
  },
  {
    id: "session",
    title: "学習セッション",
    items: [
      { id: "dailyGoal", label: "1日の目標", value: "20問" },
      { id: "reminder", label: "学習リマインド", value: true },
      { id: "showTimer", label: "タイマーを表示", value: false },
    ],
  },
  {
    id: "theme",
    title: "表示",
    items: [
      { id: "font", label: "フォント", value: "Noto Sans JP" },
      { id: "density", label: "表示密度", value: "標準" },
    ],
  },
];

export const dashboardSummary = {
  totalQuestions: 154,
  answeredQuestions: 100,
  reviewQuestions: 14,
  accuracy: 74,
  todayAnswered: 9,
  studyMinutes: 19,
  streakDays: 6,
};

export const navItems = [
  { id: "dashboard", label: "ダッシュボード", href: "#dashboard" },
  { id: "practice", label: "問題演習", href: "#practice" },
  { id: "questions", label: "問題一覧", href: "#questions" },
  { id: "review", label: "復習リスト", href: "#review" },
  { id: "analytics", label: "成績・分析", href: "#analytics" },
  { id: "csv", label: "CSV管理", href: "#csv" },
  { id: "settings", label: "設定", href: "#settings" },
];
