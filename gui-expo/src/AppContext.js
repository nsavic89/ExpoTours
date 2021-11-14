import { createContext, useEffect, useState } from "react"
import axios from 'axios'

export const AppContext = createContext({});

export default function AppContextProvider(props) {

    // context data
    const [ update, runUpdate ] = useState(0);
    const [ state, setState ] = useState({})
    
    // API URL
    let API = 'https://expotours.ch';
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        API = 'http://localhost:8000';
    }

    
    // GET substances, scenarios...
    useEffect(() => {
        const promises = [
            axios.get(`${API}/client-events/`),
            axios.get(`${API}/client-events-imgs/`)
        ]
        
        Promise.all(promises)
        .then(res=>{
            setState({
                events: res[0].data,
                eventsImgs: res[1].data,
                loaded: true
            })
        })
        .catch(() => console.log('error'))
    }, [update])

    return(
        <AppContext.Provider 
            value={{
                API: API,
                data: state,
                update: ()=>runUpdate(update+1)
            }}>
            { props.children }
        </AppContext.Provider>
    )
}