import {For, Match, Switch} from 'solid-js';
import {HoverState} from '../../node-util/node.jsx';
import {constraintNode} from './Popup.jsx';
import {collectBotLabels, collectTopLabels} from '../../node-util/concepts.js';

export const EmptyPopup = ({node, state, superConcept, subConcept}) => {

    return (<>
        <h3 style="margin: 0">{constraintNode}</h3>
        <hr className="line"/>
        <Switch>
            <Match when={state() === HoverState.Lower}>
                <span>Applies:<br/>
                    <For each={collectTopLabels(node(), superConcept())}>{(item) =>
                        <>- {item}<br/></>
                    }</For>
                    to entities below.
                </span>
            </Match>
            <Match when={state() === HoverState.Upper}>
                    <span>Combines properties for:<br/>
                        <For each={collectBotLabels(node(), subConcept())}>{(item) =>
                            <>- {item}<br/></>
                        }</For>
                    </span>
            </Match>
        </Switch>
    </>)
}
