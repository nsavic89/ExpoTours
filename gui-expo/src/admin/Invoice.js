import '../styles/admin.css'
import { useState, useEffect, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../AppContext'
import { Button, Form, Input, InputNumber, message } from 'antd'



export default function Invoice () {

    const demandId = parseInt(useParams().id)
    const API = useContext(AppContext).API;

    // load demands
    const [demand, setDemand] = useState({loading:true})
    useEffect( () => {
        axios.get(`${API}/demands/${demandId}`)
        .then(res=>setDemand(res.data))
        .catch(()=>setDemand({error:true}))
    },[])

    if (demand.loading) {
        return(
            <div><p>Veuillez patienter...</p></div>
        )
    }



    return (
        <div className='wrapper-admin'>
            <div style={{ textAlign: 'right' }}>
                <Link to='/admin'>
                    <Button type='ghost'>Retour</Button>
                </Link>
            </div>
            <h1>Etablir nouvelle facture</h1><br/><br/>

            <Form
                name='invoice'
                onFinish={values => (
                    axios.post(`${API}/facture-devis/${demandId}`,values,
                    {
                        headers: { Pragma: "no-cache",Authorization: `Token ${localStorage.getItem('expo-token')}` },
                    }).then(() => message.success('Envoyé avec succès!'))
                    .catch(() => message.error("Une erreur s'est produite"))
                )}
                wrapperCol={{ span: 12 }}
                labelCol={{ span: 6 }}
            >
                <Form.Item
                    name='name'
                    required
                    label='Raison de paiement'
                >
                    <Input placeholder='par exemple: aller-retour à Basel à 01.04.2022' />
                </Form.Item>

                <Form.Item
                    name='price'
                    required
                    label='Prix (CHF)'
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 6 }}>
                    <Button type='primary' htmlType='submit'>
                        Envoyer
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}