import {createMemo, For, Match, Show, Switch} from 'solid-js';
import {Portal} from 'solid-js/web';
import './popup.css';
import {
    getEntity,
    getProperty,
    isAnEntity,
    isAProperty,
    isEmptyNode,
    isEntityWithProperty
} from '../../node-util/node.jsx';
import {nodeFromLattice} from '../../lattice-library/main.js';

const constraintNode = "Constraint Node";

const Popup = ({node, superConcept, subConcept, state}) => {
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
                    <h3 style={{margin: 0}}>
                        {state()}<br/>
                        <Switch fallback={<span>Constraint Node</span>}>
                            <Match when={isAProperty(getNode())}>
                                {getProperty(getNode())}
                            </Match>
                            <Match when={isAnEntity(getNode())}>
                                {getEntity(getNode())}
                            </Match>
                            <Match when={isEntityWithProperty(getNode())}>
                                {getEntity(getNode())}<br/>
                                {getProperty(getNode())}
                            </Match>
                            <Match when={isEmptyNode(getNode())}>
                                {constraintNode}
                            </Match>
                        </Switch>
                    </h3>

                    <hr className="line"/>
                    {/*<p>{coordinates().x}</p>*/}
                    {/*<p>{coordinates().y}</p>*/}
                    {/*{ShowSuperConcept(superConcept, getNode)}*/}
                </div>
            </Portal>
        </Show>
    )
}

const ShowSuperConcept = (superConcept, getNode) => {
    const skipReflexiveConcept = createMemo(() => {
        // console.log(superConcept().slice(1))
        return superConcept().slice(1);
    });

    const collectTopLabels = createMemo(() => {
        let topLabels = [];
        skipReflexiveConcept().forEach(item => {
            let node = nodeFromLattice(item);
            // topLabels.push(node.toplabel)
            if (isAProperty(getNode())) {
                topLabels.push(node.toplabel)
            }
        })
        console.log(topLabels)
        return topLabels
    })

    return (
        <Show when={superConcept()}>
            <span>has properties:</span>
            <For each={collectTopLabels()}>{(item) => {
                // console.log(collectTopLabels())
                return <p style="margin: 0">- {item}</p>}}
            </For>
        </Show>
    );
}

export default Popup