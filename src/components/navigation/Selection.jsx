import {createMemo, For, Show} from 'solid-js';
import {isAnEntity, isAProperty, isEntityWithProperty} from '../../node-util/node.jsx';
import {Trans} from '@mbarzda/solid-i18next';

const Selection = ({selection}) => {
    const categorize = createMemo(() => {
        const entities = [], properties = [];
        selection().forEach(value => {
            if (isAnEntity(value)) {
                entities.push(value.botlabel);
            }
            if (isAProperty(value)) {
                properties.push(value.toplabel);
            }
            if (isEntityWithProperty(value)) {
                entities.push(value.botlabel);
                properties.push(value.toplabel);
            }
        })

        return {entities: entities, properties: properties};
    });

    const entityLabel = createMemo(() => {
        return categorize().entities.length === 1 ? <Trans key="entity-colon"/> : <Trans key="entities-colon"/>;
    });

    const propertyLabel = createMemo(() => {
        return categorize().properties.length === 1 ? <Trans key="property-colon"/> : <Trans key="properties-colon"/>;
    });

    return (<>
        <hr/>
        <span><Trans key="selected-nodes"/>
            <For each={selection()}>{(item, index) =>
                <>{index() < 1 ? '' : ', '}{item.node}</>
            }</For>
        </span>

        <Show when={categorize().entities.length !== 0}>
            <span>{entityLabel()}
                <For each={categorize().entities}>{(item, index) =>
                    <>{index() < 1 ? '' : ', '}{item}</>
                }</For>
        </span>
        </Show>

        <Show when={categorize().properties.length !== 0}>
            <span>{propertyLabel()}
                <For each={categorize().properties}>{(item, index) =>
                    <>{index() < 1 ? '' : ', '}{item}</>
                }</For>
        </span>
        </Show>
    </>)
}
export default Selection