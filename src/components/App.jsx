import './App.css'
import {createSignal, Show} from "solid-js";
import Dropzone from "./Dropzone.jsx";
import Footer from "./Footer.jsx";
import Lattice from "./Lattice.jsx";
import Legend from "./Legend.jsx";
import {Environment} from "../env/environment.js";

function App() {
    const [file, setFile] = createSignal(null)

    return (
        <>
            <div className="main">
                <Show when={file()} fallback={() => <Dropzone update={setFile}/>}>
                    <button className="reset-button"
                        onClick={() => setFile(null)}>Reset</button>
                    <Lattice file={file()}/>
                </Show>
                <Legend />
            </div>
            <Show when={import.meta.env.MODE === Environment.Dev}>
                <Footer/>
            </Show>
        </>
    )
}

export default App
