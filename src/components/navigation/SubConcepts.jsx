import {nodeFromLattice} from '../../lattice-library/main.js';
import Concept from './Concept.jsx';
import {useTransContext} from '@mbarzda/solid-i18next';
import {createMemo} from "solid-js";

const SubConcepts = ({subConcept}) => {
    const [t] = useTransContext();
    const type = t('sub-concepts');
    const name = t('entity');
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

    return <Concept
        concept={subConcept}
        labels={collectBotLabels}
        type={type}
        name={name}
    />
}

export default SubConcepts