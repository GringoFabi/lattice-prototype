import {createMemo, Match, Show, Switch} from 'solid-js';
import {Portal} from 'solid-js/web';
import './popup.css';
import {getEntity, getProperty, isAnEntity, isAProperty, isEntityWithProperty} from "../navigation/Selection.jsx";

const Popup = ({node}) => {
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
                        <Switch>
                            <Match when={isAProperty(getNode())}>
                                {getProperty(getNode())}
                            </Match>
                            <Match when={isAnEntity(getNode()) || isEntityWithProperty(getNode())}>
                                {getEntity(getNode())}
                            </Match>
                        </Switch>
                    </h3>

                    <hr className="line"/>
                    <p>{coordinates().x}</p>
                    <p>{coordinates().y}</p>
                </div>
            </Portal>
        </Show>
    )
}

export default Popup