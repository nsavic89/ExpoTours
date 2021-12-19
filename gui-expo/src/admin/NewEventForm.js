import '../styles/admin.css'
import { DatePicker, Form, Input, InputNumber, message } from 'antd'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../AppContext'
import moment from 'moment'

// UPDATE 18-Dec-2021
// Text editor Draft
import MyEditor from './MyEditor'
import { convertToRaw, EditorState, convertFromRaw } from 'draft-js'





// create new event/trip
// includes axios post request -> save new event
export default function NewEventForm() {
    const context = useContext(AppContext)
    const server = context.API
    const [nPickUps, setNpickUps] = useState(0);
    const router = useNavigate() // needed to redirect to /admin after an event added successfully

    // edit text in my editor
    // state (i.e. editor state) and onChange event
    const [state, setState] = useState({ editorState: EditorState.createEmpty() })

    
    // UPDATE 17-Dec-2021
    // load existing event to allow editing of an added event
    const eventId = parseInt(useParams().id) 
    const [form] = Form.useForm()
    let event = {}

    // set number of pick-ups
    useEffect(() => {
        if (eventId !== 0 && context.data.loaded) {
            event = context.data.events.find(o => o.id === eventId) 
            let route = JSON.parse(event.route)
            let n = Object.keys(route).length

            setNpickUps(n)
            form.setFieldsValue({
                name: event.name,
                theme: event.theme,
                start: event.start,
                end: event.end,
                price: event.price,
                date1: moment(event.date1, 'DD-MM-YYYY'),
                date2: moment(event.date2, 'DD-MM-YYYY')
            })

            // set route stops
            // set form values for route
            let routeObj = {}
            let stopNames = Object.keys(route)
            let stopPrices = Object.values(route)

            for (let i=0; i<n; i++) {
                routeObj[`pickupName_${i}`] = stopNames[i];
                routeObj[`pickupPrice_${i}`] = stopPrices[i];
            }
            form.setFieldsValue(routeObj)

            // set editor information text
            setState({ editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(event.info))) })
        }
    }, [])

    

    return (
        <div className='wrapper'>
            <div>
                <Form
                    name="eventForm"
                    form={form}
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

                            // get event description from myEditor
                            // update from 19-Dec-2021
                            values['info'] = JSON.stringify(convertToRaw( state.editorState.getCurrentContent() ))

                            // submit to server -> POST request
                            // axios

                            // PUT request
                            let url = `${server}/events/`
                            if (eventId !== 0) {
                                url = `${url}${eventId}/`
                            }

                            axios({
                                method: eventId===0 ? 'POST' : 'PUT',
                                url: url,
                                data: values,
                                headers: {
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
                        name="info"
                        label="Description"
                    >
                        <MyEditor setState={setState} editorState={state.editorState} />
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