import './App.css'
import {createSignal, Show} from "solid-js";
import Dropzone from "./Dropzone.jsx";
import Footer from "./Footer.jsx";
import Lattice from "./Lattice.jsx";

function App() {
    const [file, setFile] = createSignal(null)

    return (
        <>
            <div className="main">
                <Show when={file()} fallback={() => <Dropzone update={setFile}/>}>
                    <button onClick={() => setFile(null)}>Reset</button>
                    <Lattice file={file()}/>
                </Show>
            </div>
            <Footer/>
        </>
    )
}

export default App
