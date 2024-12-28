import styles from "./page.module.css";
import ContactForm from "./_components/ContactForm";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Reactアプリケーションの中で formrunを使うサンプル</h1>
        <p>Reactが実現したHTMLの中にReactと連携しない&lt;script&gt;を組み込み実行する。
          &lt;script&gt;がformrunのサーバからjavascriptをダウンロードして実行し &lt;iframe&gt;を挿入する。
          &lt;iframe&gt;がformrunが組み立てたwebフォームを表示する。</p>
        <ContactForm />
      </main>
    </div>
  );
}
