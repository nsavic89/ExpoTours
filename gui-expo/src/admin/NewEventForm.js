import '../styles/admin.css'
import { DatePicker, Form, Input, InputNumber, message } from 'antd'
import { useContext, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../AppContext'



// create new event/trip
// includes axios post request -> save new event
export default function NewEventForm() {
    const context = useContext(AppContext)
    const server = context.API
    const [nPickUps, setNpickUps] = useState(0);
    const router = useNavigate() // needed to redirect to /admin after an event added successfully

    return (
        <div className='wrapper'>
            <div>
                <Form
                    name="event"
                    wrapperCol={{ span: 12 }}
                    labelCol={{ span: 6 }}
                    className='form'
                    onFinishFailed={() => message.warning("Une erreur s'est produit")}
                    onFinish={
                        values => {
                            // route is an object with place: price elements
                            values.date1 = values.date1.format('DD-MM-YYYY');
                            values.date2 = values.date2.format('DD-MM-YYYY');
                            let route = {}

                            for (let key in values) {
                                if (key.split('_')[0] === 'pickupName') {
                                    let cityNo = key.split('_')[1]
                                    let cityName = values[`pickupName_${cityNo}`]
                                    
                                    // add city: price to route
                                    route[cityName] = values[`pickupPrice_${cityNo}`]
                                }
                            }
                            values['route'] = JSON.stringify(route)

                            // submit to server -> POST request
                            // axios
                            axios.post(
                                `${server}/events/`,
                                values,
                                {headers: {
                                    Pragma: "no-cache",
                                    Authorization: `Token ${localStorage.getItem('expo-token')}`
                                }}
                            ).then(
                                () => {
                                    context.update()
                                    message.success("Evenement sauvegardé avec succèss")
                                    router('/admin')
                                }
                            ).catch(
                                () => message.warning("Une erreur s'est produit")
                            )
                        }
                    }
                >
                    <div className='header'>
                        <div><h1>Ajouter nouveau evenement</h1></div>
                        <div>
                            <Link to='/admin'>
                                <button className='btnSecondary' type="button">
                                    Annuler
                                </button>
                            </Link>
                            <button className='btnPrimary' type="submit">
                                Sauvegarder
                            </button>
                        </div>
                    </div>
                    <br/><br/>
                    

                    <Form.Item
                        name="name"
                        label="Titre"
                        rules={[{required: true, message: "Obligatoire"}]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="theme"
                        label="Sujet"
                        rules={[{required: true, message: "Obligatoire"}]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="start"
                        label="Départ de"
                        rules={[{required: true, message: "Obligatoire"}]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="end"
                        label="Destination"
                        rules={[{required: true, message: "Obligatoire"}]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="date1"
                        label="Date du départ"
                        rules={[{required: true, message: "Obligatoire"}]}
                    >
                        <DatePicker format="DD-MM-YYYY" />
                    </Form.Item>

                    <Form.Item
                        name="date2"
                        label="Date du retour"
                        rules={[{required: true, message: "Obligatoire"}]}
                    >
                        <DatePicker format="DD-MM-YYYY" />
                    </Form.Item>

                    <Form.Item  
                        name="price"
                        label="Prix, CHF"
                        rules={[{required: true, message: 'Obligatoire'}]}
                    >
                        <InputNumber min={1} />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 6 }}>
                        <h3>Arrêts:</h3>
                    </Form.Item>
                    {
                        Array.from(Array(nPickUps)).map(
                            (_, inx) => (
                                <Form.Item key={inx} label={`Arrêt ${inx+1}`}>
                                    <Input.Group compac>
                                        <Form.Item  
                                            name={`pickupName_${inx}`}
                                            noStyle
                                            rules={[{required: true, message: 'Obligatoire'}]}
                                        >
                                            <Input style={{ width: '50%' }} placeholder="Endroit" />
                                        </Form.Item>

                                        <Form.Item  
                                            name={`pickupPrice_${inx}`}
                                            noStyle
                                            rules={[{required: true, message: 'Obligatoire'}]}
                                        >
                                            <InputNumber placeholder="Prix" min={1} />
                                        </Form.Item>
                                    </Input.Group>
                                </Form.Item>
                            )
                        )
                    }

                    <Form.Item wrapperCol={{ offset: 6 }}>
                        <button 
                            className='btnDashed'
                            type="button"
                            onClick={() => setNpickUps(nPickUps+1)}
                        >
                            Ajouter arrêt
                        </button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}