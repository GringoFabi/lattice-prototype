import {nodeFromLattice} from '../../lattice-library/main.js';
import Concept from './Concept.jsx';

const type = 'Super Concepts';
const name = 'Property';

const SuperConcepts = ({superConcept}) => {
    let topLabels = [];
    for (let nodeName of superConcept()) {
        let node = nodeFromLattice(parseInt(nodeName));
        if (node.toplabel.length > 0) {
            topLabels.push(...node.toplabel)
        }
    }

    return <Concept
        concept={superConcept()}
        labels={topLabels}
        type={type}
        name={name}
    />
}

export default SuperConcepts