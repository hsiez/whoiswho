import styles from "./page.module.css";
import LinkAccountsFlow from "./components/form-flow/from-flow";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <LinkAccountsFlow />
      </main>
    </div>
  );
}
