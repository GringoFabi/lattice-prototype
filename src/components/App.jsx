import './App.css'
import {createSignal, Show} from 'solid-js';
import Dropzone from './Dropzone.jsx';
import Footer from './Footer.jsx';
import Lattice from './Lattice.jsx';
import Legend from './Legend.jsx';
import {Environment} from '../env/environment.js';
import {bindSelectionUpdates} from '../lattice-library/main.js';
import Navigation from './navigation/Navigation.jsx';
import {Portal} from "solid-js/web";

const App = () => {
    const [file, setFile] = createSignal(null);
    const [selection, setSelection] = createSignal([]);
    const [superConcept, setSuperConcept] = createSignal(null);
    const [subConcept, setSubConcept] = createSignal(null);
    const [hoverNode, setHoverNode] = createSignal(null)
    bindSelectionUpdates(setSelection, setSuperConcept, setSubConcept, setHoverNode);

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
                    <Show when={selection().length > 0 && superConcept() !== null && subConcept() !== null}>
                        <Navigation selection={selection} superConcept={superConcept} subConcept={subConcept}/>
                    </Show>
                    <Legend />
                </div>
            </div>
            <Show when={hoverNode()}>

                <Portal>
                    <div className="popup" style={{
                        position: 'absolute',
                        top: `${hoverNode().coordinates.y}`,
                        left: `${hoverNode().coordinates.x}`
                    }}
                    >
                        <h3 style={{margin: 0}}>Node: {hoverNode().node.node}</h3>
                        <hr className="line"/>
                        <p>{hoverNode().coordinates.x}</p>
                        <p>{hoverNode().coordinates.y}</p>
                    </div>


                </Portal>

            </Show>
            <Show when={import.meta.env.MODE === Environment.Dev}>
                <Footer/>
            </Show>
        </>
    )
}

export default App
