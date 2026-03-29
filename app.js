const REQUIRED_COLUMNS = [
  "id",
  "year",
  "category",
  "question",
  "choice1",
  "choice2",
  "choice3",
  "choice4",
  "answer",
  "explanation",
];
const STORAGE_KEY = "quiz-study-review-flags";
const AUTOLOAD_MANIFEST_PATH = "./public/csv/index.json";
const EMBEDDED_AUTOLOAD_FILES = {
  "questions.csv": `id,year,category,question,choice1,choice2,choice3,choice4,answer,explanation
nw-2024-01,2024,ネットワーク,"OSI参照モデルでルータが主に動作する層はどれか。",物理層,データリンク層,ネットワーク層,トランスポート層,3,"ルータはIPアドレスを見て経路制御するため、主にネットワーク層で動作します。"
db-2024-02,2024,データベース,"主キーの説明として最も適切なものはどれか。",表の行を一意に識別する列,必ず数値型になる列,外部表だけに存在する列,更新できない列,1,"主キーは各行を重複なく識別するための列です。"
sec-2023-03,2023,セキュリティ,"二要素認証の要素の組み合わせとして適切なものはどれか。",IDとパスワード,パスワードと秘密の質問,ICカードと暗証番号,メールアドレスと氏名,3,"二要素認証では知識・所持・生体など異なる要素を組み合わせます。"
pm-2023-04,2023,マネジメント,"WBSの主な目的はどれか。",障害発生時の責任追及,作業の分解と管理,ネットワーク監視,契約書の自動作成,2,"WBSは作業を階層的に分解し、スケジュールや進捗を管理しやすくします。"`,
  "otsu4-sample.csv": `id,year,category,question,choice1,choice2,choice3,choice4,answer,explanation
otsu4-001,乙四,基礎,"燃焼の成立に必要な3要素の組合せとして正しいものはどれか。",可燃物・酸素供給源・点火源,水・空気・光,窒素・可燃物・蒸気,可燃物・二酸化炭素・点火源,1,"燃焼の3要素は可燃物、酸素供給源、点火源です。"
otsu4-002,乙四,基礎,"第4類危険物の性質として最も適切なものはどれか。",水と反応して可燃性ガスを発生しやすい,引火性液体である,自己燃焼性が極めて高い,酸化性の固体である,2,"乙種第4類は引火性液体を対象とします。"
otsu4-003,乙四,法令,"ガソリンの指定数量はどれか。",50L,100L,200L,500L,3,"ガソリンの指定数量は200Lです。"
otsu4-004,乙四,法令,"製造所等に設ける消火設備の区分を決める主な要素として適切なものはどれか。",従業員の勤続年数,危険物の種類と取扱数量,建物の築年数のみ,事業所の売上高,2,"消火設備は危険物の性質、指定数量の倍数、建築物の構造などを基に区分されます。"
otsu4-005,乙四,性状,"ガソリンの蒸気について正しいものはどれか。",空気より軽く上方に滞留しやすい,空気より重く低所に滞留しやすい,水に非常によく溶ける,不燃性である,2,"ガソリン蒸気は空気より重く、低い場所に滞留しやすい性質があります。"
otsu4-006,乙四,性状,"灯油の性状として適切なものはどれか。",引火点はガソリンより低い,常温で激しく自己反応する,水に溶けにくい可燃性液体である,第1石油類に該当する,3,"灯油は水に溶けにくい可燃性液体で、第2石油類に分類されます。"
otsu4-007,乙四,消火,"油火災に対する初期消火方法として適切なものはどれか。",大量の水を勢いよく注ぐ,泡消火剤や粉末消火剤を用いる,可燃物をかき混ぜる,容器のふたを開けて放熱する,2,"第4類危険物による火災には泡、粉末、二酸化炭素などの消火設備が有効です。"
otsu4-008,乙四,法令,"製造所等の保安距離や保有空地を考える目的として適切なものはどれか。",景観を良くするため,周辺への延焼や災害拡大を防ぐため,従業員の休憩場所を確保するため,搬入車両を駐車しやすくするため,2,"保安距離や保有空地は、火災や爆発による周辺被害の拡大防止を目的とします。"
otsu4-009,乙四,性状,"アルコール類の性状として適切なものはどれか。",すべて水に不溶である,水溶性のものが多い,引火の危険がない,蒸気は発生しない,2,"アルコール類は水溶性のものが多く、消火方法の判断でも重要です。"
otsu4-010,乙四,法令,"危険物施設の点検や記録の目的として最も適切なものはどれか。",帳簿を増やすため,事故や漏えいを未然に防ぐため,税務申告を簡単にするため,商品の販売促進のため,2,"定期的な点検と記録は、設備不良や漏えいの早期発見につながり、事故防止に有効です。"`
};

