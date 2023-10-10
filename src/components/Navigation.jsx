import './navigation.css'
import {For} from "solid-js";

const Navigation = ({selection}) => {
    console.log(selection)
    return (
        <div className="card">
            <div className="column">
                <h3 style="margin: 1px">Navigation</h3>
                <hr style="width: 100%"></hr>
                <span>Selected Nodes</span>
                <For each={selection()}>{(item, index) => {
                    return (<>
                        {item.node}
                    </>)
                }
                }</For>
            </div>
        </div>
    )
}

export default Navigation