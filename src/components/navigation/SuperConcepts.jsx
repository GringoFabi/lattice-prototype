import {nodeFromLattice} from '../../lattice-library/main.js';
import Concept from './Concept.jsx';
import {Trans, useTransContext} from '@mbarzda/solid-i18next';
import {createMemo} from 'solid-js';

const SuperConcepts = ({superConcept}) => {
    const [t] = useTransContext();
    const type = t('super-concepts');

    const collectTopLabels = createMemo(() => {
        let topLabels = [];
        for (let nodeName of superConcept()) {
            let node = nodeFromLattice(parseInt(nodeName));
            if (node.toplabel.length > 0) {
                topLabels.push(...node.toplabel)
            }
        }
        return topLabels;
    });

    const name = createMemo(() => {
        return collectTopLabels().length === 1 ? <Trans key="property-colon"/> : <Trans key="properties-colon"/>;
    });

    return <Concept
        concept={superConcept}
        labels={collectTopLabels}
        type={type}
        name={name}
    />
}

export default SuperConcepts