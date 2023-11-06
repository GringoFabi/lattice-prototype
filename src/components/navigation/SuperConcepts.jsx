import {nodeFromLattice} from '../../lattice-library/main.js';
import Concept from './Concept.jsx';
import {useTransContext} from '@mbarzda/solid-i18next';

const SuperConcepts = ({superConcept}) => {
    const [t] = useTransContext();
    const type = t('super-concepts');
    const name = t('property');

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