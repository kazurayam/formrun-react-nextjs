# React＋Next.jsアプリケーションとformrunを連携させるサンプル

## 解決すべき問題

ReactとNext.jsでアプリケーションを作った。その中に「お問い合わせページ」を組み込もうと考えた。

フォーム作成ツール [formrun](https://form.run/home) がある。
formrunに自分のアカウントを作り、問い合わせフォームを作った。そこまでは簡単にできた。
ReactとNext.jsで作ったWebアプリケーションの「お問い合わせページ」としてformrunのフォームを組み込みたいが、
どうすればいいのだろうか？
formrunのサイトの説明を見たが、Reactとformrunの連携については何も説明がなかった。はてな？

## 解決方法

formrunの流儀によれば、WebサイトのHTMLの中に下記のようなコードを埋め込みなさい、という。

```
<script src="https://sdk.form.run/js/v2/embed.js"></script>
<div
  class="formrun-embed"
  data-formrun-form="@XXXXXXXXXXX-XXXXXXXXXXXXXXX"
  data-formrun-redirect="true">
</div>
```

このコードの意図はよくわかる。
`<script src="https://sdk.form.run/js/v2/embed.js">`が実行されるとJavaScriptが動いて、
直後の`<div>`要素の中に`<iframe>`要素を挿入する。`<iframe>`がformrunが組み立てたwebフォームのURLを参照する。

しかしながら`<script>`はReactの外側（step outside of React）にある。
だからブラウザで「お問い合わせページ」が表示されたことにより、
Reactコンポーネントの状態(PropsやState)が変化したとしても、適切な工夫を施さなければ、
`<script>`が指し示すJavaScriptコードはダウンロードされないし、実行されない。

こういうとき、Reactの `useEffect` 関数を利用する。
お問い合わせページコンポーネントが開かれた時、`useEffect`でHTML DOMを動的に書き換えて
`<iframe>`を挿入しよう。

## 説明

### formrunでフォームを作れ

[formrun](https://form.run/home)にあなたのアカウントを作れ。ひとつ、問い合わせフォームを作成せよ。formrunとは何か、どう操作するのか、といった説明はここではしない。彼らの説明に従。サンプルのテンプレートを選んでボタンを数回クリックすれば数分でできる。

### Nodeが必要

あなたのマシンにNodeがインストール済みで `npm` コマンドが動く状態であることを前提する。

### cloneせよ

[このレポジトリ](https://github.com/kazurayam/formrun-react-nextjs) を ~/tmp/forumrun-react-nextjs ディレクトリにcloneしたと仮定する。

### 環境変数を定義せよ

プロジェクトのディレクトリに `.env.local` ファイルを作れ。その中で環境変数 `NEXT_PUBLIC_FORMRUN_FORM_URL_PATH` を定義せよ。

```
NEXT_PUBLIC_FORMRUN_FORM_URL_PATH=@kazuXXXXXXXXX-XXXXXXXXXXXXXXXXXXX
```

formrunがあなたのフォームに固有の識別情報を割り当てる。それを `.env.local` に指定せよ。

### サーバを起動せよ

いつものように

```
$ cd ~/tmp/formrun-react-nextjs
$ npm run dev
```

とやる。

### サイトをvisitする

ブラウザで

- http://localhost:3000

をひらけ。すると次のような画面が表示されるはず。

- [contact.png](https://kazurayam.github.io/formrun-react-nextjs/images/contact.png)

