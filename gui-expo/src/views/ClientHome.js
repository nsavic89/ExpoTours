import { useContext, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MainLayout from '../components/MainLayout'
import '../styles/home.css'
import '../styles/buttons.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faChevronDown, faHome, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import Events from '../components/Events'
import Demand from '../components/Demand'
import { AppContext } from '../AppContext'
import { Link } from 'react-router-dom'



export default function ClientHome(props){
    const { t } = useTranslation()
	const [state, setState] = useState(1)
	const startRef = useRef(null)
	const eventsRef = useRef(null) // allow scrolling to events
	const demandRef = useRef(null)

	// context - images - gallery -- update 16JAN2022
	const galleries = useContext(AppContext).data.galleries
	const gimgs = useContext(AppContext).data.gimgs
	const server = useContext(AppContext).API
	console.log(useContext(AppContext))

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
								padding: 10,
								height: galleries.length===0 || gimgs.length===0 ? 270 : 170,
								width: galleries.length===0 || gimgs.length===0 ? 270 : 170,
							}}
						>
							<img
								src="/logo_light.png"
								width={galleries.length===0 || gimgs.length===0 ? 250 : 150}
								height={galleries.length===0 || gimgs.length===0 ? 240 : 150}
								alt="No logo"
							/>
						</div>

					{
						galleries.length===0 || gimgs.length===0 ?
						'' : <div className='galleries'>
						{galleries.map(
							gallery => (
								<Link to={`/gallery/${gallery.id}`}>
									<div className='gallery'>
										<div className='galleryImg'>
											<img src={gimgs.filter(o => o.galery===gallery.id).length===0 ?
												'/img/notripimg.png' :
												`${server}${gimgs.filter(o => o.galery===gallery.id)[0].img}`} 
												alt='x' 
												width={198}
												height={172}
												style={{ borderRadius: 7 }}
											/>
										</div>
										<div className='galleryName'>{gallery.name}</div>
									</div>
								</Link>
							)
						)}
						</div>
					}

					<div className='mainLogoButtons'>
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