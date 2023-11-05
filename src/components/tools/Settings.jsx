import './settings.css'


const Settings = ({hide, setHide, colors, setColors}) => {

    const updateColors = (label, value) => {
        const newColors = colors();
        newColors[label] = value;
        setColors({...newColors});
    }

    return (
        <div className="card column settings">
            <div className="row">
                <h3 style="margin: 1px">Settings</h3>
                <span className="material-symbols-outlined hide" onClick={() => setHide(!hide())}>hide</span>
            </div>
            <hr style="width: 100%"></hr>
            <span className="color-picker">
                <label>Top Half Color: </label>
                <input type="color" id="head" name="head" value={colors()['top-half']}
                       onInput={(e) => updateColors('top-half', e.target.value)}/>
            </span>
            <span className="color-picker">
                <label>Bottom Half Color: </label>
                <input type="color" id="head" name="head" value={colors()['bottom-half']}
                       onInput={(e) => updateColors('bottom-half', e.target.value)}/>
            </span>
            <span className="color-picker">
                <label>Top Label Color: </label>
                <input type="color" id="head" name="head" value={colors()['top-label']}
                       onInput={(e) => updateColors('top-label', e.target.value)}/>
            </span>
            <span className="color-picker">
                <label>Bottom Label Color: </label>
                <input type="color" id="head" name="head" value={colors()['bottom-label']}
                       onInput={(e) => updateColors('bottom-label', e.target.value)}/>
            </span>
            <span className="color-picker">
                <label>Value Label Color: </label>
                <input type="color" id="head" name="head" value={colors()['value-label']}
                       onInput={(e) => updateColors('value-label', e.target.value)}/>
            </span>
        </div>
    )
}

export default Settings;