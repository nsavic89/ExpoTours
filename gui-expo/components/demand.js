import styles from '../styles/home.module.css'
import btnStyles from '../styles/button.module.css'
import { DatePicker, Form, Input, InputNumber } from 'antd'
import { useTranslations } from 'next-intl'




// user may ask to rent a bus for a given date
// if no interest in the offered events provided by the owner
export default function Demand() {
    const t = useTranslations();


    return (
        <div className={ styles.arrange }>
            
            <Form
                name="form"
                wrapperCol={{ span: 14 }}
                labelCol={{ span: 6}}
                className={ styles.demandForm }
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
                    name="start_datetime"
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

                <Form.Item wrapperCol={{ offset: 6 }}>
                    <button type="submit" className={btnStyles.primary}>
                        {t('demand.button')}
                    </button>
                </Form.Item>
            </Form>
        </div>
    )
}