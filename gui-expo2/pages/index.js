import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRef } from 'react'
import { useTranslations } from 'use-intl'
import Demand from '../components/demand'
import Events from '../components/events'
import Layout from '../components/layout'
import styles from '../styles/home.module.css'
import btnStyles from '../styles/button.module.css'
import { server } from '../config';
import Image from 'next/image'


// home cover, events (separate component)
// arrang a trip -> user may ask for a trip of his choice / third element of this page

export default function Home(props) {

	const t = useTranslations()
	const startRef = useRef(null)
	const eventsRef = useRef(null) // allow scrolling to events
	const demandRef = useRef(null)


	

    return (
        <div>
            <Layout>
				<div className={styles.main}>
					<div style={{
							backgroundColor: 'rgba(200, 200, 200, 0.25)',
							borderRadius: 15,
							padding: 25,
							marginBottom: 25
						}}
						ref={startRef}
					>
						<Image
							src="/logo_light.png"
							width={200}
							height={225}
							alt="No logo"
						/>
					</div>
					<div><button 
						className={styles.button} 
						onClick={() => eventsRef.current.scrollIntoView({behavior: 'smooth'})}
					>
						{t('home.discover')} <FontAwesomeIcon icon={faChevronDown} size="xs" />
					</button></div>

					<div><button
						className={styles.button}
						onClick={() => demandRef.current.scrollIntoView({behavior: 'smooth'})}
					>
						{t('home.ask')} <FontAwesomeIcon icon={faChevronDown} size="xs" />
					</button></div>
				</div>

				<div ref={eventsRef}>
					<Events events={props.events} imgs={props.imgs} />
				</div>

				<div ref={demandRef}>
					<Demand />
				</div>
            </Layout>

			<div className={styles.sideNavigation}>
				<button
					type="button"
					className={btnStyles.primary}
					onClick={() => startRef.current.scrollIntoView({behavior: 'smooth'})}
					style={{ textAlign: "left" }}
				>
					<FontAwesomeIcon icon={faChevronUp} /> {t('nav.home')}
				</button>
				<br/>
				<button
					type="button"
					className={btnStyles.primary}
					onClick={() => demandRef.current.scrollIntoView({behavior: 'smooth'})}
					style={{ textAlign: "left" }}
				>
					<FontAwesomeIcon icon={faChevronDown} /> Devis
				</button>
			</div>
        </div>
    )
}


// pages/index.js
export async function getStaticProps(context) {

	const res = await fetch(`${server}/events/`)
    const events = await res.json()

	// load images
	const res2 = await fetch(`${server}/imgs/`)
    const imgs = await res2.json()


    return {
		props: {
			// You can get the messages from anywhere you like, but the recommended
			// pattern is to put them in JSON files separated by language and read 
			// the desired one based on the `locale` received from Next.js. 
			messages: require(`../locales/${context.locale}.json`),
			events: events,
			imgs: imgs
		}
    };
}
