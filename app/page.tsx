import styles from "./page.module.css";
import ContactForm from "./_components/ContactForm";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Reactアプリケーションの中で formrunを使うサンプル</h1>
        <ContactForm />
      </main>
    </div>
  );
}
