import {createContext, createSignal, Match, Show, Switch} from 'solid-js';
import Overlay from '../overlay/Overlay.jsx';
import Settings from './Settings.jsx';
import LanguageMenu from './LanguageMenu.jsx';
import {Trans} from "@mbarzda/solid-i18next";

const [hideOverlay, setHideOverlay] = createSignal(false);
const [hideSettings, setHideSettings] = createSignal(true);
const [hideLanguage, setHideLanguage] = createSignal(true);

export const OverlayContext = createContext([hideOverlay, setHideOverlay])
export const LanguageContext = createContext([hideLanguage, setHideLanguage])
export const SettingsContext = createContext([hideSettings, setHideSettings])

const Tools = ({colors, setColors}) => {


    return (
        <>
            <Show when={hideSettings() && hideOverlay() && hideLanguage()}>
                <div className="tools">
                    <div className="icon-box">
                        <span className="material-symbols-outlined icon"
                              onClick={() => setHideOverlay(!hideOverlay())}>help</span>
                        <label><Trans key="help"/></label>
                    </div>
                    <div className="icon-box">
                        <span className="material-symbols-outlined icon"
                              onClick={() => setHideLanguage(!hideLanguage())}>language</span>
                        <label><Trans key="languages"/></label>
                    </div>
                    <div className="icon-box">
                        <span className="material-symbols-outlined icon"
                              onClick={() => setHideSettings(!hideSettings())}>settings</span>
                        <label><Trans key="settings"/></label>
                    </div>
                </div>
            </Show>

            <Show when={!hideOverlay()}>
                <Overlay />
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