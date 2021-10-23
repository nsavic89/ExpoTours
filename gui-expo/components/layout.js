import { useTranslations } from 'next-intl'
import Head from 'next/head'
import styles from '../styles/layout.module.css'
import Link from 'next/link'




export default function Layout({ children }) {
    const t = useTranslations();

    return(
        <div>
            <div className={styles.wrapper}>
                <Head>
                    <title>Create Next App</title>
                    <meta name="description" content="ExpoTours - visite touristique exposition" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>


                <div className={styles.navbar}>
                    {['home', 'services', 'location', 'about', 'contact'].map( item => (
                        <div key={item} className={styles.navbarItem}>
                            <Link href={item === 'home' ? '/' : `/${item}`}>
                                <a>{t(`nav.${item}`)}</a>
                            </Link>
                        </div>
                    ))}
                </div>

                <div className={styles.main}>{children}</div>
            </div>

            <footer className={styles.footer}>
                <div>             
                    <div>
                        {['fr', 'en'].map(
                            item => (
                                <span key={item} className={styles.langLink}>
                                    <Link href={`/${item}`} locale={item}>
                                        <a>{ item }</a>
                                    </Link>
                                </span>
                            )
                        )}
                    </div><br/>
                    <div><strong>ExpoTours.ch</strong></div>
                    <div>Bussigny, Suisse</div>
                    <div>
                        <p>
                            Developed by Nenad Savic

                            | <a href="mailto:nenadschem@gmail.com" style={{ color: 'blue' }}>
                                <u>nenadschem@gmail.com</u></a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}