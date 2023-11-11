import {nodeFromLattice} from '../../lattice-library/main.js';
import Concept from './Concept.jsx';
import {Trans, useTransContext} from '@mbarzda/solid-i18next';
import {createMemo} from 'solid-js';

const SubConcepts = ({subConcept}) => {
    const [t] = useTransContext();
    const type = t('sub-concepts');

    const collectBotLabels = createMemo(() => {
        let botLabels = [];
        for (let name of subConcept()) {
            let node = nodeFromLattice(parseInt(name));
            if (node.botlabel.length > 0) {
                botLabels.push(...node.botlabel)
            }
        }
        return botLabels;
    });

    const name = createMemo(() => {
        return collectBotLabels().length === 1 ? <Trans key="entity-colon"/> : <Trans key="entities-colon"/>;
    });

    return <Concept
        concept={subConcept}
        labels={collectBotLabels}
        type={type}
        name={name}
    />
}

export default SubConcepts