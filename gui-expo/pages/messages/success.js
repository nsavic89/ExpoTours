import { useTranslations } from 'use-intl'
import styling from '../../styles/messages.module.css'
import Link from 'next/link'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCheckSquare} from '@fortawesome/free-solid-svg-icons'


export default function Success() {

    const t = useTranslations()

    return(
        <div className={styling.wrapper}>
            <div style={{ fontSize: 50, color: 'rgb(50,180,100)' }}>
                <FontAwesomeIcon icon={ faCheckSquare } />
            </div>
            <div className={styling.mainTextSuccess}>
                <div><strong>{t('messages.successTitle')}</strong></div>
                <div>{t('messages.success')}</div>
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
