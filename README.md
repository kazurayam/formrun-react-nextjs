# React＋Next.jsアプリケーションとformrunを連携させるサンプル

## 解決すべき問題

ReactとNext.jsでアプリケーションを作った。その中に「お問い合わせページ」を組み込もうと考えた。

フォーム作成ツール [formrun](https://form.run/home) がある。
formrunに自分のアカウントを作り、問い合わせフォームを作った。そこまでは簡単にできた。
ReactとNext.jsで作ったWebアプリケーションの「お問い合わせページ」としてformrunのフォームを組み込みたいが、
どうすればいいのだろうか？
formrunのサイトの説明を見たが、Reactとformrunの連携については何も説明がなかった。はてな？

## 解決方法

formrunの説明にはあなたのWebサイトのHTMLの中に下記のようなコードを埋め込みなさい、と書いてある。

```
<script src="https://sdk.form.run/js/v2/embed.js"></script>
<div
  class="formrun-embed"
  data-formrun-form="@XXXXXXXXXXX-XXXXXXXXXXXXXXX"
  data-formrun-redirect="true">
</div>
```

このコードは何を意図しているのか？
`<script src="https://sdk.form.run/js/v2/embed.js">`が実行されれば `embed.js` が動いて
直後の`<div>`要素の中に`<iframe>`要素を挿入するはずだ。
その`<iframe>`はformrunが提供するwebフォームのURLを参照するので、結果的にwebページの中にwebフォームが埋め込まれて表示されるだろう。

しかしながらWebページのHTMLソースに書かれた `<script>`タグはReactの外側（step outside of React）にある。だからReactで構築された「お問い合わせページ」がブラウザの上で表示されたとしても
`<script>`は実行されない。`<script>`要素の`src`属性が指すJavaScriptコードはダウンロードすらされない。これではダメだ。

ではどうすればいい？

Reactコンポーネントが描画されたタイミングでフックを起動しよう。副作用フック [`useEffect`](https://react.dev/reference/react/useEffect) 関数を使え。ブラウザ上でお問い合わせページのコンポーネントが開かれた時に`useEffect`でHTML DOMを動的に書き換えて
`<iframe>`を挿入すればいい。

## 説明

### formrunでフォームを作れ

[formrun](https://form.run/home)にあなたのアカウントを作れ。ひとつ、問い合わせフォームを作成せよ。formrunとは何か、どう操作するのか、といった説明はここではしない。彼らの説明に従え。サンプルのテンプレートを選んでボタンを数回クリックすれば数分でできる。

ちなみにformrunはひとつひとつのフォームに固有のURLを割り当てる。たとえば

`https://form.run/@kazuXXX-XXXXXXX-XXXXXXXXXXXXXXXXXXXX`

ここでXXXの部分はあなたのフォームに割り当てられた具体的な文字列に置き換えてください。

このURLのパス部分つまり `https://form.run/` に続く `@`を含む文字列を後ほど「問い合わせ」ページのHTMLの中に埋め込むことによって、あなたのサイトとformrunを連携させることができます。

### Nodeが必要

あなたのマシンにNodeがインストール済みで `npm` コマンドが動く状態であることを前提する。

### cloneせよ

[このレポジトリ](https://github.com/kazurayam/formrun-react-nextjs) を ~/tmp/forumrun-react-nextjs ディレクトリにcloneしたと仮定する。

### 環境変数を定義せよ

プロジェクトのディレクトリに（すなわち`app`ディレクトリの隣に） `.env.local` ファイルを作れ。`.env.local`ファイルの中で環境変数 `NEXT_PUBLIC_FORMRUN_FORM_URL_PATH` を定義せよ。

```
NEXT_PUBLIC_FORMRUN_FORM_URL_PATH=@kazuXXXXXXXXX-XXXXXXXXXXXXXXXXXXX
```

この環境変数の値として formrunが生成したあなたのフォームのURLのパス文字列を設定します。

この環境変数の名前を `NEXT_PUBLIC_` で始まるものにしなければならない。ブラウザ上で動くJavaScriptが参照できるようにするためだ。名前を詳しくはNext.jsのドキュメントを参照のこと。

- [Next.js | Bundling Environment Variables for the Browser](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser)


### サーバを起動せよ

いつものように

```
$ cd ~/tmp/formrun-react-nextjs
$ npm run dev
```

とやる。

### ブラウザでサイトを見る

ブラウザで

- http://localhost:3000

をひらけ。すると次のような画面が表示されるはず。

![contact-view.png](https://kazurayam.github.io/formrun-react-nextjs/images/contact-view.png)

F12キーでDeveloper Toolを開いてDOMツリーを見よう。

![contact-DOM.png](https://kazurayam.github.io/formrun-react-nextjs/images/contact-DOM.png)

たしかに `<iframe>` が挿入されていて、src属性がwebフォームの公開URLを指していることを確認することができた。

React＋Next.jsアプリとformrunにホストされたwebフォームを連携させることができた。

### useEffect関数でReactと`<script>`を連携させる

お問い合わせページコンポーネントが開かれた時、`useEffect`関数を利用してHTML DOMを動的に書き換えて
`<iframe>`を挿入したい。どうすればいいのか？`app/_components/ContactForm/index.tsx`のコードを読め。

- https://github.com/kazurayam/formrun-react-nextjs/blob/main/app/_components/ContactForm/index.tsx

```
"use client";

import { useEffect } from 'react';

const initialState = {
  status: "",
  message: "",
}

export default function ContactForm() {
  if (!process.env.NEXT_PUBLIC_FORMRUN_FORM_URL_PATH) {
    throw new Error("NEXT_PUBLIC_FORMRUN_FORM_URL_PATH is required");
  }
  useEffect(() => {
    /* generate the following stuff in the DOM
    <div id="contact">
      <script src="https://sdk.form.run/js/v2/embed.js"></script>
      <div
        class="formrun-embed"
        data-formrun-form=`${NEXT_PUBLIC_FORMRUN_FORM_URL_PATH}`
        data-formrun-redirect="true">
      </div>
    </div>
    */
    const contact = document.getElementById("contact");
    const script = document.createElement("script");
    script.setAttribute("src", "https://sdk.form.run/js/v2/embed.js");
    script.async = true;
    contact?.appendChild(script);

    const embed = document.createElement("div");
    embed.className = "formrun-embed";
    embed.setAttribute("data-formrun-form", `${process.env.NEXT_PUBLIC_FORMRUN_FORM_URL_PATH}`);
    embed.setAttribute("data-formrun-redirect", "true");
    contact?.appendChild(embed);

    return () => {
      contact?.removeChild(script);
    }
  }, []);

  return (
    <>
      <div id="contact"></div>
    </>
  );
}
```

