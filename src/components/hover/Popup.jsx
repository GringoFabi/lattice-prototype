import {Show} from 'solid-js';
import {Portal} from 'solid-js/web';
import './popup.css';

const Popup = ({node}) => {

    return (
        <Show when={node()}>
            <Portal>
                <div className="popup" style={{
                    position: 'absolute',
                    top: `${node().coordinates.y}`,
                    left: `${node().coordinates.x}`
                }}>
                    <h3 style={{margin: 0}}>Node: {node().node.node}</h3>
                    <hr className="line"/>
                    <p>{node().coordinates.x}</p>
                    <p>{node().coordinates.y}</p>
                </div>
            </Portal>
        </Show>
    )
}

export default Popup