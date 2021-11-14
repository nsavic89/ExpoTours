import { useState } from "react";
import { useTranslations } from "use-intl";
import Layout from "../components/layout"
import styling from "../styles/home.module.css"
import Image from 'next/image'



const cars = [{
    id:1,
    name: 'mrce',
    label: 'Mercedes E',
    value: 3
},{
    id:2,
    name: 'mrcs',
    label: 'Mercedes S',
    value: 6
}, {
    id:3,
    name: 'setra',
    label: 'Setra',
    value: 4
}, {
    id:4,
    name: 'sprinterlux',
    label: 'Sprinter Lux',
    value: 2
}, {
    id:5,
    name: 'sprintervip',
    label: 'Sprinter Vip',
    value: 4
}]




export default function Location() {

    const [state, setState] = useState({id:1,name:'mrce',value:3,label:'Mercedes E'})
    const t = useTranslations()
    
    return(
        <Layout>
            <div className={styling.main} style={{ fontSize: 16, justifyContent:'start' }}>
                <div className={styling.shadowBoxDiv} style={{ marginTop: 0 }}>
                    <div> 
                        <div  className={styling.locationBtnDiv}>{cars.map(
                            item => (
                                <button 
                                    className={styling.locationBtn} 
                                    onClick={() => setState(item)}
                                    style={
                                        item.id===state.id ? 
                                        {fontWeight:"bold",color:'orangered', border: '4px solid red'} 
                                        : {}}
                                > {item.label}
                                </button>
                            )
                        )}</div>

                        <br/>

                        <div style={{ overflow: 'auto', height: '80vh' }}>
                            {Array.from(Array(state.value)).map(
                            (_,inx) => (
                                <img
                                //loader={({src}) => src}
                                    src={`/location/${state.name}/img${inx+1}.jpg`}
                                    alt="Picture not loaded"
                                    width='50%'
                                    style={{ margin: '5px', marginLeft: '25%' }}
                                />
                            )
                        )}</div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export async function getStaticProps(context) {
    return {
		props: {
			// You can get the messages from anywhere you like, but the recommended
			// pattern is to put them in JSON files separated by language and read 
			// the desired one based on the `locale` received from Next.js. 
			messages: require(`../locales/${context.locale}.json`)
		}
    };
}