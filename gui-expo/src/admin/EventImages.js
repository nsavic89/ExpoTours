import '../styles/admin.css'
import { Form, Input, message, Upload } from 'antd'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../AppContext';


export default function EventImages() {
    const context = useContext(AppContext)
    const server = context.API
    const [state, setState] = useState({})
    let router = useNavigate();
    const id = parseInt(useParams().id)

    useEffect(() => {
        axios.get(`${server}/imgs/`, {headers: {
            Pragma: "no-cache",
            Authorization: `Token ${localStorage.getItem('expo-token')}`
        }})
        .then( res => setState({...state, imgs: res.data, loaded: true}) )
        .catch( () => router('/admin-login') ) 
    }, [])

    if (!state.loaded || !context.data.loaded) { return <div>Veuillez patienter</div>}
    
    // get images for this event
    const event = context.data.events.find(o => o.id === id)
    const imgs = state.imgs.filter(o => o.event === id)


    return (
        <div className='wrapper'>
            <div className='header'>
                <div><h1>{event.name} (télécharger images)</h1></div>
                <div>
                    <Link to="/admin">
                        <button type="button" className='btnSecondary'>Annuller</button>
                    </Link>
                </div>
            </div>

            <div>
                <Form
                    name="imgForm"
                    initialValues={
                        { event: event.id }
                    }
                    wrapperCol={{span: 8}}
                    labelCol={{span: 6}}
                    onFinish={
                        values => {
                            let formData = new FormData();
                            formData.append("img", values.img.file.originFileObj)
                            formData.append("event", values.event)


                            axios.post(
                                `${server}/imgs/`,
                                formData,
                                {headers: {
                                    'Content-Type': 'multipart/form-data',
                                    Pragma: "no-cache",
                                    Authorization: `Token ${localStorage.getItem('expo-token')}`
                                }}
                            ).then(
                                () => message.success("Téléchargé avec succès")
                            ).catch(
                                () => message.warning("Une erreur s'est produit")
                            )
                        }
                    }
                >
                    <Form.Item
                        name="event"
                        label="Evenement"
                        rules={[{ required: true, message: "Obligatoire" }]}
                    >
                        <Input value={event.id} disabled />
                    </Form.Item>
                    <Form.Item
                        name="img"
                        label="Image"
                        rules={[{ required: true, message: "Obligatoire" }]}
                    >
                        <Upload name="img">
                            <button type="button" className='btnDashed'>
                                Selectionner image
                            </button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{ offset: 6 }}
                    >
                        <button type="submit" className='btnPrimary'>
                            Télécharger
                        </button>
                    </Form.Item>
                </Form>
            </div>
            <br/>


            <div>
                <h3>Images déjà ajoutées:</h3><br/>
                {
                    imgs.map(
                        (img, ind) => (
                            <img
                                key={ind}
                                src={img.img}
                                alt=""
                                width={200}
                                style={{ margin: 5 }} 
                            />
                        )
                    )
                }
            </div>
        </div>
    )
}