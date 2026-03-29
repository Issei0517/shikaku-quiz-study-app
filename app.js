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
  const years = [...new Set(state.questions.map((question) => question.year))];
  const categories = [...new Set(state.questions.map((question) => question.category))];

  renderSelect(elements.yearFilter, years, state.selectedYear);
  renderSelect(elements.categoryFilter, categories, state.selectedCategory);
}

function renderSelect(selectElement, items, selectedValue) {
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
  elements.hitCount.textContent = String(state.filteredQuestions.length);
  elements.reviewCount.textContent = String(
    Object.values(state.reviewFlags).filter(Boolean).length,
  );

  const currentQuestion = state.filteredQuestions[state.currentIndex];
  elements.errorMessage.hidden = true;

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
  elements.errorMessage.textContent = message;
  elements.errorMessage.hidden = false;
}

function loadQuestions(questions, sourceLabel) {
  state.questions = questions;
  elements.sourceLabel.textContent = `現在のデータ: ${sourceLabel}`;
  updateFilters();
  applyFilters();
}

function attachEvents() {
  elements.csvUpload.addEventListener("change", async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      loadQuestions(parseCsv(text), file.name);
    } catch (error) {
      showError(error.message);
    }
  });

  elements.yearFilter.addEventListener("change", (event) => {
    state.selectedYear = event.target.value;
    applyFilters();
  });

  elements.categoryFilter.addEventListener("change", (event) => {
    state.selectedCategory = event.target.value;
    applyFilters();
  });

  elements.reviewOnly.addEventListener("change", (event) => {
    state.reviewOnly = event.target.checked;
    applyFilters();
  });

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

  elements.submitButton.addEventListener("click", () => {
    if (state.selectedChoice == null) {
      return;
    }
    state.showResult = true;
    render();
  });

  elements.prevButton.addEventListener("click", () => {
    if (state.currentIndex === 0) {
      return;
    }
    state.currentIndex -= 1;
    state.selectedChoice = null;
    state.showResult = false;
    render();
  });

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

async function bootstrap() {
  attachEvents();
  updateFilters();
  render();

  try {
    const response = await fetch("./public/questions.csv");
    if (!response.ok) {
      throw new Error("初期CSVを取得できませんでした。");
    }
    const text = await response.text();
    loadQuestions(parseCsv(text), "サンプルCSV");
  } catch {
    showError("初期CSVを自動読込できませんでした。画面からCSVを選択してください。");
  }
}

bootstrap();
