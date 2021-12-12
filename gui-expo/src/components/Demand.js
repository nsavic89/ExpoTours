import '../styles/home.css'
import '../styles/buttons.css'
import { DatePicker, Form, Input, InputNumber, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import {useNavigate} from "react-router-dom";
import { useContext } from 'react'
import { AppContext } from '../AppContext'

// user may ask to rent a bus for a given date
// if no interest in the offered events provided by the owner
export default function Demand() {
    const { t } = useTranslation()
    let router = useNavigate()
    const context = useContext(AppContext)
    const server = context.API

    /*
        update 12.dec 21
        type of trip

        "simpleTrip": "Aller simple",
        "roundTrip": "Aller retrour",
        "dayTrip": "Mise à disposition journée",
        "fewDaysTrip": "Voyage de plusieurs jours",
        "excursionTrip": "Excursion",
        "shuttleServiceTrip": "Service de navettes",
        "cityTourTrip": "City tours",
        "aeroportTrip": "Transfère aéroport (Genève | Zurich | Basel)",
    */
    const tripType = [
        "simpleTrip",
        "roundTrip",
        "dayTrip",
        "fewDaysTrip",
        "excursionTrip",
        "shuttleServiceTrip",
        "cityTourTrip",
        "aeroportTrip",
        "otherTrip"
    ]



    return (
        <div className='arrange'>
            
            <Form
                name="form"
                labelCol={{ md:{span: 6}, xs:{span:24} }}
                wrapperCol={{ md: {span:14}, xs: {span:24} }}
                className='demandForm'
                onFinish={
                    values => {
                        // create start and end date strings 
                        // rename zip to post code 
                        values['dt_start'] = values.dt[0].format('DD.MM.YYYY HH:mm')
                        values['dt_end'] = values.dt[1].format('DD.MM.YYYY HH:mm')
                        values['post_code'] = values.zip

                        axios.post(
                            `${server}/client-demand/`,
                            values
                        ).then(() => router('/success')
                        ).catch(() => router('/warning'))
                    }
                }
            >
                <h1>{t('demand.title')}</h1>
                <Form.Item
                    name="name"
                    required={true}
                    label={t('demand.fullName')}
                    rules={[{ required: true, message: t('field-required')}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="organization"
                    label={t('demand.organization')}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="address"
                    required={true}
                    label={t('demand.address')}
                    rules={[{ required: true, message: t('field-required')}]}
                >
                    <Input placeholder={t('demand.addressPlaceholder')} />
                </Form.Item>

                <Form.Item
                    label={t('demand.cityAndZip')}
                    required
                >
                    <Input.Group compact>
                        <Form.Item
                            name="zip"
                            required={true}
                            rules={[{ required: true, message: t('field-required')}]}
                            noStyle
                        >
                            <InputNumber style={{ width: '30%' }}/>
                        </Form.Item>
                        <Form.Item
                            name="city"
                            required={true}
                            rules={[{ required: true, message: t('field-required')}]}
                            noStyle
                        >
                            <Input style={{ width: '70%' }} />
                        </Form.Item>
                    </Input.Group>
                </Form.Item>

                <Form.Item
                    name="email"
                    type="email"
                    required={true}
                    label={t('demand.email')}
                    rules={[
                        { required: true, message: t('field-required')},
                        { type: 'email', message: t('not-email')}
                    ]}
                >
                    <Input type="email" />
                </Form.Item>

                <Form.Item
                    name="phone"
                    required={true}
                    label={t('demand.phone')}
                    rules={[
                        { required: true, message: t('field-required')}
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="trip_type"
                    required={true}
                    label={t("demand.tripType")}
                    rules={[
                        { required: true, message: t('field-required') }
                    ]}
                >
                    <Select>
                        {tripType.map(
                            item => (
                                <Select.Option value={item} key={item}>
                                    {t(`demand.${item}`)}
                                </Select.Option>
                            )
                        )}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="start_location"
                    required={true}
                    label={t('demand.startLocation')}
                    rules={[
                        { required: true, message: t('field-required')}
                    ]}
                >
                    <Input placeholder={t('demand.locationPlaceholder')} />
                </Form.Item>

                <Form.Item
                    name="end_location"
                    required={true}
                    label={t('demand.endLocation')}
                    rules={[
                        { required: true, message: t('field-required')}
                    ]}
                >
                    <Input placeholder={t('demand.locationPlaceholder')} />
                </Form.Item>

                <Form.Item
                    name="dt"
                    required={true}
                    label={t('demand.dateTime')}
                    rules={[
                        { required: true, message: t('field-required')}
                    ]}
                >
                    <DatePicker.RangePicker
                        showTime={{ format: 'HH:mm' }}
                        format="DD-MM-YYYY HH:mm"
                        onChange={(value, dateString) => console.log(value)}
                        placeholder={[t('demand.startDateTime'), t('demand.endDateTime')]}
                    />
                </Form.Item>

                <Form.Item
                    name="n_travellers"
                    required={true}
                    label={t('demand.nPeople')}
                    rules={[
                        { required: true, message: t('field-required')}
                    ]}
                >
                    <InputNumber min={1} />
                </Form.Item>

                <Form.Item
                    name="comment"
                    label={t('demand.comment')}
                >
                    <Input.TextArea />
                </Form.Item>

                <Form.Item wrapperCol={{ md: {offset: 6} }}>
                    <button type="submit" className='primary'>
                        {t('demand.button')}
                    </button>
                </Form.Item>
            </Form>
        </div>
    )
}