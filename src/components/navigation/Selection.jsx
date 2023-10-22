import {For, Match, Switch} from 'solid-js';
import {getEntity, getProperty, isAnEntity, isAProperty, isEntityWithProperty} from '../../node-util/node.jsx';

const Selection = ({selection}) => {
    return (<>
        <hr style="width: 100%"></hr>
        <span>Selected Nodes:&nbsp
            <For each={selection()}>{(item, index) =>
                <>{index() < 1 ? '' : ', '}{item.node}</>
            }</For>
        </span>
        <Switch>
            <Match when={isAnEntityWithProperty(selection())}>
                {getEntity(selection()[0])}
                {getProperty(selection()[0])}
            </Match>
            <Match when={isOnlyAProperty(selection())}>
                {getProperty(selection()[0])}
            </Match>
            <Match when={isOnlyAnEntity(selection())}>
                {getEntity(selection()[0])}
            </Match>
        </Switch>
    </>)
}

function isAnEntityWithProperty(selection) {
    if (selection.length > 1) {
        return false;
    }

    return isEntityWithProperty(selection[0]);
}

function isOnlyAProperty(selection) {
    if (selection.length > 1) {
        return false;
    }

    return isAProperty(selection[0]);
}

function isOnlyAnEntity(selection) {
    if (selection.length > 1) {
        return false;
    }

    return isAnEntity(selection[0]);
}



export default Selection