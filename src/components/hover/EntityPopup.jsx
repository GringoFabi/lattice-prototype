import {getEntity, HoverState} from '../../node-util/node.jsx';
import {For, Match, Switch} from 'solid-js';
import {collectBotLabels, collectTopLabels} from '../../node-util/concepts.js';
import {Trans} from '@mbarzda/solid-i18next';


export const EntityPopup = ({node, state, superConcept, subConcept}) => {
    return (<>
        <h3 style={{margin: 0}}>{getEntity(node())} </h3>
        <hr className="line"/>
        <Switch>
            <Match when={state() === HoverState.Lower}>
                <span><Trans key="popup-abilities"/><br/>
                    <For each={collectTopLabels(node(), superConcept())}>{(item) =>
                        <>- {item}<br/></>
                    }</For>
                </span>
            </Match>
            <Match when={state() === HoverState.Upper}>
                <span><Trans key="popup-properties"/><br/>
                    <For each={collectBotLabels(node(), subConcept(), true)}>{(item) =>
                        <>- {item}<br/></>
                    }</For>
                </span>
            </Match>
        </Switch>
    </>)
}
