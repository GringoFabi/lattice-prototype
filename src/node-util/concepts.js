import {nodeFromLattice} from '../lattice-library/main.js';

export const collectTopLabels = (node, concepts, skipReflexive = false) => {
    if (skipReflexive) {
        concepts = concepts.slice(1)
    }

    let topLabels = [];
    concepts.forEach(item => {
        let node = nodeFromLattice(item);
        topLabels.push(...node.toplabel);
    })

    return topLabels;
}

export const collectBotLabels = (node, concepts, skipReflexive = false) => {
    if (skipReflexive) {
        concepts = concepts.slice(1);
    }

    let botLabels = [];
    concepts.forEach(item => {
        let node = nodeFromLattice(item);
        botLabels.push(...node.botlabel);
    })

    return botLabels;
}
