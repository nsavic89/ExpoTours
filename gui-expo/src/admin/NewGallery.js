import { Button, Form, Input, message, Space } from "antd"
import axios from 'axios'
import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AppContext } from "../AppContext"


export default function NewGallery() {
    const context = useContext(AppContext)
    const API = useContext(AppContext).API
    const router = useNavigate()

    return (
        <div>
            <br/>
            <Form
                name='gallery'
                wrapperCol={{ span: 12 }}
                labelCol={{ span: 6 }}
                onFinish={values => {
                    axios.post(
                        `${API}/galleries/`, 
                        values,
                        { headers: {
                            Pragma: "no-cache",
                            Authorization: `Token ${localStorage.getItem('expo-token')}`
                        }} 
                    ).then(
                        () => {
                            context.update();
                            message.success('Ajouter avec succès');
                            router('/admin');
                        }
                    )
                }}
            >
                <Form.Item
                    required
                    name='name'
                    label='Nom de galerie'
                    rules={[{ required: true, message: 'Obligatoire' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name='info'
                    label='Description'
                >
                    <Input.TextArea />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 6 }}>
                    <Space>
                        <Button type='primary' danger onClick={() => router('/admin')}>
                            Annuler
                        </Button>
                        <Button type='primary' htmlType="submit">
                            Sauvegarder
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    )
}