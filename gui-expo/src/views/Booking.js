
import { Checkbox, Form, Input, InputNumber, Select } from "antd"
import { useTranslation } from 'react-i18next'
import MainLayout from '../components/MainLayout'
import '../styles/booking.css'
import '../styles/home.css'
import '../styles/buttons.css'
import { useContext, useEffect, useRef, useState } from "react"
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from "../AppContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInfo, faInfoCircle } from "@fortawesome/free-solid-svg-icons"

// Update 19-Dec-2021
// Description of the event - MyEvent (=draft-js)
import { Editor, convertFromRaw, EditorState } from "draft-js"



// this page is used to let users register for an event
export default function Booking(props) {
    const [state, setState] = useState(0)
    const [spin, setSpin] = useState(false)
    const [hidenFieldOthers, setHideFieldOthers] = useState(false)
    const context = useContext(AppContext);
    const server = context.API
    let router = useNavigate()
    let event = {}
    let imgs = []

    // second wrapper ref
    // after clicking on book now, the wrapper will be focused
    const mainRef = useRef(null)
    const dscrRef = useRef(null)
    const bookRef = useRef(null)
    useEffect(() => { if (mainRef.current) mainRef.current.scrollIntoView({})} ,[])

    setTimeout(() => setState(state === imgs.length ? 0 : state+1), 5000)

	const { t } = useTranslation()
    const [ form ] = Form.useForm()
    const id = parseInt(useParams().id)

    if (!context.data.loaded) { return <div>Loading...</div>} 

    // load imgs of this event
    event = context.data.events.find(o => o.id === id)
	imgs = context.data.eventsImgs.filter(o => o.event === id)	

    // Update 19-Dec-2021 -> get info parsed
    const stateForEditor = convertFromRaw( JSON.parse(event.info) )
	

	// pickups are needed for users to decide where they want to join
	// the first pickup is the starting place
	// the destination, of course, cannot be a pickup
	// we define 'pickups' as the list with their names
    // and a separate with the corresponding prices
	let pickups = [{ name: event.start, price: event.price }]
    const route = JSON.parse(event.route)

    for (let key in route) {
        pickups.push({
            name: key,
            price: route[key]
        })
    }

    // pickups without first is only route for 'via' part in the first wrapper
    let pickupsNoFirst = [...pickups.map(o => Object.assign({}, o))]
    pickupsNoFirst.shift()


    // get total price at the end of form
    // this depends on the number of travellers and the pickup
    const getTotalPrice = () => {
        let n = form.getFieldValue('nPeople')
        let pickup = form.getFieldValue('pickup')
        let price = 0
        
        if (pickup) {
            price = pickups.find(o => o.name === pickup).price
        }
        
        return price * (n+1)
    }

    // spin while waiting request response
    // contains two big wrappers -> both with min height of 100vh
    // first -> presentation / advertisment
    // second -> booking form
    return (
        <MainLayout>
			<div ref={mainRef}
                className='wrapperBooking'
                style={{
                    color: 'rgb(240, 240, 240)',
                    backgroundColor: imgs[0] ? 'black' : 'silver'
                }}
            >
                <div style={{ opacity: 0.75 }}>
                    {
                        imgs[0] ? 
                        <img
                            src={`${server}${imgs[state < imgs.length ? state : 0].img}`}
                            alt="Picture not loaded"
                            className='bookingImg'
                        />
                        :<div />
                    }
                </div>
				

                <div 
                    style={{ 
                        zIndex: 1,
                        textAlign: 'center',
                        background: imgs[0] ? 'rgba(0,0,0,0.65)' : 'rgb(80,80,80)',
                        borderRadius: 15,
                        padding: 25
                    }}
                >
                    <div><h1>{ event.name } {t('booking.at-place')} {event.end}</h1></div>
                    
                    <div>
                        <strong>{event.start}</strong> {t('booking.to')} <strong>{event.end}</strong>
                    </div>
                    {
                        pickups.length < 2
                        ? t('booking.no-stop')
                        : <div>
                            <i>{t('booking.via')}: </i>
                            {pickupsNoFirst.map((pickup) => pickup.name).join(' - ')}
                        </div>
                    }
                    <br/>
                    <div>
                        <u>{
                            `${t('booking.from-date')}
                            ${event.date1}
                            ${t('booking.to-date')}
                            ${event.date2}`}
                        </u>
                    </div>
                    <div>
                        <h1 style={{ color: 'rgb(60,220,200)' }}>
                            CHF {event.price}
                        </h1>
                    </div>

                    <div>
                        <button
                            style={{ width: 300 }}
                            className='secondary'
                            onClick={() => dscrRef.current.scrollIntoView({behavior: 'smooth'})}
                        >
                            <span><FontAwesomeIcon icon={faInfoCircle} /> {t('booking.go-to-info')}</span>
                        </button>
                    </div>
                    <br/>
                    <div>
                        <button
                            style={{ width: 300 }}
                            className='primary'
                            onClick={() => bookRef.current.scrollIntoView({behavior: 'smooth'})}
                        >
                            {t('booking.book-now-button')}
                        </button>
                    </div>
                </div>
            </div>

            <div className="wrapperBookingInfo" ref={dscrRef} style={{ justifyContent:'space-between' }}>
                <div>
                    <h1><FontAwesomeIcon icon={faInfo}/> Information en détail</h1>
                    <div style={{ width: "95%",textJustify:'justify',fontSize: 'initial' }}>
                        <Editor editorState={ EditorState.createWithContent(stateForEditor) } readOnly={ true } />
                    </div>
                </div>

                <div style={{ marginBottom: 25 }}>
                    <button
                        style={{ width: 300 }}
                        className='primary'
                        onClick={() => bookRef.current.scrollIntoView({behavior: 'smooth'})}
                    >
                        {t('booking.book-now-button')}
                    </button>
                </div>
            </div>
    
            <div className='wrapperBooking' ref={bookRef}>
                <h1>{event.name} - {event.destination} (<u>CHF {event.price}</u>)</h1>
                    
                <div>
                    <br/>
                    <Form
                        form={form}
                        name="booking"
                        className="bookingForm"
                        autoComplete="off"
                        initialValues={{
                            nPeople: 0,
                            pickup: pickups[0].name
                        }}
                        labelCol={{ md: { span: 8 }, xs: {span: 24} }}
                        wrapperCol={{ md: { span: 12 }, xs: {span: 24}  }}
                        onFinish={
                            values => {
                                setSpin(true);
                                // joining persons should be stringified
                                let joining = [];

                                for (let key in values) {
                                    if (key.split('_')[0] === 'joiningPerson') {
                                        joining.push(values[key])
                                    }
                                }

                                values['joined_persons'] = JSON.stringify(joining)
                                values.total = getTotalPrice()
                                values.status = 'reg'
                                values.event = event.id

                                // send post request
                                axios.post(
                                    `${server}/client-booking/`,
                                    values
                                ).then(
                                    () => {
                                        setSpin(false);
                                        router('/success')
                                    }
                                ).catch(
                                    () => router('/warning')
                                )
                            }
                        }
                    >
                        <Form.Item	
                            label={t('booking.first-name')}
                            name="first_name"
                            rules={[{ required: true, message: t('field-required') }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item	
                            label={t('booking.last-name')}
                            name="last_name"
                            rules={[{ required: true, message: t('field-required') }]}
                        >
                            <Input />
                        </Form.Item>
        
                        <Form.Item	
                            label={t('booking.address')}
                            name="address"
                            rules={[{ required: true, message: t('field-required') }]}
                        >
                            <Input placeholder={t('booking.addressPlaceholder')} />
                        </Form.Item>
        
                        <Form.Item	
                            label="E-mail"
                            name="email"
                            rules={[
                                { required: true, message: t('field-required') },
                                { type: "email", message: t('not-email') }
                            ]}
                        >
                            <Input type="email" />
                        </Form.Item>
        
                        <Form.Item	
                            label={t('booking.phone')}
                            name="phone"
                            rules={[
                                { required: true, message: t('field-required') },
                                { min: 9, message: t('too-short') }
                            ]}
                        >
                            <Input minLength={9} />
                        </Form.Item>

                        <Form.Item
                            name="alone"
                            wrapperCol={{ offset: 8 }}
                            onChange={e => {
                                setHideFieldOthers(e.target.checked)
                                form.setFieldsValue({'nPeople':0})
                            }}
                        >
                            <Checkbox>{t('booking.alone')}</Checkbox>
                        </Form.Item>
        
                        {
                            hidenFieldOthers ?
                            <div />
                            :   <Form.Item
                                    label={t('booking.number-of-people')}
                                    name="nPeople"
                                >
                                    <InputNumber min={0} />
                                </Form.Item>
                        }
        
                        {
                            hidenFieldOthers ?
                            <div />
                            :   <Form.Item
                                    noStyle
                                    shouldUpdate={(prevValues, curValues) => prevValues.nPeople !== curValues.nPeople}
                                >
                                    {({ getFieldValue }) => (
                                        Array.from(Array(getFieldValue('nPeople'))).map(
                                            (_, ind) => (
                                                <Form.Item
                                                    key={ind}
                                                    name={`joiningPerson_${ind}`}
                                                    rules={[{ required: true, message: t('field-required') }]}
                                                    label={`${t('booking.person')} ${ind+1}`}
                                                >
                                                    <Input placeholder={t('booking.full-name')} />
                                                </Form.Item>
                                            )
                                        )
                                    )}
                                </Form.Item>
                        }
        
                        <Form.Item
                            name='pickup'
                            label={t('booking.pick-up')}
                        >
                            <Select>
                            {
                                pickups.map(
                                    pickup => (
                                        <Select.Option key={pickup.name} value={pickup.name}>
                                            {pickup.name} - {`CHF ${pickup.price}`}
                                        </Select.Option>
                                    )
                                )
                            }	
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={t('booking.final-price')}
                        >
                            <div style={{
                                fontSize: 22,
                                fontWeight: 'bold'
                            }}>
                                CHF {getTotalPrice() ? getTotalPrice() : event.price}
                            </div>
                        </Form.Item>
        
                        <Form.Item wrapperCol={{ offset: 8 }}>
                            <button 
                                type="submit"
                                className='primary'
                                style={{ width: 150 }}
                            >
                                {t('booking.book')}
                            </button>
                        </Form.Item>
                    </Form>
                </div>

                {
                    spin ? 
                    <div className='spinner' style={{ top: '100vh' }}>
                        Veuillez patienter...
                    </div> 
                    : <div />
                }
            </div>
        </MainLayout>
    )
}