import { Form, Input, message } from "antd"
import axios from 'axios'
import { server } from '../../config'


import { useState } from 'react'
import useUser from '../../lib/useUser'
import fetchJson from '../../lib/fetchJson'

const Login = () => {
  const { mutateUser } = useUser({
    redirectTo: '/profile-sg',
    redirectIfFound: true,
  })

  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(values) {
      console.log(values)

        try {
        mutateUser(
            await fetchJson(`${ server }/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        }) )} catch (error) {
            console.error('An unexpected error happened:', error)
            setErrorMsg(error.data.message)
        }
  }

  return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            <div style={{ width: 500 }}>
                <h1>Connexion admin</h1>
                <Form onFinish={handleSubmit}>
                    <Form.Item 
                        name='username'
                        required
                        rules={[{ required: true, message: 'Obligatoire' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        required
                        type="password"
                        name='password'
                    >
                        <Input type='password' />
                    </Form.Item>
                    
                    <Form.Item>
                        <button type="submit" style={{
                            outline: 'none',
                            border: 'none',
                            background: 'orange',
                            borderRadius: 5,
                            padding: '5px 15px'
                        }}> Connexion
                        </button>
                    </Form.Item>
                </Form>
            </div>
        </div>
  )
}
export default Login
