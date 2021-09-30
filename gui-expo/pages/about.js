import { useTranslations } from "use-intl";
import Layout from "../components/layout";
import styling from '../styles/home.module.css'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPhoneAlt, faEnvelope} from '@fortawesome/free-solid-svg-icons'


export default function About() {
    const t = useTranslations()

    return (
        <Layout>
            <div className={styling.main}>
                <div className={styling.shadowBoxDiv} style={{ fontSize: 16 }}>
                    <p>
                        Expo-tours.ch vous propose la location d'AUTOCARS grand luxe sans signe
                        distinctif avec chauffeurs qualifiés. Nous sommes spécialisés dans
                        le transport de personnes au départ et à destination de tous les 
                        aéroports de pays et à l'étranger, ainsi qu'à destination de la gare
                        à Lausanne, Genève et autres. Nous prenons égaleemnt en cahrge toutes autres
                        destination quelles qu'elles soient.
                    </p>

                    <p>
                        Nos services vont du simple transfert, à la mise à
                        disposition à l’heure où à la journée. Toutes nos
                        AUTOCARS sont spécialement équipées et couvertes
                        par une assurance totale passagère.
                        Vous voyagez confortablement et en toute sécurité
                        avec des professionnels expérimentés.
                    </p>

                    <p>
                        Il est possible de vous fournir une AUTOCARS
                        avec chauffeur le jour même de votre réservation.
                    </p>

                    <p>
                        Louer un AUTOCAR avec chauffeur! C’est le meilleur moyen
                        de visiter Suisse et/ou l'Europe.
                        Nos tarifs sont très abordables.
                        Consultez nous pour toutes remises de prix:
                    </p>

                    <p>
                        <span><FontAwesomeIcon icon={faEnvelope}/> <a href="mailto:info@expo-tours.ch">
                            info@expo-tours.ch
                        </a></span>
                        <br/> <br/>

                        <div>
                            <><FontAwesomeIcon icon={faPhoneAlt}/> (+41) 076 27 40000</>
                        </div>
                    </p>
                </div>
            </div>
        </Layout>
    )
}

export async function getStaticProps(context) {
    return {
		props: {
			// You can get the messages from anywhere you like, but the recommended
			// pattern is to put them in JSON files separated by language and read 
			// the desired one based on the `locale` received from Next.js. 
			messages: require(`../locales/${context.locale}.json`)
		}
    };
}