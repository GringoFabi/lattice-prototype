import './App.css'
import {createMemo, createSignal, Show} from 'solid-js';
import Dropzone from './Dropzone.jsx';
import Footer from './Footer.jsx';
import Lattice from './Lattice.jsx';
import Legend from './legend/Legend.jsx';
import {Environment} from '../env/environment.js';
import {bindSelectionUpdates} from '../lattice-library/main.js';
import Navigation from './navigation/Navigation.jsx';
import {Popup} from './hover/Popup.jsx';
import Tools from './tools/Tools.jsx';
import {Trans} from '@mbarzda/solid-i18next';

const initialColors = {
    'top-half': '#8888ff',
    'bottom-half': '#ddbbaa',
    'top-label': '#4444bb',
    'bottom-label': '#ddbb00',
    'value-label': '#ffffff',
};

const App = () => {
    const [file, setFile] = createSignal(null);
    const [selection, setSelection] = createSignal([]);
    const [superConcept, setSuperConcept] = createSignal(null);
    const [subConcept, setSubConcept] = createSignal(null);
    const [hoverNode, setHoverNode] = createSignal(null);
    const [hoverSuperConcept, setHoverSuperConcept] = createSignal(null);
    const [hoverSubConcept, setHoverSubConcept] = createSignal(null);
    const [hoverState, setHoverState] = createSignal('');
    bindSelectionUpdates(setSelection, setSuperConcept, setSubConcept, setHoverNode, setHoverSuperConcept, setHoverSubConcept, setHoverState);
    const conceptsAreSet = createMemo(() => superConcept() !== null && subConcept() !== null)
    const [colors, setColors] = createSignal(initialColors)

    const reset = () => {
        setFile(null);
        setSelection([]);
        setSuperConcept(null);
        setSubConcept(null);
        setHoverNode(null);
        setHoverSuperConcept(null);
        setHoverSubConcept(null);
        setHoverState('');
    }

    return (
        <>
            <div className="main">
                <Show when={file()} fallback={<Dropzone update={setFile}/>}>
                    <button className="reset-button"
                            onClick={() => reset()}>
                        <Trans key="reset" />
                    </button>
                    <Lattice file={file()} colors={colors}/>
                </Show>
            </div>
            <Show when={selection().length > 0 && conceptsAreSet()} fallback={<Tools colors={colors} setColors={setColors}/>}>
                <Navigation selection={selection} superConcept={superConcept} subConcept={subConcept}/>
            </Show>
            <Legend colors={colors}/>
            <Popup node={hoverNode} superConcept={hoverSuperConcept} subConcept={hoverSubConcept} state={hoverState}/>
            <Show when={import.meta.env.MODE === Environment.Dev}>
                <Footer/>
            </Show>
        </>
    )
}

export default App
