
import Layout from "../components/MainLayout";
import '../styles/home.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPhoneAlt, faEnvelope} from '@fortawesome/free-solid-svg-icons'

export default function Contact() {

    return (
        <Layout>
            <div className='main'>
                <div className='shadowBoxDiv'>
                    <span><FontAwesomeIcon icon={faEnvelope}/> <a href="mailto:info@expotours.ch">
                        info@expotours.ch
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