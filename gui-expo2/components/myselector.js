import buttons from '../styles/button.module.css'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'




// filter component
// because same elements for all three above lists (left button, right button...)
export default function MySelector(props) {

    // list of items available for selection
    // default value -> imporant for months (does not allow selections in the past)
    const myList = props.list
    

    // functions to shift down/up state regarding the list of items
    // based on the index of item currently set in state
    const shiftDown = () => {
        let ind = myList.indexOf(props.state)
        ind -= 1
        if (ind === -1) {
            ind = myList.length - 1
        } 
        props.getNewState(myList[ind])
    }

    const shiftUp = () => {
        let ind = myList.indexOf(props.state)
        ind += 1
        if (ind === myList.length) {
            ind = 0
        }
        props.getNewState(myList[ind])
    }



    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <button className={buttons.gost} onClick={shiftDown}>
                <FontAwesomeIcon icon={faChevronLeft} size="lg" />
            </button>
            <span style={{ margin: "0 15px", width: 90, textAlign: "center" }}> 
                { props.label ? props.label : props.state }
            </span>
            <button className={buttons.gost} onClick={shiftUp}>
                <FontAwesomeIcon icon={faChevronRight} size="lg" />
            </button>
        </div>
    )
}