
import Layout from "../components/layout";
import styling from '../styles/home.module.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPhoneAlt, faEnvelope} from '@fortawesome/free-solid-svg-icons'

export default function Contact() {

    return (
        <Layout>
            <div className={styling.main}>
                <div className={styling.shadowBoxDiv}>
                    <span><FontAwesomeIcon icon={faEnvelope}/> <a href="mailto:info@expo-tours.ch">
                        info@expo-tours.ch
                    </a></span>
                    <br/> <br/>

                    <div>
                        <><FontAwesomeIcon icon={faPhoneAlt}/> (+41) 076 27 40000</>
                    </div>
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