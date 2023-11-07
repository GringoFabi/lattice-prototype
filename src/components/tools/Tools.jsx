import {createContext, createSignal, Match, Show, Switch} from 'solid-js';
import Overlay from '../overlay/Overlay.jsx';
import Settings from './Settings.jsx';
import LanguageMenu from './LanguageMenu.jsx';

const [hideSettings, setHideSettings] = createSignal(true);
const [hideLanguage, setHideLanguage] = createSignal(true);

export const LanguageContext = createContext([hideLanguage, setHideLanguage])
export const SettingsContext = createContext([hideSettings, setHideSettings])

const Tools = ({colors, setColors}) => {
    const [hideOverlay, setHideOverlay] = createSignal(true);

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

            <Show when={!hideOverlay()}>
                <Overlay state={hideOverlay} update={setHideOverlay}/>
            </Show>
            <Switch>
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