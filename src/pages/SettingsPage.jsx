import { Bell, Database, Monitor, Save, Shield, SlidersHorizontal, Timer, UserRound } from "lucide-react";

function Card({ children, className = "" }) {
  return <section className={`panel ${className}`}>{children}</section>;
}

function Toggle({ checked = false, onClick, testId }) {
  return (
    <button
      data-testid={testId}
      type="button"
      aria-pressed={checked}
      onClick={onClick}
      className={`h-7 w-12 rounded-full p-1 transition ${checked ? "bg-app-primary" : "bg-app-line"}`}
    >
      <span className={`block h-5 w-5 rounded-full bg-white transition ${checked ? "translate-x-5" : ""}`} />
    </button>
  );
}

function SettingRow({ title, body, children }) {
  return (
    <div className="flex flex-col gap-3 border-b border-app-line py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-extrabold text-app-text">{title}</p>
        <p className="mt-1 text-sm text-app-muted">{body}</p>
      </div>
      {children}
    </div>
  );
}

function NumberBox({ value }) {
  return <div className="input-like grid w-28 place-items-center font-bold">{value}</div>;
}

const defaultSettings = {
  order: "ランダム",
  questionCount: "10問",
  includeReview: true,
  goalTime: "25分",
  timer: true,
  autosave: true,
  theme: "明るい",
  fontSize: "標準",
  reminder: true,
  reviewNotice: true,
  weeklyReport: false,
};

function Segment({ items, value, onChange, testId, itemTestIds = {} }) {
  return (
    <div data-testid={testId} className="flex rounded-md bg-app-soft p-1">
      {items.map((item) => (
        <button
          key={item}
          data-testid={itemTestIds[item]}
          type="button"
          onClick={() => onChange(item)}
          className={`rounded px-3 py-2 text-sm font-bold ${value === item ? "bg-white text-app-primary shadow-soft" : "text-app-muted"}`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export default function SettingsPage({ settings = defaultSettings, savedMessage = "", onChangeSetting, onSaveSettings }) {
  const currentSettings = { ...defaultSettings, ...settings };
  const changeSetting = (name, value) => onChangeSetting?.(name, value);

  return (
    <main data-testid="settings-page" className="page-content mx-auto max-w-7xl pb-28">
      <div className="mb-6">
        <p className="muted-label">SETTINGS</p>
        <h1 className="mt-2 text-3xl font-extrabold">設定</h1>
        <p className="mt-2 text-sm text-app-muted">出題方法、画面表示、通知、データ管理を調整します。</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="text-app-primary" />
            <h2 className="text-xl font-extrabold">出題設定</h2>
          </div>
          <SettingRow title="出題順" body="問題の並び方を選びます。">
            <Segment
              items={["ランダム", "年度順", "苦手優先"]}
              value={currentSettings.order}
              itemTestIds={{ ランダム: "setting-random" }}
              onChange={(value) => changeSetting("order", value)}
            />
          </SettingRow>
          <SettingRow title="1回の問題数" body="短い学習でも続けやすくします。">
            <NumberBox value={currentSettings.questionCount} />
          </SettingRow>
          <SettingRow title="復習問題を混ぜる" body="苦手な問題を自動で含めます。">
            <Toggle checked={currentSettings.includeReview} onClick={() => changeSetting("includeReview", !currentSettings.includeReview)} />
          </SettingRow>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Timer className="text-app-primary" />
            <h2 className="text-xl font-extrabold">学習セッション</h2>
          </div>
          <SettingRow title="目標時間" body="1日の学習目安です。">
            <NumberBox value={currentSettings.goalTime} />
          </SettingRow>
          <SettingRow title="タイマー表示" body="演習中に残り時間を表示します。">
            <Toggle testId="setting-timer" checked={currentSettings.timer} onClick={() => changeSetting("timer", !currentSettings.timer)} />
          </SettingRow>
          <SettingRow title="途中保存" body="ページを閉じても続きから再開します。">
            <Toggle checked={currentSettings.autosave} onClick={() => changeSetting("autosave", !currentSettings.autosave)} />
          </SettingRow>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Monitor className="text-app-primary" />
            <h2 className="text-xl font-extrabold">テーマ</h2>
          </div>
          <SettingRow title="表示テーマ" body="画面の明るさを選びます。">
            <Segment items={["明るい", "暗い", "自動"]} value={currentSettings.theme} onChange={(value) => changeSetting("theme", value)} />
          </SettingRow>
          <SettingRow title="文字サイズ" body="問題文の読みやすさを調整します。">
            <NumberBox value={currentSettings.fontSize} />
          </SettingRow>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Bell className="text-app-primary" />
            <h2 className="text-xl font-extrabold">通知</h2>
          </div>
          <SettingRow title="学習リマインド" body="決まった時間に学習を知らせます。">
            <Toggle checked={currentSettings.reminder} onClick={() => changeSetting("reminder", !currentSettings.reminder)} />
          </SettingRow>
          <SettingRow title="復習期限の通知" body="忘れやすい問題を知らせます。">
            <Toggle checked={currentSettings.reviewNotice} onClick={() => changeSetting("reviewNotice", !currentSettings.reviewNotice)} />
          </SettingRow>
          <SettingRow title="週次レポート" body="1週間の結果をまとめます。">
            <Toggle checked={currentSettings.weeklyReport} onClick={() => changeSetting("weeklyReport", !currentSettings.weeklyReport)} />
          </SettingRow>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Database className="text-app-primary" />
            <h2 className="text-xl font-extrabold">データ管理</h2>
          </div>
          <SettingRow title="学習データの書き出し" body="CSV形式で保存できます。">
            <button className="button-secondary h-10 px-4">書き出し</button>
          </SettingRow>
          <SettingRow title="データの初期化" body="学習記録を消すため、注意が必要です。">
            <button className="h-10 rounded-md border border-app-error px-4 text-sm font-bold text-app-error">初期化</button>
          </SettingRow>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <UserRound className="text-app-primary" />
            <h2 className="text-xl font-extrabold">アカウント</h2>
          </div>
          <SettingRow title="表示名" body="レポートに表示される名前です。">
            <div className="input-like grid w-40 place-items-center font-bold">学習者</div>
          </SettingRow>
          <SettingRow title="セキュリティ" body="ログイン状態を保護します。">
            <div className="flex items-center gap-2 text-sm font-bold text-app-success">
              <Shield size={18} />
              有効
            </div>
          </SettingRow>
        </Card>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-app-line bg-white/95 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold text-app-success">{savedMessage}</p>
          <button data-testid="settings-save" className="button-primary" onClick={() => onSaveSettings?.()}>
            <Save size={18} />
            設定を保存
          </button>
        </div>
      </div>
    </main>
  );
}
