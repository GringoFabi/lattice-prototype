import StandardNode from './StandardNode.jsx';
import './legend.css';
import {createContext, createSignal, Show, useContext} from 'solid-js';
import {Trans} from '@mbarzda/solid-i18next';
import {OverlayContext} from '../tools/Tools.jsx';

const [hide, setHide] = createSignal(true);
export const LegendContext = createContext([hide, setHide]);

const Legend = ({colors}) => {
    const [hideOverlay,] = useContext(OverlayContext);
    const className = () => hideOverlay() ? "card legend" : "card legend highlight";

    return (
        <Show when={!hide()} fallback={
            <div className="icon-box legend-box">
                <span className="material-symbols-outlined show icon" onClick={() => setHide(!hide())}>explore</span>
                <label><Trans key="legend"/></label>
            </div>
        }>
            <div className={className()}>
                <div className="column">
                    <div className="row">
                        <h3 style="margin: 1px"><Trans key="legend"/></h3>
                        <span className="material-symbols-outlined hide" onClick={() => setHide(!hide())}>hide</span>
                    </div>
                    <hr/>
                    <span style="margin: 0.5em 0.75em"><Trans key="hover-info"/></span>
                    <div className="row-middle">
                        <StandardNode colors={colors}/>
                    </div>
                    <div className="row">
                        <StandardNode colors={colors}/>
                        <label style="margin-right: 2em"><Trans key="bottom-selection-info"/></label>
                    </div>
                    <div className="row">
                        <StandardNode colors={colors}/>
                        <label style="margin-right: 2em"><Trans key="top-selection-info"/></label>
                    </div>
                </div>
            </div>
        </Show>
    )
}

export default Legend;