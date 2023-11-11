import './overlay.css'
import {Trans} from '@mbarzda/solid-i18next';
import LegendOverlay from './LegendOverlay.jsx';
import {createSignal, onMount, useContext} from 'solid-js';
import LanguageOverlay from './LanguageOverlay.jsx';
import {LegendContext} from '../legend/Legend.jsx';
import {LanguageContext, OverlayContext, SettingsContext} from '../tools/Tools.jsx';
import SettingsOverlay from './SettingsOverlay.jsx';


const Overlay = () => {
    const [state, update] = useContext(OverlayContext);

    // store setters in an array for easier access
    const setters = [
        useContext(LegendContext)[1],
        useContext(LanguageContext)[1],
        useContext(SettingsContext)[1]
    ];

    const labels = [
        <Trans key="legend"/>,
        <Trans key="languages"/>,
        <Trans key="settings"/>
    ];

    const overlays = [
        <LegendOverlay/>,
        <LanguageOverlay/>,
        <SettingsOverlay/>
    ];

    const [next, setNext] = createSignal(0);

    onMount(() => {
        setters[0](false)
    });

    const switchToNext = () => {
        setters[next()](true)
        if (next() + 1 === overlays.length) {
            setNext(0)
        } else {
            setNext(next() + 1)
        }
        setters[next()](false)
    }

    const leave = () => {
        update(!state());
        setters.forEach(setter => setter(true));
    }

    return (<>
        <div className="overlay">
            <div className="card description">
                <div className="overlay-header">
                    <h1 style="margin: 0">
                        <Trans key="help"/>
                        {labels[next()]}
                    </h1>
                    <h2 style="margin: 0">
                        {next()+1}/{labels.length}
                    </h2>
                </div>
                <hr style="margin-bottom: 1em"/>
                {overlays[next()]}
            </div>
        </div>
        <div className="buttons">
            <button onClick={() => switchToNext()}><Trans key="next"/></button>
            <button onClick={() => leave()}><Trans key="skip"/></button>
        </div>
    </>)
}

export default Overlay;