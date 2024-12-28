import styles from "./page.module.css";
import ContactForm from "./_components/ContactForm";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>React＋Next.jsアプリケーションとformrunを連携させるサンプル</h1>
        <ContactForm />
      </main>
    </div>
  );
}
