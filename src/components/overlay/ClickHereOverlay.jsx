import {Trans} from '@mbarzda/solid-i18next';

const ClickHereOverlay = () => {
    return <>
        <Trans key={"click-here-help"}/>
        <img src="/here.png" alt="Click on here" className="help-image"/>
    </>
}

export default ClickHereOverlay;