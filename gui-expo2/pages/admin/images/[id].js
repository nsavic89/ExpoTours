import styling from '../../../styles/admin.module.css'
import { Form, Input, message, Upload } from 'antd'
import Link from 'next/link'
import axios from 'axios';
import { server } from '../../../config';


export default function EventImages(props) {
    
    // get images for this event
    const imgs = props.imgs.filter(o => o.event === props.event.id)

    return (
        <div className={styling.wrapper}>
            <div className={styling.header}>
                <div><h1>{props.event.name} (télécharger images)</h1></div>
                <div>
                    <Link href="/admin">
                        <button type="button" className={styling.btnSecondary}>Annuller</button>
                    </Link>
                </div>
            </div>

            <div>
                <Form
                    name="imgForm"
                    initialValues={
                        { event: props.event.id }
                    }
                    wrapperCol={{span: 8}}
                    labelCol={{span: 6}}
                    onFinish={
                        values => {
                            let formData = new FormData();
                            formData.append("img", values.img.file.originFileObj)
                            formData.append("event", values.event)


                            axios.post(
                                `${process.env.NEXT_PUBLIC_API_URL}/imgs/`,
                                formData,
                                {headers: {
                                    'Content-Type': 'multipart/form-data'
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
                        <Input value={props.event.id} disabled />
                    </Form.Item>
                    <Form.Item
                        name="img"
                        label="Image"
                        rules={[{ required: true, message: "Obligatoire" }]}
                    >
                        <Upload name="img">
                            <button type="button" className={styling.btnDashed}>
                                Selectionner image
                            </button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{ offset: 6 }}
                    >
                        <button type="submit" className={styling.btnPrimary}>
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



export async function getStaticPaths() {
    // Call an external API endpoint to get posts
    const res = await fetch(`${server}/events/`)
    const events = await res.json()
  
    // Get the paths we want to pre-render based on posts
    const paths = events.map(( event ) => ({
        params: { id: event.id.toString() },
    }))
  
    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return { paths, fallback: false }
}


export async function getStaticProps({ params }) {
    // params contains the post `id`.
    // If the route is like /posts/1, then params.id is 1
    const res = await fetch(`${server}/events/${params.id}`)
    const event = await res.json()

    const res2 = await fetch(`${server}/imgs/`)
    const imgs = await res2.json()

    // Pass post data to the page via props
    return { props: { event, imgs } }
}