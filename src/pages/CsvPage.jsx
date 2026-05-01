import { CheckCircle2, FileSpreadsheet, Info, Plus, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";

const sampleCsvFiles = [
  { id: "sample-csv-1", file: "basic-law-2026.csv", category: "法令基礎", count: "120問", date: "2026/04/28" },
  { id: "sample-csv-2", file: "safety-management.csv", category: "安全管理", count: "86問", date: "2026/04/24" },
  { id: "sample-csv-3", file: "equipment-check.csv", category: "設備点検", count: "64問", date: "2026/04/18" },
];

function Card({ children, className = "" }) {
  return <section className={`panel ${className}`}>{children}</section>;
}

function normalizeCsvFile(csv, index) {
  if (Array.isArray(csv)) {
    const [file, category, count, date] = csv;
    return { id: file || `csv-${index}`, file, category, count, date };
  }

  return {
    ...csv,
    id: csv.id || csv.csvId || csv.name || `csv-${index}`,
    file: csv.file || csv.name || csv.filename || `CSV ${index + 1}`,
    category: csv.category || "未分類",
    count: typeof csv.count === "number" ? `${csv.count}問` : csv.count || csv.questionCount || "0問",
    date: csv.date || csv.createdAt || csv.importedAt || "未確認",
  };
}

export default function CsvPage({ csvFiles = sampleCsvFiles, onAddCsv, onPreviewCsv, onRemoveCsv }) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const normalizedCsvFiles = csvFiles.map((csv, index) => normalizeCsvFile(csv, index));

  const handleAddCsv = () => {
    if (selectedFile) {
      onAddCsv?.(selectedFile);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    fileInputRef.current?.click();
  };

  return (
    <main data-testid="csv-page" className="page-content mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="muted-label">CSV</p>
          <h1 className="mt-2 text-3xl font-extrabold">CSV管理</h1>
          <p className="mt-2 text-sm text-app-muted">問題データを追加し、読み込み済みのファイルを管理します。</p>
        </div>
        <button className="button-primary" onClick={() => fileInputRef.current?.click()}>
          <Plus size={18} />
          新しいCSVを追加
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card className="p-6">
          <div className="rounded-xl border-2 border-dashed border-app-line bg-app-soft p-8 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white text-app-primary shadow-soft">
              <UploadCloud size={28} />
            </div>
            <h2 className="mt-4 text-xl font-extrabold">CSVの追加</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-app-muted">
              ここにファイルを置くか、ボタンから選んで問題データを取り込みます。
            </p>
            <input
              ref={fileInputRef}
              data-testid="csv-file-input"
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
            />
            <div className="mt-4 text-sm font-bold text-app-muted">
              {selectedFile ? selectedFile.name : "CSVファイルはまだ選択されていません。"}
            </div>
            <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button className="button-secondary" onClick={() => fileInputRef.current?.click()}>
                ファイルを選択
              </button>
              <button data-testid="csv-add-button" className="button-primary" onClick={handleAddCsv}>
                追加する
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {["UTF-8を推奨", "最大5,000問", "重複を自動確認"].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-lg border border-app-line bg-white p-3 text-sm font-bold text-app-body">
                <CheckCircle2 size={18} className="text-app-success" />
                {item}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Info className="text-app-primary" size={22} />
            <h2 className="text-xl font-extrabold">CSVフォーマット</h2>
          </div>
          <p className="mt-2 text-sm text-app-muted">1行目に見出しを入れてください。</p>
          <div className="mt-5 overflow-hidden rounded-lg border border-app-line">
            {[
              ["question", "問題文"],
              ["choice_a - choice_d", "選択肢"],
              ["answer", "正解"],
              ["category", "カテゴリ"],
              ["explanation", "解説"],
            ].map(([name, desc]) => (
              <div key={name} className="grid grid-cols-[0.9fr_1.1fr] border-b border-app-line bg-white px-4 py-3 last:border-b-0">
                <code className="text-sm font-bold text-app-primary">{name}</code>
                <span className="text-sm text-app-body">{desc}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold">読み込み済みCSV一覧</h2>
          <span className="rounded-full bg-app-primarySoft px-3 py-1 text-xs font-bold text-app-primary">{normalizedCsvFiles.length}件</span>
        </div>
        <div className="mt-5 overflow-hidden rounded-lg border border-app-line">
          {normalizedCsvFiles.map(({ id, file, category, count, date }) => (
            <div key={id} className="grid gap-3 border-b border-app-line bg-white p-4 last:border-b-0 md:grid-cols-[1.5fr_0.8fr_0.6fr_0.8fr_auto] md:items-center">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-app-soft p-2 text-app-teal">
                  <FileSpreadsheet size={20} />
                </div>
                <p className="font-extrabold text-app-text">{file}</p>
              </div>
              <p className="text-sm font-bold text-app-muted">{category}</p>
              <p className="text-sm font-bold text-app-body">{count}</p>
              <p className="text-sm text-app-muted">{date}</p>
              <div className="flex gap-2">
                <button data-testid={`csv-preview-${id}`} className="button-secondary h-10 px-4" onClick={() => onPreviewCsv?.(id)}>
                  確認
                </button>
                <button data-testid={`csv-remove-${id}`} className="h-10 rounded-md border border-app-error px-4 text-sm font-bold text-app-error" onClick={() => onRemoveCsv?.(id)}>
                  削除
                </button>
              </div>
            </div>
          ))}
          {normalizedCsvFiles.length === 0 && (
            <div className="bg-white p-5 text-sm font-bold text-app-muted">読み込み済みCSVはありません。</div>
          )}
        </div>
      </Card>
    </main>
  );
}
