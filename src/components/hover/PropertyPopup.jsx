import {getProperty, HoverState} from '../../node-util/node.jsx';
import {createMemo, For, Match, Switch} from 'solid-js';
import {collectBotLabels, collectTopLabels} from '../../node-util/concepts.js';
import {Trans} from '@mbarzda/solid-i18next';


export const PropertyPopup = ({node, state, superConcept, subConcept}) => {
    const property = createMemo(() => node().toplabel[0]);
    return (<>
            <h3 style={{margin: 0}}>{getProperty(node())} </h3>
            <hr className="line"/>
            <Switch>
                <Match when={state() === HoverState.Lower}>
                    <span><Trans key="property-info"/>{property()}<Trans key="property-outro"/><br/>
                        <For each={collectTopLabels(node(), superConcept(), true)}>{(item) =>
                            <>- {item}<br/></>
                        }</For>
                    </span>
                </Match>
                <Match when={state() === HoverState.Upper}>
                    <span><Trans key="applies-to"/><br/>
                        <For each={collectBotLabels(node(), subConcept())}>{(item) =>
                            <>- {item}<br/></>
                        }</For>
                    </span>
                </Match>
            </Switch>
        </>
    )
}
