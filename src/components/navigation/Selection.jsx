import {For, Match, Switch} from 'solid-js';


const Selection = ({selection}) => {
    return (<>
        <hr style="width: 100%"></hr>
        <span>Selected Nodes:&nbsp
            <For each={selection()}>{(item, index) => <>{index() < 1 ? '' : ', '}{item.node}</>}
            </For>
        </span>
        <Switch>
            <Match when={isAnEntityWithProperty(selection())}>
                {getEntity(selection())}
                {getProperty(selection())}
            </Match>
            <Match when={isAProperty(selection())}>
                {getProperty(selection())}
            </Match>
            <Match when={isAnEntity(selection())}>
                {getEntity(selection())}
            </Match>
        </Switch>
    </>)
}

function getProperty(selection) {
    return (<span>Property:&nbsp
        <For each={selection[0].toplabel}>{(item, index) =>
            <>{index() < 1 ? '' : ', '}{item}</>}
        </For>
    </span>);
}

function getEntity(selection) {
    return (<span>Entity:&nbsp
        <For each={selection[0].botlabel}>{(item, index) =>
            <>{index() < 1 ? '' : ', '}{item}</>}
        </For>
    </span>);
}

function isAnEntityWithProperty(selection) {
    if (selection.length > 1) {
        return false;
    }

    const node = selection[0];
    return node.toplabel.length > 0 && node.botlabel.length > 0;
}

function isAProperty(selection) {
    if (selection.length > 1) {
        return false;
    }

    const node = selection[0];
    return node.toplabel.length > 0 && node.botlabel.length === 0;
}

function isAnEntity(selection) {
    if (selection.length > 1) {
        return false;
    }

    const node = selection[0];
    return node.botlabel.length > 0 && node.toplabel.length === 0;
}

export default Selection