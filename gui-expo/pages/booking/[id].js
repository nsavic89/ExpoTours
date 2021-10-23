
import { Checkbox, Form, Input, InputNumber, message, Select } from "antd"
import { useTranslations } from "next-intl"
import Layout from "../../components/layout"
import styling from "../../styles/booking.module.css"
import homeStyling from "../../styles/home.module.css"
import btnStyling from "../../styles/button.module.css"
import { server } from '../../config'
import Image from 'next/image'
import { useRef, useState } from "react"
import axios from 'axios'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"


// this page is used to let users register for an event
export default function Booking(props) {

    const [state, setState] = useState(0)
    const [spin, setSpin] = useState(false)
    const [hidenFieldOthers, setHideFieldOthers] = useState(false)
    let router = useRouter()

    // load imgs of this event
    const event = props.event
	const imgs = props.imgs.filter(o => o.event === parseInt(event.id))	

    // second wrapper ref
    // after clicking on book now, the wrapper will be focused
    const bookRef = useRef(null)
    setTimeout(() => setState(state === imgs.length ? 0 : state+1), 5000)

	const t = useTranslations()
    const [ form ] = Form.useForm()
	

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
        <Layout>
			<div 
                className={ styling.wrapper }
                style={{
                    color: 'rgb(240, 240, 240)',
                    fontSize: '1rem',
                    backgroundColor: imgs[0] ? 'black' : 'silver'
                }}
                
            >
                <div style={{ opacity: 0.5 }}>
                    {
                        imgs[0] ? 
                        <Image
                            loader={({src}) => src}
                            src={imgs[state < imgs.length ? state : 0].img}
                            alt="Picture not loaded"
                            layout="fill"
                            placeholder="blur"
                            blurDataURL={imgs[0].img}
                            loading="lazy"
                        />
                        :<div />
                    }
                </div>
				

                <div 
                    style={{ 
                        zIndex: 1,
                        textAlign: 'center',
                        fontSize: 22,
                        background: imgs[0] ? 'rgba(0,0,0,0.45)' : 'rgb(80,80,80)',
                        borderRadius: 15,
                        padding: 50
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
                            className={btnStyling.primary}
                            onClick={() => bookRef.current.scrollIntoView({behavior: 'smooth'})}
                        >
                            {t('booking.book-now-button')}
                        </button>
                    </div>
                </div>
            </div>
    
            <div className={ styling.wrapper } ref={bookRef}>
                <h1>{event.name} - {event.destination} (<u>CHF {event.price}</u>)</h1>
                    
                <div>
                    <br/>
                    <Form
                        form={form}
                        name="booking"
                        autoComplete="off"
                        initialValues={{
                            nPeople: 0,
                            pickup: pickups[0].name
                        }}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 12 }}
                        style={{ minWidth: 450, width: 550 }}
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
                                    `${server}/travellers/`,
                                    values
                                ).then(
                                    () => {
                                        setSpin(false);
                                        router.push('/messages/success')
                                    }
                                ).catch(
                                    () => router.push('/messages/error')
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
                                className={btnStyling.primary}
                                style={{ width: 150 }}
                            >
                                {t('booking.book')}
                            </button>
                        </Form.Item>
                    </Form>
                </div>

                {
                    spin ? 
                    <div className={homeStyling.spinner} style={{ top: '100vh' }}>
                        Veuillez patienter...
                    </div> 
                    : <div />
                }
            </div>
        </Layout>
    )
}

// This function gets called at build time
export async function getStaticPaths() {
    // Call an external API endpoint to get posts
    const res = await fetch(`${server}/events/`)
    const events = await res.json()

    // Get the paths we want to pre-render based on posts
    let paths = []

    for (let i = 0; i < events.length; i++) {
        paths.push({ params: { id: events[i].id.toString() }, locale: 'fr' })
        paths.push({ params: { id: events[i].id.toString() }, locale: 'en' })
    }
  
    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return { paths, fallback: false }
  }

// load events
export async function getStaticProps(context) {
    const res = await fetch(`${server}/events/${context.params.id}`)
    const event = await res.json()

	// load images
	const res2 = await fetch(`${server}/imgs/`)
    const imgs = await res2.json()


    return {
        props: {
			imgs: imgs,
            event: event,
            messages: require(`../../locales/${context.locale}.json`)
        }
    };
}