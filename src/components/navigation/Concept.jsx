import {For, Show} from 'solid-js';

const Concept = ({concept, labels, type, name}) => {
    return (<Show when={concept.length > 0}>
        <hr/>
        <span>{type}:&nbsp
            <For each={concept}>{(item, index) =>
                <>{index() < 1 ? '' : ', '}{item}</>
            }</For>
        </span>
        <Show when={labels.length > 0}>
            <span>{name}:&nbsp
            <For each={labels}>{(item, index) =>
                <>{index() < 1 ? '' : ', '}{item}</>
            }</For>
        </span>
        </Show>
    </Show>)
}

export default Concept