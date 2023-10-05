import './App.css'
import {createSignal, Show} from "solid-js";
import Dropzone from "./Dropzone.jsx";
import Footer from "./Footer.jsx";
import Lattice from "./Lattice.jsx";
import Legend from "./Leged.jsx";

function App() {
    const [file, setFile] = createSignal(null)

    return (
        <>
            <div className="main">
                <Legend />
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
