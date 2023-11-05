import './overlay.css'

const Overlay = ({state, update}) => {

    return (<>
        <span className="material-symbols-outlined close" onClick={() => update(!state())}>close</span>
        <div className="overlay">
            <h1>Tutorial</h1>
        </div>
        <div className="buttons">
            <button onClick={() => console.log('next')}>Next</button>
            <button onClick={() => update(!state())}>Skip</button>
        </div>

    </>)

}

export default Overlay;