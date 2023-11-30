import {Trans} from '@mbarzda/solid-i18next';

const MultiSelectionOverlay = () => {
    return <>
        <Trans key={"multi-selection-help"}/>
        <img src="/multi_selection.png" alt="Multi Selection" className="help-image"/>
    </>
}

export default MultiSelectionOverlay;