import { useState } from "react"
import { useTranslation } from 'react-i18next'
import MainLayout from '../components/MainLayout'
import '../styles/home.css'



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
    const { t } = useTranslation()
    
    return(
        <MainLayout>
            <div className='main-other-pages'>
                <div>
                    <div> 
                        <div className='locationBtnDiv'>{cars.map(
                            item => (
                                <button 
                                    className='locationBtn'
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

                        <div className="rentImgsWrapper">
                            <div className='rentImgsDiv'> 
                            {Array.from(Array(state.value)).map(
                            (_,inx) => (
                                <img
                                //loader={({src}) => src}
                                    src={`/location/${state.name}/img${inx+1}.jpg`}
                                    alt="Picture not loaded"
                                    width={400}
                                    style={{ margin: '5px' }}
                                />
                            )
                        )}</div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

