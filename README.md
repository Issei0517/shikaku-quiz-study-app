# 資格問題Webアプリ

CSVで問題を管理できる、資格勉強向けの4択学習アプリです。依存関係は不要で、`index.html` をブラウザで開くだけで動きます。

## できること

- CSVから4択問題を読み込み
- 年度別・カテゴリ別の絞り込み
- 要復習フラグの保存
- 要復習だけを再出題
- 正誤判定と解説表示

## 使い方

1. `index.html` をブラウザで開く
2. 必要なら画面右上の `CSVを読み込む` から問題CSVを選ぶ
3. 年度・カテゴリ・要復習で絞り込みながら学習する

初期データは [public/questions.csv](/G:/マイドライブ/VS Code/資格問題webアプリ/public/questions.csv) を使います。ローカルファイルとして直接開く場合に初期CSVが読み込めないブラウザもあるため、その場合はCSVを画面から選択してください。

## CSV形式

以下の列名を1行目に含めてください。

```csv
id,year,category,question,choice1,choice2,choice3,choice4,answer,explanation
```

- `id`: 問題ID
- `year`: 年度
- `category`: 分類名
- `question`: 問題文
- `choice1` - `choice4`: 選択肢
- `answer`: 正解番号。`1` から `4`
- `explanation`: 解説
