import styles from "./page.module.css";
import LinkAccountFlow from './components/link-account-flow';



export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <LinkAccountFlow />
      </main>
    </div>
  );
}
