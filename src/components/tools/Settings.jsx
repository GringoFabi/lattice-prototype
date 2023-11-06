import './settings.css'
import {Trans} from '@mbarzda/solid-i18next';


const Settings = ({hide, setHide, colors, setColors}) => {

    const updateColors = (label, value) => {
        const newColors = colors();
        newColors[label] = value;
        setColors({...newColors});
    }

    return (
        <div className="card column settings">
            <div className="row">
                <h3 style="margin: 1px"><Trans key="settings"/></h3>
                <span className="material-symbols-outlined hide" onClick={() => setHide(!hide())}>hide</span>
            </div>
            <hr style="width: 100%"></hr>
            <span className="color-picker">
                <label><Trans key="top-half-color-pick"/></label>
                <input type="color" id="head" name="head" value={colors()['top-half']}
                       onInput={(e) => updateColors('top-half', e.target.value)}/>
            </span>
            <span className="color-picker">
                <label><Trans key="bottom-half-color-pick"/></label>
                <input type="color" id="head" name="head" value={colors()['bottom-half']}
                       onInput={(e) => updateColors('bottom-half', e.target.value)}/>
            </span>
            <span className="color-picker">
                <label><Trans key="top-label-color-pick"/></label>
                <input type="color" id="head" name="head" value={colors()['top-label']}
                       onInput={(e) => updateColors('top-label', e.target.value)}/>
            </span>
            <span className="color-picker">
                <label><Trans key="bottom-label-color-pick"/></label>
                <input type="color" id="head" name="head" value={colors()['bottom-label']}
                       onInput={(e) => updateColors('bottom-label', e.target.value)}/>
            </span>
            <span className="color-picker">
                <label><Trans key="value-label-color-pick"/></label>
                <input type="color" id="head" name="head" value={colors()['value-label']}
                       onInput={(e) => updateColors('value-label', e.target.value)}/>
            </span>
        </div>
    )
}

export default Settings;