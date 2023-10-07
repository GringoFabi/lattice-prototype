const logs = [];
const persistLogs = true;
const baseUrl = 'http://localhost:8000'

export function log(action, node) {
    console.log(`User Action ${action} at node ${node?.node}`)
    let log = {
        'action': action,
        'node': node,
        'time': Date.now()
    };
    logs.push(log);

    if (persistLogs) {
        saveSingeLog(log)
    }
}

export function printLogs() {
    console.log(logs);
}

function saveSingeLog(log) {
    (async () => {
        const rawResponse = await fetch(baseUrl + '/log', buildBody({log: log}));
        await handleResponse(rawResponse);
    })();
}

export function saveLogs() {
    (async () => {
        const rawResponse = await fetch(baseUrl + '/logs', buildBody({logs: logs}));
        await handleResponse(rawResponse);
    })();
}

function buildBody(payload) {
    return {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    };
}

async function handleResponse(rawResponse) {
    const content = await rawResponse;
    if (content.ok) {
        console.log('Persisted log statement in backend', content);
    } else {
        console.error(new Error('Error persisting the log statement'), content);
    }
}
