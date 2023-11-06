import {createSignal, Match, Show, Switch} from 'solid-js';
import Overlay from './Overlay.jsx';
import Settings from './Settings.jsx';
import LanguageMenu from './LanguageMenu.jsx';

const Tools = ({colors, setColors}) => {
    const [hideOverlay, setHideOverlay] = createSignal(true);
    const [hideSettings, setHideSettings] = createSignal(true);
    const [hideLanguage, setHideLanguage] = createSignal(true);

    return (
        <>
            <Show when={hideSettings() && hideOverlay() && hideLanguage()}>
                <div className="tools">
                    <span className="material-symbols-outlined help"
                          onClick={() => setHideOverlay(!hideOverlay())}>help</span>
                    <span className="material-symbols-outlined"
                          onClick={() => setHideLanguage(!hideLanguage())}>language</span>
                    <span className="material-symbols-outlined"
                          onClick={() => setHideSettings(!hideSettings())}>settings</span>
                </div>
            </Show>

            <Switch>
                <Match when={!hideOverlay()}>
                    <Overlay state={hideOverlay} update={setHideOverlay}/>
                </Match>
                <Match when={!hideSettings()}>
                    <Settings hide={hideSettings} setHide={setHideSettings} colors={colors} setColors={setColors}/>
                </Match>
                <Match when={!hideLanguage()}>
                    <LanguageMenu hide={hideLanguage} setHide={setHideLanguage}/>
                </Match>
            </Switch>

        </>
    )
}

export default Tools;