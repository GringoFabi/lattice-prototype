import './navigation.css'
import SubConcepts from "./SubConcepts.jsx";
import SuperConcepts from "./SuperConcepts.jsx";
import Selection from "./Selection.jsx";

const Navigation = ({selection, superConcept, subConcept}) => {
    return (<div className="card">
        <div className="column">
            <h3 style="margin: 1px">Navigation</h3>
            <Selection selection={selection}/>
            <SuperConcepts superConcept={superConcept}/>
            <SubConcepts subConcept={subConcept}/>
        </div>
    </div>)
}

export default Navigation