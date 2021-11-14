import { useTranslation } from 'react-i18next'
import '../styles/layout.css'
import { Link } from 'react-router-dom'



export default function Layout({ children }) {
    const { t, i18n } = useTranslation();

    return(
        <div>
            <div className='wrapper'>
                <div className='navbar'>
                    {['home', 'services', 'location', 'about', 'contact'].map( item => (
                        <div key={item} className='navbarItem'>
                            <Link to={item === 'home' ? '/' : `/${item}`} style={{ color: 'white' }}>
                                {t(`nav.${item}`)}
                            </Link>
                        </div>
                    ))}
                </div>

                <div className='mainLayout'>{children}</div>
            </div>

            <footer className='footer'>
                <div>             
                    <div>
                        {['fr', 'en'].map(
                            item => (
                                <span key={item}>
                                    <button type="button" onClick={() => i18n.changeLanguage(item)} className='langLink'>
                                        {item}
                                    </button>
                                </span>
                            )
                        )}
                    </div><br/>
                    <div><strong>ExpoTours.ch</strong></div>
                    <div>Bussigny, Suisse</div>
                    <div>
                        <div>
                            Developed by Nenad Savic
                            <div><a href="mailto:nenadschem@gmail.com" style={{ color: 'blue' }}>
                            <u>nenadschem@gmail.com</u></a></div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}