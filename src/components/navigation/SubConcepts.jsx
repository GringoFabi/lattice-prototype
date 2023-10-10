import {nodeFromLattice} from '../../lattice-library/main.js';
import Concept from './Concept.jsx';

const type = 'Sub Concepts';
const name = 'Entity';

const SubConcepts = ({subConcept}) => {
    let botLabels = [];
    for (let name of subConcept()) {
        let node = nodeFromLattice(parseInt(name));
        if (node.botlabel.length > 0) {
            botLabels.push(...node.botlabel)
        }
    }

    return <Concept
        concept={subConcept()}
        labels={botLabels}
        type={type}
        name={name}
    />
}

export default SubConcepts