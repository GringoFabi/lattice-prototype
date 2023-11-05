import StandardNode from './StandardNode.jsx';
import './legend.css';
import {createSignal, Show} from 'solid-js';

const Legend = ({colors}) => {
    const [hide, setHide] = createSignal(false);

    return (
        <Show when={hide()} fallback={
            <span className="material-symbols-outlined show" onClick={() => setHide(!hide())}>explore</span>
        }>
            <div className="card legend">
                <div className="column">
                    <div className="row">
                        <h3 style="margin: 1px">Legend</h3>
                        <span className="material-symbols-outlined hide" onClick={() => setHide(!hide())}>hide</span>
                    </div>
                    <hr style="width: 100%"></hr>
                    <span style="margin: 0.5em 0.75em">Hover with your cursor on top of a node to display more information</span>
                    <div className="row-middle">
                        <StandardNode colors={colors}/>
                    </div>
                    <div className="row">
                        <StandardNode colors={colors}/>
                        <label style="margin-right: 2em">Choose an article by clicking on it</label>
                    </div>
                    <div className="row">
                        <StandardNode colors={colors}/>
                        <label style="margin-right: 2em">Choose a property by clicking on it</label>
                    </div>
                </div>
            </div>
        </Show>
    )
}

export default Legend;