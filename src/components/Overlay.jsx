import './overlay.css'

const Overlay = ({state, update}) => {

    return (<>
        <span className="material-symbols-outlined close" onClick={() => update(!state())}>close</span>
        <div className="overlay">
            <h1>Tutorial</h1>
        </div>
        <span className="arrow center">&#8679;</span>

        <div className="empty-card">
            <span className="arrow">&#8681;</span>
        </div>
    </>)

}

export default Overlay;