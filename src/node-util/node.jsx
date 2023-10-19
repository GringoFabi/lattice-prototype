import {For} from 'solid-js';

export const HoverState = {
    Upper: 'Upper',
    Lower: 'Lower',
};


export function isAProperty(node) {
    return node.toplabel.length > 0 && node.botlabel.length === 0;
}

export function isAnEntity(node) {
    return node.toplabel.length === 0 && node.botlabel.length > 0;
}

export function isEntityWithProperty(node) {
    return node.toplabel.length > 0 && node.botlabel.length > 0;
}

export function getProperty(node) {
    return (<span>Property:&nbsp
        <For each={node.toplabel}>{(item, index) =>
            <>{index() < 1 ? '' : ', '}{item}</>}
        </For>
    </span>);
}

export function getEntity(node) {
    return (<span>Entity:&nbsp
        <For each={node.botlabel}>{(item, index) =>
            <>{index() < 1 ? '' : ', '}{item}</>}
        </For>
    </span>);
}