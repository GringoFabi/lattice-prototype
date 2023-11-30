import {Trans} from '@mbarzda/solid-i18next';

const HoverOverlay = () => {
    return <>
        <Trans key={"hover-help"}/>
        <img src="/hovering.png" alt="Hovering Node Labels" className="help-image"/>
    </>
}

export default HoverOverlay;