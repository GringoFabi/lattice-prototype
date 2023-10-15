import {getProperty, HoverState} from '../../node-util/node.jsx';
import {createMemo, For, Match, Switch} from 'solid-js';
import {collectBotLabels, collectTopLabels} from '../../node-util/concepts.js';


export const PropertyPopup = ({node, state, superConcept, subConcept}) => {
    const property = createMemo(() => node().toplabel[0]);
    return (<>
            <h3 style={{margin: 0}}>{getProperty(node())} </h3>
            <hr className="line"/>
            <Switch>
                <Match when={state() === HoverState.Lower}>
                    <span>Anything that {property()} also...<br/>
                        <For each={collectTopLabels(node(), superConcept(), true)}>{(item, index) =>
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
        </>
    )
}
