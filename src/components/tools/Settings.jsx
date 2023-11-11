import './settings.css'
import {Trans} from '@mbarzda/solid-i18next';
import {createContext, createRenderEffect, createSignal, useContext} from 'solid-js';
import {OverlayContext} from './Tools.jsx';
import {updateFontSize} from '../../lattice-library/main.js';

const [showDimensions, setShowDimensions] = createSignal(false);
export const DimensionsContext = createContext([showDimensions, setShowDimensions]);


const Settings = ({hide, setHide, colors, setColors}) => {
    const [fontSize, setFontSize] = createSignal(20);
    const [hideOverlay,] = useContext(OverlayContext);
    const className = () => hideOverlay() ? "card column settings" : "card column settings highlight";

    const updateColors = (label, value) => {
        const newColors = colors();
        newColors[label] = value;
        setColors({...newColors});
    }

    createRenderEffect(() => updateFontSize(fontSize()));

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
            <span className="control-span">
                <label><Trans key="change-font-size"/></label>
                <input className="number-input" type="number" value={fontSize()} min={1} max={25}
                       onInput={(e) => setFontSize(e.target.value)}/>
            </span>
        </div>
    )
}

export default Settings;