import {server} from '../../../config';
import styling from '../../../styles/admin.module.css'
import Link from 'next/link'
import { Form, Input, InputNumber, message } from 'antd'
import axios from 'axios'


export default function Facture({demand}) {


    return (
        <div className={styling.wrapper}>
            <div className={styling.header}>
                <div>
                    <p><strong>Demand: {demand.id}</strong></p>
                    <p>{demand.name} {demand.address} {demand['post_code']} {demand.city}</p>
                    <p>{demand.phone} | {demand.email}</p>
                    <p>De, jusqu'à: <strong>{demand['start_location']} - {demand['end_location']}</strong></p>
                    <p>Date/Heure: <strong>{demand['dt_start']} - {demand['dt_end']}</strong></p>
                    <p>Nombre de personnes: <strong>{demand['n_travellers']}</strong></p>
                    <p><i>{demand.comment}</i></p>
                </div>

                <div>
                    <Link href={'/admin'}>
                        <button type="button" className={styling.btnSecondary}>Retour</button>
                    </Link>
                </div>
            </div>


            <div>
                <h1>Nouvelle facture</h1>
                <Form
                    name="facture"
                    wrapperCol={{ span: 12 }}
                    labelCol={{ span: 6 }}
                    onFinish={
                        values => {
                            axios.post(
                                `${server}/facture-devis/${demand.id}`,
                                values
                            ).then(
                                () => message.success("Succès")
                            ).catch(
                                () => message.error("Erreur")
                            )
                        }
                    }
                >
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: "Obligatoire" }]}
                        label="Nom de la facture"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        rules={[{ required: true, message: "Obligatoire" }]}
                        label="Prix, CHF"
                    >
                        <InputNumber />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 6 }}>
                        <button type="submit" className={styling.btnPrimary}>
                            Créer et envoyer cette facture
                        </button>
                    </Form.Item>
                </Form>
            </div>
            
        </div>
    )
}



// This function gets called at build time
export async function getStaticPaths() {
    // Call an external API endpoint to get posts
    const res = await fetch(`${server}/demands/`)
    const demands = await res.json()

    // Get the paths we want to pre-render based on posts
    let paths = []

    for (let i = 0; i < demands.length; i++) {
        paths.push({ params: { id: demands[i].id.toString() }, locale: 'fr' })
        paths.push({ params: { id: demands[i].id.toString() }, locale: 'en' })
    }
  
    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return { paths, fallback: false }
  }

// load events
export async function getStaticProps(context) {
    const res = await fetch(`${server}/demands/${context.params.id}`)
    const demand = await res.json()



    return {
        props: {
            demand: demand,
            messages: require(`../../../locales/${context.locale}.json`)
        }
    };
}