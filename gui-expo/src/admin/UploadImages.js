import '../styles/admin.css'
import { Form, Input, message, Upload } from 'antd'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../AppContext';


export default function UploadImages() {
    const context = useContext(AppContext)
    const server = context.API
    const [state, setState] = useState({})
    let router = useNavigate();
    const id = parseInt(useParams().id)

    useEffect(() => {
        axios.get(`${server}/gimgs/`, {headers: {
            Pragma: "no-cache",
            Authorization: `Token ${localStorage.getItem('expo-token')}`
        }})
        .then( res => setState({...state, imgs: res.data, loaded: true}) )
        .catch( () => router('/admin-login') ) 
    }, [])

    if (!state.loaded || !context.data.loaded) { return <div>Veuillez patienter</div>}
    
    // get images for this gallery
    const galery = context.data.galleries.find(o => o.id === id)
    const imgs = state.imgs.filter(o => o.galery === id)

    return (
        <div className='wrapper'>
            <div className='header'>
                <div><h1>{galery.name} (télécharger images)</h1></div>
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
                        { galery: galery.id }
                    }
                    wrapperCol={{span: 8}}
                    labelCol={{span: 6}}
                    onFinish={
                        values => {
                            let formData = new FormData();
                            formData.append("img", values.img.file.originFileObj)
                            formData.append("galery", values.galery)


                            axios.post(
                                `${server}/gimgs/`,
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
                        name="galery"
                        label="Galerie"
                        rules={[{ required: true, message: "Obligatoire" }]}
                    >
                        <Input value={galery.id} disabled />
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