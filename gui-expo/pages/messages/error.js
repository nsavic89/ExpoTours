import { useTranslations } from 'use-intl'
import styling from '../../styles/messages.module.css'
import Link from 'next/link'

export default function Error() {

    const t = useTranslations()

    return(
        <div className={styling.wrapper}>
            <div className={styling.mainTextError}>
                <div><strong>{t('messages.errorTitle')}</strong></div>
                <div>{t('messages.error')}</div>
            </div>
            <div>
                <Link href='/'>
                    <button type="button" className={styling.returnButton}>
                        {t('messages.return')}
                    </button>
                </Link>
            </div>
        </div>
    )
}


// pages/index.js
export async function getStaticProps(context) {
    return {
		props: {
			messages: require(`../../locales/${context.locale}.json`),
		}
    };
}
