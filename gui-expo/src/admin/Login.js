import { Button, Form, Input, message } from 'antd'
import '../styles/admin.css'
import axios from 'axios'
import { useContext } from 'react'
import { AppContext } from '../AppContext'
import { useNavigate } from 'react-router-dom'



export default function Login() {
    const server = useContext(AppContext).API
    let router = useNavigate()

    return (
        <div className='admin-wrapper'>
            <Form 
                name='login'
                style={{ width: 500 }}
                wrapperCol={{ span: 16 }}
                labelCol={{ span: 8 }}
                onFinish={
                    values => {
                        axios.post(
                            `${server}/token`,
                            values
                        ).then(
                            res => {
                                localStorage.setItem('expo-token', res.data.token);
                                router('/admin');
                            }
                        ).catch(() => message.error('Connexion échouée'))
                    }
                }
            >
                <Form.Item wrapperCol={{ offset: 8 }}>
                    <h1>Connexion admin</h1>
                </Form.Item>

                <Form.Item
                    required
                    name='username'
                    label="Nom d'utilisateur"
                    rules={[{ required: true, message: 'Obligatoire' }]}
                ><Input />
                </Form.Item>

                <Form.Item
                    required
                    name='password'
                    label='Mot de passe'
                    rules={[{ required: true, message: 'Obligatoire' }]}
                ><Input type='password' />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8 }}>
                    <Button type="primary" htmlType="submit">
                        Connexion
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}