const state = {
  questions: [],
  filteredQuestions: [],
  reviewFlags: loadReviewFlags(),
  selectedYear: "all",
  selectedCategory: "all",
  reviewOnly: false,
  currentIndex: 0,
  selectedChoice: null,
  showResult: false,
};

const elements = {
  sourceLabel: document.getElementById("source-label"),
  heroTotalCount: document.getElementById("hero-total-count"),
  heroVisibleCount: document.getElementById("hero-visible-count"),
  heroReviewCount: document.getElementById("hero-review-count"),
  csvUpload: document.getElementById("csv-upload"),
  yearFilter: document.getElementById("year-filter"),
  categoryFilter: document.getElementById("category-filter"),
  reviewOnly: document.getElementById("review-only"),
  hitCount: document.getElementById("hit-count"),
  reviewCount: document.getElementById("review-count"),
  errorMessage: document.getElementById("error-message"),
  emptyState: document.getElementById("empty-state"),
  quizCard: document.getElementById("quiz-card"),
  metaYear: document.getElementById("meta-year"),
  metaCategory: document.getElementById("meta-category"),
  metaIndex: document.getElementById("meta-index"),
  progressText: document.getElementById("progress-text"),
  progressFill: document.getElementById("progress-fill"),
  questionText: document.getElementById("question-text"),
  reviewToggle: document.getElementById("review-toggle"),
  choices: document.getElementById("choices"),
  prevButton: document.getElementById("prev-button"),
  submitButton: document.getElementById("submit-button"),
  nextButton: document.getElementById("next-button"),
  resultPanel: document.getElementById("result-panel"),
  resultText: document.getElementById("result-text"),
  explanationText: document.getElementById("explanation-text"),
};

function loadReviewFlags() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveReviewFlags() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.reviewFlags));
}

function parseCsv(csvText) {
  const lines = csvText
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "");

  if (lines.length < 2) {
    throw new Error("CSVに問題データがありません。");
  }

  const headers = parseCsvLine(lines[0]);
  const missing = REQUIRED_COLUMNS.filter((column) => !headers.includes(column));
  if (missing.length > 0) {
    throw new Error(`CSVに必要な列がありません: ${missing.join(", ")}`);
  }

  const headerIndex = Object.fromEntries(headers.map((header, index) => [header, index]));
  const rows = lines.slice(1).map((line) => parseCsvLine(line));

  const questions = rows
    .map((row, index) => {
      const answer = Number(row[headerIndex.answer]);
      return {
        id: String(row[headerIndex.id] || `row-${index + 1}`).trim(),
        year: String(row[headerIndex.year] || "未分類").trim(),
        category: String(row[headerIndex.category] || "未分類").trim(),
        question: String(row[headerIndex.question] || "").trim(),
        choices: [
          row[headerIndex.choice1],
          row[headerIndex.choice2],
          row[headerIndex.choice3],
          row[headerIndex.choice4],
        ].map((value) => String(value || "").trim()),
        answer,
        explanation: String(row[headerIndex.explanation] || "").trim(),
      };
    })
    .filter(
      (row) =>
        row.question &&
        row.choices.every(Boolean) &&
        Number.isInteger(row.answer) &&
        row.answer >= 1 &&
        row.answer <= 4,
    );

  if (questions.length === 0) {
    throw new Error("有効な問題が1件も見つかりませんでした。");
  }

  return questions;
}

function mergeQuestions(questionSets) {
  const merged = new Map();

  questionSets.flat().forEach((question) => {
    merged.set(question.id, question);
  });

  return [...merged.values()];
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

function updateFilters() {
  if (!elements.yearFilter || !elements.categoryFilter) {
    return;
  }

  const years = [
    ...new Set(
      state.questions
        .map((question) => question.year)
        .filter((year) => /^\d{4}$/.test(year)),
    ),
  ];
  const categories = [...new Set(state.questions.map((question) => question.category))];

  renderSelect(elements.yearFilter, years, state.selectedYear);
  renderSelect(elements.categoryFilter, categories, state.selectedCategory);
}

function renderSelect(selectElement, items, selectedValue) {
  if (!selectElement) {
    return;
  }

  selectElement.innerHTML = "";
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "すべて";
  selectElement.appendChild(allOption);

  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    option.selected = item === selectedValue;
    selectElement.appendChild(option);
  });

  if (selectedValue === "all") {
    selectElement.value = "all";
  }
}

