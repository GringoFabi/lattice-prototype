import './navigation.css'
import SubConcepts from './SubConcepts.jsx';
import SuperConcepts from './SuperConcepts.jsx';
import Selection from './Selection.jsx';
import {Show} from "solid-js";

const Navigation = ({selection, superConcept, subConcept}) => {
    return (<div className="card">
        <div className="column">
            <h3 style="margin: 1px">Navigation</h3>
            <Selection selection={selection}/>
            <Show when={superConcept() !== null}>
                <SuperConcepts superConcept={superConcept}/>
            </Show>
            <Show when={subConcept() !== null}>
                <SubConcepts subConcept={subConcept}/>
            </Show>
        </div>
    </div>)
}

export default Navigation