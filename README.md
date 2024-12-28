# Reactアプリケーションのなかからformrunを利用するサンプル

ReactとNext.jsでアプリケーションを作った。
その中に「お問い合わせページ」を組み込もうと考えた。

フォーム作成ツール [formrun](https://form.run/home) がある。
formrunにアカウントを作り問い合わせフォームを作った。
そのフォームをReactで作ったWebページの中に組み込むにはどうすればいいのだろうか？
formrunのドキュメントを見ると、Reactアプリにformrunで作ったフォームをどうやって組み込むかが書いてなかった。

実はちょっと難しかった。

formrunの流儀に従うには
Reactが実現したHTMLの中に`script`を組み込み実行することが必要だ。たとえば
```<script src="https://sdk.form.run/js/v2/embed.js"></script>
<div
  class="formrun-embed"
  data-formrun-form="@kazuaki-urayama-IJRqxLbyvQ1bsFH4C0iC"
  data-formrun-redirect="true">
</div>
```


すなわち
`<script>`がformrunのサーバからjavascriptをダウンロードして実行し &lt;iframe&gt;を挿入する。
          &lt;iframe&gt;がformrunが組み立てたwebフォームを表示する。
        しかし&lt;script&gt;はReactの外側にある。だからReactコンポーネントの状態(PropsやState)が変化しても、
          適切な工夫を施さなければ、&lt;script&gt;の中のJavaScriptコードは実行されない。
          そこで<code>useEffect</code>関数を使う。</p>