function applyFilters() {
  state.filteredQuestions = state.questions.filter((question) => {
    if (state.selectedYear !== "all" && question.year !== state.selectedYear) {
      return false;
    }
    if (
      state.selectedCategory !== "all" &&
      question.category !== state.selectedCategory
    ) {
      return false;
    }
    if (state.reviewOnly && !state.reviewFlags[question.id]) {
      return false;
    }
    return true;
  });

  state.currentIndex = 0;
  state.selectedChoice = null;
  state.showResult = false;
  render();
}

function render() {
  const reviewCount = Object.values(state.reviewFlags).filter(Boolean).length;
  const totalCount = state.questions.length;
  const visibleCount = state.filteredQuestions.length;
  const currentQuestion = state.filteredQuestions[state.currentIndex];

  if (elements.hitCount) {
    elements.hitCount.textContent = String(visibleCount);
  }
  if (elements.reviewCount) {
    elements.reviewCount.textContent = String(reviewCount);
  }
  if (elements.heroTotalCount) {
    elements.heroTotalCount.textContent = String(totalCount);
  }
  if (elements.heroVisibleCount) {
    elements.heroVisibleCount.textContent = String(visibleCount);
  }
  if (elements.heroReviewCount) {
    elements.heroReviewCount.textContent = String(reviewCount);
  }

  if (elements.errorMessage) {
    elements.errorMessage.hidden = true;
  }

  if (!elements.quizCard || !elements.emptyState) {
    return;
  }

  if (!currentQuestion) {
    elements.emptyState.hidden = false;
    elements.quizCard.hidden = true;
    return;
  }

  elements.emptyState.hidden = true;
  elements.quizCard.hidden = false;
  elements.metaYear.textContent = currentQuestion.year;
  elements.metaCategory.textContent = currentQuestion.category;
  elements.metaIndex.textContent = `${state.currentIndex + 1} / ${state.filteredQuestions.length}`;
  const progress = Math.round(
    ((state.currentIndex + 1) / Math.max(state.filteredQuestions.length, 1)) * 100,
  );
  elements.progressText.textContent = `${progress}%`;
  elements.progressFill.style.width = `${progress}%`;
  elements.questionText.textContent = currentQuestion.question;
  elements.reviewToggle.textContent = state.reviewFlags[currentQuestion.id]
    ? "★ 要復習"
    : "☆ 要復習に追加";
  elements.reviewToggle.className = state.reviewFlags[currentQuestion.id]
    ? "star active"
    : "star";

  elements.choices.innerHTML = "";
  currentQuestion.choices.forEach((choice, index) => {
    const choiceNumber = index + 1;
    const button = document.createElement("button");
    button.type = "button";

    const isCorrectChoice =
      state.showResult && choiceNumber === currentQuestion.answer;
    const isWrongChoice =
      state.showResult &&
      choiceNumber === state.selectedChoice &&
      state.selectedChoice !== currentQuestion.answer;

    button.className = [
      "choice",
      state.selectedChoice === choiceNumber ? "selected" : "",
      isCorrectChoice ? "correct" : "",
      isWrongChoice ? "wrong" : "",
    ]
      .filter(Boolean)
      .join(" ");

    button.innerHTML = `<span>${choiceNumber}</span><span>${escapeHtml(choice)}</span>`;
    button.addEventListener("click", () => {
      state.selectedChoice = choiceNumber;
      render();
    });
    elements.choices.appendChild(button);
  });

  elements.prevButton.disabled = state.currentIndex === 0;
  elements.nextButton.disabled =
    state.currentIndex >= state.filteredQuestions.length - 1;
  elements.submitButton.disabled = state.selectedChoice == null;

  if (!state.showResult) {
    elements.resultPanel.hidden = true;
    elements.resultPanel.className = "result";
  } else {
    const correct = state.selectedChoice === currentQuestion.answer;
    elements.resultPanel.hidden = false;
    elements.resultPanel.className = `result ${correct ? "ok" : "ng"}`;
    elements.resultText.textContent = correct
      ? "正解です。"
      : `不正解です。正解は ${currentQuestion.answer} 番です。`;
    elements.explanationText.textContent = currentQuestion.explanation;
  }
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function showError(message) {
  if (!elements.errorMessage) {
    return;
  }

  elements.errorMessage.textContent = message;
  elements.errorMessage.hidden = false;
}

function loadQuestions(questions, sourceLabel) {
  state.questions = questions;
  if (elements.sourceLabel) {
    elements.sourceLabel.textContent = `現在のデータ: ${sourceLabel}`;
  }
  updateFilters();
  applyFilters();
}

async function loadAutoCsvFolder() {
  try {
    const manifestResponse = await fetch(AUTOLOAD_MANIFEST_PATH);
    if (!manifestResponse.ok) {
      throw new Error("自動読込フォルダの一覧を取得できませんでした。");
    }

    const manifest = await manifestResponse.json();
    const files = Array.isArray(manifest.files) ? manifest.files : [];
    if (files.length === 0) {
      throw new Error("自動読込フォルダにCSVが設定されていません。");
    }

    const loadedSets = await Promise.all(
      files.map(async (fileName) => {
        const response = await fetch(`./public/csv/${fileName}`);
        if (!response.ok) {
          throw new Error(`${fileName} を取得できませんでした。`);
        }
        const text = await response.text();
        return parseCsv(text);
      }),
    );

    return {
      questions: mergeQuestions(loadedSets),
      label: `自動読込フォルダ (${files.length}ファイル)`,
    };
  } catch {
    const embeddedFiles = Object.keys(EMBEDDED_AUTOLOAD_FILES);
    const loadedSets = embeddedFiles.map((fileName) =>
      parseCsv(EMBEDDED_AUTOLOAD_FILES[fileName]),
    );

    return {
      questions: mergeQuestions(loadedSets),
      label: `埋め込みデータ (${embeddedFiles.length}ファイル)`,
    };
  }
}

function attachEvents() {
  if (elements.csvUpload) {
    elements.csvUpload.addEventListener("change", async (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) {
        return;
      }

      try {
        const text = await file.text();
        const uploadedQuestions = parseCsv(text);
        const merged = mergeQuestions([state.questions, uploadedQuestions]);
        loadQuestions(merged, `自動読込フォルダ + ${file.name}`);
      } catch (error) {
        showError(error.message);
      }
    });
  }

  if (elements.yearFilter) {
    elements.yearFilter.addEventListener("change", (event) => {
      state.selectedYear = event.target.value;
      applyFilters();
    });
  }

  if (elements.categoryFilter) {
    elements.categoryFilter.addEventListener("change", (event) => {
      state.selectedCategory = event.target.value;
      applyFilters();
    });
  }

  if (elements.reviewOnly) {
    elements.reviewOnly.addEventListener("change", (event) => {
      state.reviewOnly = event.target.checked;
      applyFilters();
    });
  }

  if (elements.reviewToggle) {
    elements.reviewToggle.addEventListener("click", () => {
      const currentQuestion = state.filteredQuestions[state.currentIndex];
      if (!currentQuestion) {
        return;
      }

      state.reviewFlags[currentQuestion.id] = !state.reviewFlags[currentQuestion.id];
      saveReviewFlags();
      if (state.reviewOnly && !state.reviewFlags[currentQuestion.id]) {
        applyFilters();
        return;
      }
      render();
    });
  }

  if (elements.submitButton) {
    elements.submitButton.addEventListener("click", () => {
      if (state.selectedChoice == null) {
        return;
      }
      state.showResult = true;
      render();
    });
  }

  if (elements.prevButton) {
    elements.prevButton.addEventListener("click", () => {
      if (state.currentIndex === 0) {
        return;
      }
      state.currentIndex -= 1;
      state.selectedChoice = null;
      state.showResult = false;
      render();
    });
  }

  if (elements.nextButton) {
    elements.nextButton.addEventListener("click", () => {
      if (state.currentIndex >= state.filteredQuestions.length - 1) {
        return;
      }
      state.currentIndex += 1;
      state.selectedChoice = null;
      state.showResult = false;
      render();
    });
  }
}

async function bootstrap() {
  attachEvents();
  updateFilters();
  render();

  try {
    const autoLoaded = await loadAutoCsvFolder();
    loadQuestions(autoLoaded.questions, autoLoaded.label);
  } catch {
    showError("CSVの初期データを読み込めませんでした。");
  }
}

bootstrap();
