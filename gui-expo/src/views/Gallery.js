import Modal from "antd/lib/modal/Modal";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../AppContext";
import Layout from "../components/MainLayout";



export default function Gallery () {
    const [state, setState] = useState(false);
    const context = useContext(AppContext);
    const server = context.API

    // gallery id
    const id = parseInt(useParams().id)
    let gallery = {}

    if (context.data.loaded) {
        gallery = context.data.galleries.find(o => o.id === id)
    } else {
        return (<div>Veuillez patienter</div>)
    }

    return (
        <Layout>
            <div style={{ paddingTop: 75, textAlign: "center" }}>
                <div>
                    <p><strong>{gallery.name}</strong></p>
                    <p><i>{gallery.info}</i></p>
                </div>

                <div>
                {context.data.gimgs.filter(o => o.galery===id).map(
                        image => (
                            <img 
                                className="imgClickable"
                                key={image.id} alt='x' 
                                src={`${server}${image.img}`}
                                height={250}
                                style={{ margin: 5, maxWidth: '90%' }}
                                onClick={() => setState( `${server}${image.img}` )}
                            />
                        )
                    )
                }
                </div>
            </div>

            <Modal visible={state} onCancel={()=>setState(false)} footer={<div />} width='90%'>
                <img src={state} alt='x' width='100%' style={{padding: 20}} />
            </Modal>
        </Layout>
    )
}