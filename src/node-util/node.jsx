import {For} from 'solid-js';
import {Trans} from '@mbarzda/solid-i18next';

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
    return (<span><Trans key="property-colum"/>
        <For each={node.toplabel}>{(item, index) =>
            <>{index() < 1 ? '' : ', '}{item}</>}
        </For>
    </span>);
}

export function getEntity(node) {
    return (<span><Trans key="entity-colum"/>
        <For each={node.botlabel}>{(item, index) =>
            <>{index() < 1 ? '' : ', '}{item}</>}
        </For>
    </span>);
}