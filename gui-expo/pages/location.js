import { useTranslations } from "use-intl";
import Layout from "../components/layout"
import styling from "../styles/home.module.css"



export default function Location() {

    const t = useTranslations()

    return(
        <Layout>
            <div className={styling.main} style={{ fontSize: 16 }}>
                <div className={styling.shadowBoxDiv} style={{ marginTop: 50 }}>
                    <h1>
                        {t('nav.location')}
                    </h1>
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