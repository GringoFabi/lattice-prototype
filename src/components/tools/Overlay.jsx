import './overlay.css'
import {Trans} from '@mbarzda/solid-i18next';

const Overlay = ({state, update}) => {

    return (<>
        <span className="material-symbols-outlined close" onClick={() => update(!state())}>close</span>
        <div className="overlay">
            <h1><Trans key="tutorial"/></h1>
        </div>
        <div className="buttons">
            <button onClick={() => console.log('next')}><Trans key="next"/></button>
            <button onClick={() => update(!state())}><Trans key="skip"/></button>
        </div>

    </>)

}

export default Overlay;