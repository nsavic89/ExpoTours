import { useTranslation } from 'react-i18next'
import Layout from "../components/MainLayout"
import'../styles/home.css'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPhoneAlt, faEnvelope} from '@fortawesome/free-solid-svg-icons'


export default function About() {
    const { t } = useTranslation()

    return (
        <Layout>
            <div className='main-other-pages'>
            <div className='main-other-pages-text'>
                <h1>A propos de nous</h1>
                <p style={{margin: '0px', fontStretch: 'normal', fontSize: '18px', lineHeight: 'normal', fontFamily: 'Helvetica', minHeight: '17px'}}><br /></p>
                <p style={{margin: '0px', fontStretch: 'normal', fontSize: '18px', lineHeight: 'normal', fontFamily: 'Helvetica'}}><strong>ExpoTours.ch&nbsp;</strong>propose la location de&nbsp;autocars / mini car &amp; limousines grand luxe&nbsp;sans signe distinctif, avec chauffeurs qualifiés.</p>
                <p style={{margin: '0px', fontStretch: 'normal', fontSize: '18px', lineHeight: 'normal', fontFamily: 'Helvetica', minHeight: '17px'}}><br /></p>
                <p style={{margin: '0px', fontStretch: 'normal', fontSize: '18px', lineHeight: 'normal', fontFamily: 'Helvetica'}}>Nous sommes spécialisés dans le transport de personnes au départ et à destination<br />de tous les aéroports de pays et à l’étranger,<br />ainsi qu’à destination de la gare à Lausanne, Geneve et autres.</p>
                <p style={{margin: '0px', fontStretch: 'normal', fontSize: '18px', lineHeight: 'normal', fontFamily: 'Helvetica'}}><br />Nous prenons également en charge toutes autres destinations quelles qu’elles soient.</p>
                <p style={{margin: '0px', fontStretch: 'normal', fontSize: '18px', lineHeight: 'normal', fontFamily: 'Helvetica'}}>Nos services vont du simple transfert, à la mise à disposition à l’heure où à la journée. Toutes nos vechiqule &nbsp;sont spécialement équipées et couvertes par une assurance totale passagère.</p>
                <p style={{margin: '0px', fontStretch: 'normal', fontSize: '18px', lineHeight: 'normal', fontFamily: 'Helvetica', minHeight: '17px'}}><br /></p>
                <p style={{margin: '0px', fontStretch: 'normal', fontSize: '18px', lineHeight: 'normal', fontFamily: 'Helvetica'}}>Vous voyagez confortablement et en toute sécurité avec des professionnels expérimentés.</p>
                <p style={{margin: '0px', fontStretch: 'normal', fontSize: '18px', lineHeight: 'normal', fontFamily: 'Helvetica'}}>Il est possible de vous fournir une véhicules avec chauffeur le jour même de votre réservation.</p>
                <p style={{margin: '0px', fontStretch: 'normal', fontSize: '18px', lineHeight: 'normal', fontFamily: 'Helvetica', minHeight: '17px'}}><br /></p>
                <p style={{margin: '0px', fontStretch: 'normal', fontSize: '18px', lineHeight: 'normal', fontFamily: 'Helvetica'}}>Louer une véhicules avec chauffeur, c’est le meilleur moyen de visiter Suisse et L'Europe.</p>
                <p style={{margin: '0px', fontStretch: 'normal', fontSize: '18px', lineHeight: 'normal', fontFamily: 'Helvetica', minHeight: '17px'}}><br /></p>
                <p style={{margin: '0px', fontStretch: 'normal', fontSize: '18px', lineHeight: 'normal', fontFamily: 'Helvetica'}}>Nos tarifs sont très intéressants.</p>
                <p style={{margin: '0px', fontStretch: 'normal', fontSize: '18px', lineHeight: 'normal', fontFamily: 'Helvetica'}}>Consultez nous pour toutes remises de prix.</p>
                <p style={{margin: '0px', fontStretch: 'normal', fontSize: '18px', lineHeight: 'normal', fontFamily: 'Helvetica'}}>&nbsp;</p>
                <p style={{margin: '0px', fontStretch: 'normal', fontSize: '18px', lineHeight: 'normal', fontFamily: 'Helvetica'}}>par email: <a href='mailto:info@expotours.ch'>info@expotours.ch</a></p>
                <p style={{margin: '0px', fontStretch: 'normal', fontSize: '18px', lineHeight: 'normal', fontFamily: 'Helvetica'}}>par téléphone:&nbsp;(+41) 076 274 00 00</p>
                <p><br /></p>
            </div>
            </div>
        </Layout>
    )
}