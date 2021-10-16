import styling from '../../styles/admin.module.css'
import stylingHome from '../../styles/home.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle, faImage, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { message, Popconfirm } from 'antd'
import axios from 'axios'
import { server } from '../../config'
import { Form, Select } from 'antd'



// status about the payement
const status = {
    reg: 'Enregistré',
    invited: 'Invité',
    payed: 'Payé'
}



export default function Admin(props) {
    const eventsList = props.eventsList

    // views (events, travellers...)
    const [view, setView] = useState('Evenements')
    const [events, setEvents] = useState([])
    const [demands, setDemands] = useState([])
    const [travellers, setTravellers] = useState([])
    const [state, setState] = useState(false) // render content
    const [selectedEvent, setSelectedEvent] = useState(0)

    // json to js object route in each event
    useEffect(() => {
        let newEvents = [...eventsList.map(o => Object.assign({}, o))]
        
        for (let i in newEvents) {
            // create div for route
            let routeDiv = []  
            let route = JSON.parse(newEvents[i].route)
            let n = 0
    
            for (let key in route) {
                routeDiv.push(
                    <div key={n}>
                        <span>{ key }: </span>
                        <span>CHF { route[key] }</span>
                    </div>
                )
                n = n + 1
            }
    
            newEvents[i].route = routeDiv
        } 
        setEvents(newEvents)
        setDemands(props.demands)
        setTravellers(props.travellers)
        setState(true)
    }, [])
  
    if (!state) return<div>Veuillez pationter</div>
    
  

    // events list with button to add new
    const eventsDiv = (
        <div>
            <div className={styling.header}>
                <div><h1>Evenements</h1></div>
                <div>
                    <Link href="/admin/addnew">
                        <button className={styling.btnPrimary}>
                            Créer nouveau
                        </button>
                    </Link>
                </div>
            </div>
            <br/>
            {
                events.length === 0
                ? <div className={stylingHome.alertWarning} style={{ width: '100%' }}>
                    <FontAwesomeIcon icon={faExclamationTriangle} /> <span>Aucun evenement ajouté</span>
                </div>
                : <table className={styling.table}>
                    <thead>
                        <tr>
                            <th className={styling.tableCell}>.</th>
                            <th className={styling.tableCell}>Dates</th>
                            <th className={styling.tableCell}>Titre</th>
                            <th className={styling.tableCell}>Sujet</th>
                            <th className={styling.tableCell}>Départ</th>
                            <th className={styling.tableCell}>Destination</th>
                            <th className={styling.tableCell}>Parcours</th>
                            <th className={styling.tableCell}>Prix, CHF</th>
                        </tr>
                    </thead>
                    <tbody>{
                        events.map(
                            (event, inx) => (
                                <tr key={event.id} style={inx%2!==0?{background:'#eaeaea'}:{}}>
                                    <td className={styling.tableCell}>
                                        <>
                                            <Popconfirm
                                                title="Vous êtes sûr?"
                                                onConfirm={() => axios.delete(
                                                        `${server}/events/${event.id}`
                                                    ).then(() => {
                                                        message.warning("Evenement effacé")
                                                        setEvents(events.filter(o => o.id !== event.id))
                                                    }).catch(() => message.warning("Une erreur s'est produit"))
                                                }
                                                okText="Oui"
                                                cancelText="Non"
                                            >
                                                <button type="button" className={styling.btnDanger}>
                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                </button>
                                            </Popconfirm>

                                            <Link href={`/admin/images/${event.id}`}>
                                                <button type="button" style={{ margin: '4px', borderRadius: '5px', outline: 'none', border: 'none' }}>
                                                    <FontAwesomeIcon icon={faImage} />
                                                </button>
                                            </Link>
                                        </>
                                    </td>
                                    <td className={styling.tableCell}>
                                        {event.date1} - {event.date2}
                                    </td>
                                    <td className={styling.tableCell}>{event.name}</td>
                                    <td className={styling.tableCell}>{event.theme}</td>
                                    <td className={styling.tableCell}>{event.start}</td>
                                    <td className={styling.tableCell}>{event.end}</td>
                                    <td className={styling.tableCell}>
                                        { event.route.map(item => item) }
                                    </td>
                                    <td className={styling.tableCell}>{event.price}</td>
                                </tr>
                            )
                        )
                    }</tbody>
                </table>
            }
        </div>
    )


    // travellers for the selected event
    // filter list of travellers
    let travellers2 = [...travellers.map(o => Object.assign({}, o))]
    if (selectedEvent !== 0) {
        travellers2 = travellers2.filter(o => o.event === selectedEvent)
    }

    // travellers
    const travellersDiv = (
        <div>
            
            <div className={styling.header}>
                <div><h1>Voyageurs enregistrés</h1></div>
                <div>
                    <Form
                        name="events"
                        layout='inline'
                        onFinish={
                            values => {
                                axios.get(`${server}/send-payment-invitation/${values.event}`)
                                .then(() => message.success("L'invitation envoyée"))
                                .catch(() => message.warning('Sans succès...essayez plus tard...'))
                            }
                        }
                    >
                        <Form.Item
                            required
                            name="event"
                            label="Evenement"
                            style={{ marginBottom: 0 }}
                            rules={[{ required:true, message:'Obligatoire' }]}
                        >
                            <Select onChange={value => setSelectedEvent(value)} style={{width:300}}>
                            {
                                eventsList.map(
                                    event => (
                                        <Select.Option value={event.id} key={event.id}>
                                            { event.name }
                                        </Select.Option>
                                    )
                                )
                            }
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <button type="submit" className={styling.btnPrimary}>
                                Inviter pour payement
                            </button>
                        </Form.Item>
                    </Form>
                </div>
            </div>

            <br/>

            <table className={styling.table}>
                <thead>
                    <tr>
                        <th>Supprimer</th>
                        <th>Prénom, nom</th>
                        <th>Adresse</th>
                        <th>Téléphone</th>
                        <th>E-mail</th>
                        <th>Accompagné avec</th>
                        <th>Arrêt</th>
                        <th>Prix, CHF</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <>
                        {travellers2.map(
                            (trv, inx) => (
                                <tr key={trv.id} style={inx%2===0?{background:'rgb(240,240,240)'}:{}}>
                                    <td>
                                        <Popconfirm
                                            title="Vous êtes sûr?"
                                            onConfirm={() => axios.delete(
                                                    `${server}/travellers/${trv.id}`
                                                ).then(() => {
                                                    message.warning("Voyageur effacée")
                                                    setTravellers(travellers.filter(o => o.id !== trv.id))
                                                }).catch(() => message.warning("Une erreur s'est produit"))
                                            }
                                            okText="Oui"
                                            cancelText="Non"
                                        >
                                            <button type="button" className={styling.btnDanger}>
                                                <FontAwesomeIcon icon={faTrashAlt} />
                                            </button>
                                        </Popconfirm>
                                    </td>
                                    <td>{`${trv['first_name']} ${trv['last_name']}`}</td>
                                    <td>{trv.address}</td>
                                    <td>{trv.phone}</td>
                                    <td>{trv.email}</td>
                                    <td>
                                        {JSON.parse(trv['joined_persons']).join(', ')}
                                    </td>
                                    <td>{trv.pickup}</td>
                                    <td>{trv.total}</td>
                                    <td>{status[trv.status]}</td>
                                </tr>
                            )
                        )}
                    </>
                </tbody>
            </table>

        </div>
    )




    // demands
    const demandsDiv = (
        <div>
            <div className={styling.header}>
                <div><h1>Devis/Demandes</h1></div>
            </div>
            <table className={styling.table}>
                <thead>
                    <tr>
                        <th>.</th>
                        <th>Nom</th>
                        <th>Société</th>
                        <th>Adresse</th>
                        <th>Contact</th>
                        <th>Voyage commence de</th>
                        <th>Voyage jusqu'à</th>
                        <th>Depuis (date/heure)</th>
                        <th>Jusqu'à (date/heure)</th>
                        <th>Nombre de personnes</th>
                        <th>Commentaire</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <>
                    {
                        demands.map(
                            (demand,inx) => (
                                <tr key={demand.key} style={inx%2==0?{background:'rgb(240,240,240)'}:{}}>
                                    <td>
                                        <>
                                        <Popconfirm
                                                title="Vous êtes sûr?"
                                                onConfirm={() => axios.delete(
                                                        `${server}/demands/${demand.id}`
                                                    ).then(() => {
                                                        message.warning("Demande effacée")
                                                        setDemands(demands.filter(o => o.id !== demand.id))
                                                    }).catch(() => message.warning("Une erreur s'est produit"))
                                                }
                                                okText="Oui"
                                                cancelText="Non"
                                            >
                                                <button type="button" className={styling.btnDanger}>
                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                </button>
                                            </Popconfirm>

                                            <Link href={`/admin/facture/${demand.id}`}>
                                                <button
                                                    type="button" 
                                                    style={{ 
                                                        margin: '4px',
                                                        borderRadius: '5px',
                                                        outline: 'none',
                                                        border: 'none',
                                                        background: 'rgb(20,180,100)',
                                                        color: 'white'
                                                    }}>
                                                    Créer facture
                                                </button>
                                            </Link>
                                        </>
                                    </td>
                                    <td>{demand.name}</td>
                                    <td>{demand.organization}</td>
                                    <td><>
                                        <div>{demand.address}</div>
                                        <div>{demand['post_code']}</div>
                                        <div>{demand.city}</div>
                                    </></td>
                                    <td><>
                                        <div>{demand.email}</div>
                                        <div>{demand.phone}</div>
                                    </></td>
                                    <td>{demand['start_location']}</td>
                                    <td>{demand['end_location']}</td>
                                    <td>{demand['dt_start']}</td>
                                    <td>{demand['dt_end']}</td>
                                    <td>{demand['n_travellers']}</td>
                                    <td>{demand.comment}</td>
                                    <td>{demand.status}</td>
                                </tr>
                            )
                        )
                    }
                    </>
                </tbody>
            </table>
        </div>
    )


    const views = {
        Evenements: eventsDiv,
        Demandes: demandsDiv,
        Voyageurs: travellersDiv
    }
    

    return(
        <div className={styling.wrapper}>
            <div className={styling.nav}>
                {
                    ['Evenements', 'Demandes', 'Voyageurs'].map(
                        item => (
                            <button 
                                className={styling.btnNav}
                                type="submit"
                                key={item}
                                onClick={() => setView(item)}
                            >
                                {item}
                            </button>
                        )
                    )
                }
            </div>
    
            { views[view] }
        </div>
    )
}



// pages/index.js
export async function getStaticProps(context) {
	const res = await fetch(`${server}/events/`)
    const events = await res.json()

    const res1 = await fetch(`${server}/travellers/`)
    const travellers = await res1.json()

    const res2 = await fetch(`${server}/demands/`)
    const demands = await res2.json()

    return {
		props: {
			eventsList: events,
            travellers: travellers,
            demands: demands,
            messages: require(`../../locales/${context.locale}.json`)
		}
    };
}


