import { useTranslation } from 'react-i18next'
import '../styles/layout.css'
import { Link } from 'react-router-dom'
import { Button, Dropdown, Menu } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';


const menuItems = ['home', 'services', 'rent', 'general-conditions', 'legislation', 'about', 'contact']

export default function Layout({ children }) {
    const { t, i18n } = useTranslation();

    const menu = (
        <Menu>
          {menuItems.map(item => (
              <Menu.Item key={item} >
                   <Link to={item === 'home' ? '/' : `/${item}`}>
                        {t(`nav.${item}`)}
                    </Link>
              </Menu.Item>
          ))}
        </Menu>
      );

    return(
        <div>
            <div className='wrapper'>
                <Dropdown overlay={menu} className='smallScreenMenu' trigger={['click']}>
                    <Button>
                        <span><FontAwesomeIcon icon={faBars} /></span> <span style={{ paddingLeft: 5 }}>Menu</span>
                    </Button>
                </Dropdown>
                <div className='navbar'>
                    {menuItems.map( item => (
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