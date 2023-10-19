import {createMemo, Match, Show, Switch} from 'solid-js';
import {Portal} from 'solid-js/web';
import './popup.css';
import {isAnEntity, isAProperty, isEntityWithProperty} from '../../node-util/node.jsx';
import {ComboPopup} from './ComboPopup.jsx';
import {EntityPopup} from './EntityPopup.jsx';
import {PropertyPopup} from './PropertyPopup.jsx';

export const constraintNode = 'Constraint Node';

export const Popup = ({node, superConcept, subConcept, state}) => {
    const getNode = createMemo(() => node() ? node().node : null)
    const coordinates = createMemo(() => node() ? node().coordinates : null)

    return (
        <Show when={node()}>
            <Portal>
                <div className="popup" style={{
                    position: 'absolute',
                    top: `${coordinates().y}`,
                    left: `${coordinates().x}`
                }}>
                    <Switch fallback={<span>{constraintNode}</span>}>
                        <Match when={isAProperty(getNode())}>
                            <PropertyPopup node={getNode} state={state} superConcept={superConcept} subConcept={subConcept}/>
                        </Match>
                        <Match when={isAnEntity(getNode())}>
                            <EntityPopup node={getNode} state={state} superConcept={superConcept} subConcept={subConcept}/>
                        </Match>
                        <Match when={isEntityWithProperty(getNode())}>
                            <ComboPopup node={getNode} state={state} superConcept={superConcept} subConcept={subConcept}/>
                        </Match>
                    </Switch>
                </div>
            </Portal>
        </Show>
    )
}
