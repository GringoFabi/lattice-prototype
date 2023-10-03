import {createSignal} from "solid-js";
import './App.css'

function Input() {
    const [load, setLoad] = createSignal("")

    return (
        <div className="card">
            <button onClick={() => setLoad((count) => prompt(count))}>
                count is {load()}
            </button>
        </div>
    )
}

export default Input