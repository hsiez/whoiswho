import styles from './layout.module.css'
import Header from '@/app/components/header'

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.main}>
                {children}
            </main>
        </div>
    )
}

  