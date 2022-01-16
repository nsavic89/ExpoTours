

import '../styles/home.css'
import '../styles/admin.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalculator, faEdit, faExclamationTriangle, faImage, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { message, Popconfirm } from 'antd'
import axios from 'axios'
import { Form, Select } from 'antd'
import { AppContext } from '../AppContext'




// status about the payement
const status = {
    reg: 'Enregistré',
    invited: 'Invité',
    payed: 'Payé'
}





export default function Admin() {
    const server = useContext(AppContext).API
    let router = useNavigate()

    // views (events, travellers...)
    const [view, setView] = useState('Evenements')
    const [events, setEvents] = useState([])
    const [demands, setDemands] = useState([])
    const [travellers, setTravellers] = useState([])
    const [galery, setGalery] = useState([])
    const [state, setState] = useState(false) // render content
    const [selectedEvent, setSelectedEvent] = useState(0)

    const headers = {
        Pragma: "no-cache",
        Authorization: `Token ${localStorage.getItem('expo-token')}`
    }

    // json to js object route in each event
    useEffect(() => {
        Promise.all([
            axios.get(`${server}/events/`, {headers:headers}),
            axios.get(`${server}/travellers/`, {headers:headers}),
            axios.get(`${server}/demands/`, {headers:headers}),
            axios.get(`${server}/galleries/`, {headers:headers})
        ])
        .then(
            res => {
                setEvents(res[0].data);
                setTravellers(res[1].data);
                setDemands(res[2].data);
                setGalery(res[3].data);
                setState(true);
            })
        .catch(
            () => router('/admin-login')
        )
    }, [])
  
    if (!state) return<div>Not authorized</div>

    let events2 = [...events.map(o => Object.assign({}, o))]
        
    for (let i in events2) {
        // create div for route
        let routeDiv = []  
        let route = JSON.parse(events2[i].route)
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

        events2[i].route = routeDiv
    } 
  

    // events list with button to add new
    const eventsDiv = (
        <div>
            <div className='header'>
                <div><h1>Evenements</h1></div>
                <div>
                    <Link to="/admin-new-event/0">
                        <button className='primary'>
                            Créer nouveau
                        </button>
                    </Link>
                </div>
            </div>
            <br/>
            {
                events.length === 0
                ? <div className='alertWarning' style={{ width: '100%' }}>
                    <FontAwesomeIcon icon={faExclamationTriangle} /> <span>Aucun evenement ajouté</span>
                </div>
                : <table className='table'>
                    <thead>
                        <tr>
                            <th className='tableCell' style={{ width: 100 }}>.</th>
                            <th className='tableCell'>Dates</th>
                            <th className='tableCell'>Titre</th>
                            <th className='tableCell'>Sujet</th>
                            <th className='tableCell'>Départ</th>
                            <th className='tableCell'>Destination</th>
                            <th className='tableCell'>Parcours</th>
                            <th className='tableCell'>Prix, CHF</th>
                        </tr>
                    </thead>
                    <tbody>{
                        events2.map(
                            (event, inx) => (
                                <tr key={event.id} style={inx%2!==0?{background:'#eaeaea'}:{}}>
                                    <td className='tableCell'>
                                        <>
                                            <Popconfirm
                                                title="Vous êtes sûr?"
                                                onConfirm={() => axios.delete(`${server}/events/${event.id}/`, {headers:headers})
                                                    .then(() => {
                                                        message.warning("Evenement effacé")
                                                        setEvents(events.filter(o => o.id !== event.id))
                                                    }).catch(() => message.warning("Une erreur s'est produit"))
                                                }
                                                okText="Oui"
                                                cancelText="Non"
                                            >
                                                <button type="button" className='btnDanger'>
                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                </button>
                                            </Popconfirm>

                                            <Link to={`/admin-new-event/${event.id}`} style={{ marginLeft: '4px' }}>
                                                <button type="button" className='btnDefault'>
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                            </Link>

                                            <Link to={`/admin-images/${event.id}`}>
                                                <button type="button" style={{ margin: '4px', borderRadius: '5px', outline: 'none', border: 'none' }}>
                                                    <FontAwesomeIcon icon={faImage} />
                                                </button>
                                            </Link>
                                        </>
                                    </td>
                                    <td className='tableCell'>
                                        {event.date1} - {event.date2}
                                    </td>
                                    <td className='tableCell'>{event.name}</td>
                                    <td className='tableCell'>{event.theme}</td>
                                    <td className='tableCell'>{event.start}</td>
                                    <td className='tableCell'>{event.end}</td>
                                    <td className='tableCell'>
                                        { event.route.map(item => item) }
                                    </td>
                                    <td className='tableCell'>{event.price}</td>
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
            
            <div className='header'>
                <div><h1>Voyageurs enregistrés</h1></div>
                <div>
                    <Form
                        name="events"
                        layout='inline'
                        onFinish={
                            values => {
                                axios.get(`${server}/send-payment-invitation/${values.event}`, {headers:headers})
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
                                events.map(
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
                            <button type="submit" className='btnPrimary'>
                                Inviter pour payement
                            </button>
                        </Form.Item>
                    </Form>
                </div>
            </div>

            <br/>

            <table className='table'>
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
                                                    `${server}/travellers/${trv.id}/`, {headers:headers}
                                                ).then(() => {
                                                    message.warning("Voyageur effacée")
                                                    setTravellers(travellers.filter(o => o.id !== trv.id))
                                                }).catch(() => message.warning("Une erreur s'est produit"))
                                            }
                                            okText="Oui"
                                            cancelText="Non"
                                        >
                                            <button type="button" className='btnDanger'>
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
            <div className='header'>
                <div><h1>Devis/Demandes</h1></div>
            </div>
            <table className='table'>
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
                                    <td style={{ width: 100 }}>
                                        <>
                                        <Popconfirm
                                                title="Vous êtes sûr?"
                                                onConfirm={() => axios.delete(
                                                        `${server}/demands/${demand.id}/`, {headers:headers}
                                                    ).then(() => {
                                                        message.warning("Demande effacée")
                                                        setDemands(demands.filter(o => o.id !== demand.id))
                                                    }).catch(() => message.warning("Une erreur s'est produit"))
                                                }
                                                okText="Oui"
                                                cancelText="Non"
                                            >
                                                <button type="button" className='btnDanger'>
                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                </button>
                                            </Popconfirm>

                                            <Link to={`/admin/facture/${demand.id}`}>
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
                                                    <FontAwesomeIcon icon={faCalculator} />
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


    // Gallery
    const galeryDiv = (
        <div>  
            <div className='header'>
                <h1>Galeries</h1>
                <div><Link to='/admin-new-gallery/0'>
                    <button type='button' className='btnPrimary'>Créer nouvelle</button>
                </Link></div>
            </div>
            <div>
                {galery.length===0 ? <div className='alertWarning' style={{ marginTop: 25 }}>Aucune galerie trouvée</div> : ''}
            </div>
            <div>
                {galery.map(
                    item => (
                        <div key={item.id} className='album'>
                            <Popconfirm
                                                title="Vous êtes sûr?"
                                                onConfirm={() => axios.delete(
                                                        `${server}/galleries/${item.id}/`, {headers:headers}
                                                    ).then(() => {
                                                        message.warning("Gallerie effacée")
                                                        setGalery(galery.filter(o => o.id !== item.id))
                                                    }).catch(() => message.warning("Une erreur s'est produit"))
                                                }
                                                okText="Oui"
                                                cancelText="Non"
                                            >
                                                <button type="button" className='btnDanger'>
                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                </button>
                                            </Popconfirm>
                            <Link to={`/admin-upload-imgs/${item.id}`}>
                                <button style={{ color: 'orangered' }} type='button'><FontAwesomeIcon icon={faImage} /> Télécharger images</button>
                            </Link>
                            <span style={{ paddingLeft: 10 }}><strong>{item.name}</strong></span>

                            <p><i>{item.info}</i></p>
                        </div>
                    )
                )}
            </div>
        </div>
    )


    const views = {
        Evenements: eventsDiv,
        Demandes: demandsDiv,
        Voyageurs: travellersDiv,
        Galeries: galeryDiv
    }
    

    return(
        <div className='wrapper-admin'>
            <div className='nav-admin'>
                {
                    ['Evenements', 'Demandes', 'Voyageurs', 'Galeries'].map(
                        item => (
                            <button 
                                className='btnNav'
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