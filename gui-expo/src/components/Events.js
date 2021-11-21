
import { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next'
import '../styles/home.css'
import '../styles/buttons.css'
import MySelector from './MySelector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom'
import { AppContext } from '../AppContext';




/* 
    component used by index.js as the second wrapper with 100vh
    displays events in a calendar like view
*/
function Events() {

    const { t } = useTranslation()
    // state keeps current date selected in filter
    // date to get current month and year
    const d = new Date()
    const cDay = d.getDate()
    const cMonth = d.getMonth()
    const cYear = d.getFullYear()

    const [state, setState] = useState({ 
        month: cMonth,
        year: cYear,
        theme: '-' 
    })
    // ref for events list to allow horizontal scrolling
    const eventsListRef = useRef(null);

    const context = useContext(AppContext)
    const server = context.API

    if (!context.data.loaded) {
        return <div>Loading</div>
    }
    
    // load events and event images from context
    const events = context.data.events
    const imgs = context.data.eventsImgs

    let themes = ['-']

    // set day, month, year for events
    for (let i in events) {
        let date = events[i].date1.split('-')
        events[i].day = parseInt(date[0])
        events[i].month = parseInt(date[1])
        events[i].year = parseInt(date[2])
        
        // add if not already added
        if (!themes.includes(events[i].theme)) {
            themes.push(events[i].theme)
        }
    }


    // const months, years and themes
    const months = Array.from(Array(12).keys())
    const years = Array.from({length: 5}, (_, i) => i + 2021)


    // filter day, month
    // disable possiblity to display yesterday's events (or more previous ones)
    let displayedEvents = events.filter(o => o.month >= cMonth)
    

    // events are displayed per day of the month
    // this is why we need an array with 31 days below
    const days = Array.from({length: 31}, (_, i) => i + 1)


    // filter events to the selected month, year and theme
    displayedEvents = displayedEvents.filter(
        o => o.month === state.month + 1 && o.year === state.year
    )


    if (state.theme !== '-') {
        // if all themes -> no filter related to the theme
        displayedEvents = displayedEvents.filter(o => o.theme === state.theme)
    }


    // get day name for events of a given day
    // based on the day of the month
    // and the current month and year in state
    const getDayName = day => {
        let d = new Date(state.year, state.month, day)
        let dayInd = d.getDay()
        return t(`day.${dayInd}`)
    }    



    const filters = (
        <div className='filters'>
            <MySelector list={months} state={state.month} label={t(`month.${state.month}`)}
                getNewState={value => setState({...state, month: value})} 
            />
            <MySelector list={years} state={state.year} 
                getNewState={value => setState({...state, year: value})} 
            />
            <MySelector list={themes} state={state.theme}
                getNewState={value => setState({...state, theme: value})} 
            />
            <div style={{ color: 'rgb(100,180,180)' }}>
                {
                    displayedEvents.length === 0
                    ? <span className='textDanger'>{ t('home.no-events') }</span>
                    : <span>Events: { displayedEvents.length }</span>
                }
                
            </div>
        </div>
    )

    // if no events in displayedEvents
    // show alert
    const noEventsAlert = (
        <div className='alertWarning'>
            <FontAwesomeIcon icon={ faExclamationTriangle } /> <span>
                { t('home.no-events-found-alert') }
            </span>
        </div>
    )

    const eventsWrapper = (
        <div className='eventsContainer'>
                <div style={{ paddingTop: 190 }}>
                    <button className='gost' style={{ fontSize: 38 }}
                        onClick={() => eventsListRef.current.scrollLeft -= 260}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                </div>

                <div className='eventsList' ref={eventsListRef}>
                    {
                        days.map(
                            day => (
                                displayedEvents.filter(o => o.day === day).length !== 0 
                                ? <div className='eventDay' key={day}>

                                    <div className='eventDate'>
                                        {`${day} ${t(`month.${state.month}`)}`}
                                    </div>

                                    <div className='eventDayName'>
                                        { getDayName(day) }
                                    </div>
                                    
                                    {
                                        displayedEvents.filter(o => o.day === day).map(
                                            event => (
                                                <Link to={`/booking/${event.id}`} key={event.id}>
                                                    <div className='event'>
                                                        <img
                                                            src={
                                                                imgs.filter(o => o.event === event.id).length>0 
                                                                ? `${server}${imgs.filter(o => o.event === event.id)[0].img}`
                                                                : '/img/notripimg.png'
                                                            }
                                                            alt="no-img"
                                                            width="100%"
                                                            height={150}
                                                        />
                                                        <div><strong>{event.name}</strong></div>
                                                        <div>({event.end})</div>
                                                        <div>{`${t('theme')}: ${event.theme}`}</div>
                                                        <div className='eventPrice'>CHF {event.price}</div>
                                                    </div>
                                                </Link>
                                            )
                                        )
                                    }
                                </div> : ''
                            )
                        )
                    }
                </div>

                <div style={{ paddingTop: 190 }}>
                    <button className='gost' style={{ fontSize: 38 }}
                        onClick={() => eventsListRef.current.scrollLeft += 260}
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
            </div>
    )

    return(
        <div className='events'>
            {filters}
            { displayedEvents.length === 0 ? noEventsAlert : eventsWrapper }
        </div>
    )
}

export default Events