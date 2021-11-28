import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MainLayout from '../components/MainLayout'
import '../styles/home.css'
import '../styles/buttons.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faChevronDown, faHome, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import Events from '../components/Events'
import Demand from '../components/Demand'



export default function ClientHome(props){
    const { t } = useTranslation()
	const [state, setState] = useState(1)
	const startRef = useRef(null)
	const eventsRef = useRef(null) // allow scrolling to events
	const demandRef = useRef(null)

	const scrollView = (n) => {
		if (n<1 || n>3) {
			return;
		}
		setState(n)
		if (n === 1) {
			startRef.current.scrollIntoView({behavior: 'smooth'})
		} else if (n === 2) {
			eventsRef.current.scrollIntoView({behavior: 'smooth'})
		} else {
			demandRef.current.scrollIntoView({behavior: 'smooth'})
		}
	}

    return (
        <div>
            <MainLayout>
				<div className='main' ref={startRef}>
					<div style={{
							backgroundColor: 'rgba(200, 200, 200, 0.25)',
							borderRadius: 15,
							padding: 25,
							marginBottom: 25
						}}
					>
						<img
							src="/logo_light.png"
							width={200}
							height={225}
							alt="No logo"
						/>
					</div>
					<div><button 
						className='button' 
						onClick={() => scrollView(2)}
					>
						{t('home.discover')} <FontAwesomeIcon icon={faChevronDown} size="xs" />
					</button></div>

					<div><button
						className='button'
						onClick={() => scrollView(3)}
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
            </MainLayout>

			<div className='sideNavigation'>
				<button
					type="button"
					className='primary'
					onClick={() => scrollView(1)}
					style={{ textAlign: "center" }}
				>
					<FontAwesomeIcon icon={faHome} />
				</button>
				<br/>
				<button
					type="button"
					className='primary'
					onClick={() => scrollView(2)}
					style={{ textAlign: "center" }}
				>
					<FontAwesomeIcon icon={faCalendar} />
				</button>
				<br/>
				<button
					type="button"
					className='primary'
					onClick={() => scrollView(3)}
					style={{ textAlign: "center" }}
				>
					<FontAwesomeIcon icon={faQuestionCircle} />
				</button>
			</div>
        </div>
    )
}