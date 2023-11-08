import './settings.css'
import {Trans} from '@mbarzda/solid-i18next';
import {createContext, createSignal, useContext} from 'solid-js';
import {OverlayContext} from './Tools.jsx';

const [showDimensions, setShowDimensions] = createSignal(false);
export const DimensionsContext = createContext([showDimensions, setShowDimensions]);


const Settings = ({hide, setHide, colors, setColors}) => {
    const [hideOverlay,] = useContext(OverlayContext);
    const className = () => hideOverlay() ? "card column settings" : "card column settings highlight";

    const updateColors = (label, value) => {
        const newColors = colors();
        newColors[label] = value;
        setColors({...newColors});
    }

    return (
        <div className={className()}>
            <div className="row">
                <h3 style="margin: 1px"><Trans key="settings"/></h3>
                <span className="material-symbols-outlined hide" onClick={() => setHide(!hide())}>hide</span>
            </div>
            <hr/>
            <span className="control-span">
                <label><Trans key="top-half-color-pick"/></label>
                <input type="color" id="head" name="head" value={colors()['top-half']}
                       onInput={(e) => updateColors('top-half', e.target.value)}/>
            </span>
            <span className="control-span">
                <label><Trans key="bottom-half-color-pick"/></label>
                <input type="color" id="head" name="head" value={colors()['bottom-half']}
                       onInput={(e) => updateColors('bottom-half', e.target.value)}/>
            </span>
            <span className="control-span">
                <label><Trans key="top-label-color-pick"/></label>
                <input type="color" id="head" name="head" value={colors()['top-label']}
                       onInput={(e) => updateColors('top-label', e.target.value)}/>
            </span>
            <span className="control-span">
                <label><Trans key="bottom-label-color-pick"/></label>
                <input type="color" id="head" name="head" value={colors()['bottom-label']}
                       onInput={(e) => updateColors('bottom-label', e.target.value)}/>
            </span>
            <span className="control-span">
                <label><Trans key="value-label-color-pick"/></label>
                <input type="color" id="head" name="head" value={colors()['value-label']}
                       onInput={(e) => updateColors('value-label', e.target.value)}/>
            </span>
            <span className="control-span">
                <label><Trans key="show-dimensions"/></label>
                <input type="checkbox" value={showDimensions()}
                       onInput={() => setShowDimensions(!showDimensions())}/>
            </span>
        </div>
    )
}

export default Settings;