import {getEntity, getProperty, HoverState} from '../../node-util/node.jsx';
import {For, Match, Switch} from 'solid-js';
import {collectBotLabels, collectTopLabels} from '../../node-util/concepts.js';

export const ComboPopup = ({node, state, superConcept, subConcept}) => {

    return (<>
        <h3 style={{margin: 0}}>
            <Switch>
                <Match when={state() === HoverState.Lower}>
                    {getEntity(node())}
                </Match>
                <Match when={state() === HoverState.Upper}>
                    {getProperty(node())}
                </Match>
            </Switch>
        </h3>
        <hr className="line"/>
        <Switch>
            <Match when={state() === HoverState.Lower}>
                <span>Has abilities:<br/>
                    <For each={collectTopLabels(node(), superConcept())}>{(item, index) =>
                        <>- {item}<br/></>
                    }</For>
                </span>
            </Match>
            <Match when={state() === HoverState.Upper}>
                    <span>Applies to:<br/>
                        <For each={collectBotLabels(node(), subConcept())}>{(item, index) =>
                            <>- {item}<br/></>
                        }</For>
                    </span>
            </Match>
        </Switch>
    </>)
}
