import './App.css'
import {createSignal, Show} from "solid-js";
import Dropzone from "./Dropzone.jsx";
import Footer from "./Footer.jsx";
import Lattice from "./Lattice.jsx";
import Legend from "./Legend.jsx";
import {Environment} from "../env/environment.js";
import {bindSelectionUpdates} from "../lattice-library/main.js";
import Navigation from "./navigation/Navigation.jsx";

function App() {
    const [file, setFile] = createSignal(null);
    const [selection, setSelection] = createSignal([]);
    const [superConcept, setSuperConcept] = createSignal([]);
    const [subConcept, setSubConcept] = createSignal([]);
    bindSelectionUpdates(setSelection, setSuperConcept, setSubConcept);

    return (
        <>
            <div className="main">
                <Show when={file()} fallback={() => <Dropzone update={setFile}/>}>
                    <button className="reset-button"
                        onClick={() => setFile(null)}>Reset</button>
                    <Lattice file={file()}/>
                </Show>
                <div className="column"
                     style={`justify-content: ${(selection().length === 0 ? 'flex-end' : 'space-between')}`}>
                    <Show when={selection().length > 0}>
                        <Navigation selection={selection} superConcept={superConcept} subConcept={subConcept}/>
                    </Show>
                    <Legend />
                </div>
            </div>
            <Show when={import.meta.env.MODE === Environment.Dev}>
                <Footer/>
            </Show>
        </>
    )
}

export default App
