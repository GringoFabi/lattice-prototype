const logToConsole = import.meta.env.VITE_LOG_TO_CONSOLE === 'true';
const persistLogs = import.meta.env.VITE_PERSIST_LOGS === 'true';
const localStorageLogs = import.meta.env.VITE_LOCAL_STORAGE_LOGS === 'true';
const localStorageLimit = parseInt(import.meta.env.VITE_LOCAL_STORAGE_LIMIT);

const logs = [];
const baseUrl = 'http://localhost:8000'

export function log(action, node) {
    if (logToConsole) {
        console.log(`User Action ${action} at node ${node?.node}`)
    }
    let log = {
        'action': action,
        'node': node,
        'time': Date.now()
    };
    logs.push(log);

    if (persistLogs) {
        saveSingleLog(log)
    }

    if (localStorageLogs) {
        writeLogToLocalStorage(log)
    }
}

function saveSingleLog(log) {
    (async () => {
        const rawResponse = await fetch(baseUrl + '/log', buildBody({log: log}));
        const content = await rawResponse;
        if (!content.ok) {
            console.error(new Error('Error persisting the log statement'), content);
        }
    })();
}

function writeLogToLocalStorage(log) {
    let persistedLogs = localStorage.getItem('logs');

    let localStorageLogs;
    if (!persistedLogs) {
        localStorageLogs = [log]
    } else {
        localStorageLogs = JSON.parse(persistedLogs);
        localStorageLogs.push(log);
    }

    if (localStorageLogs.length >= localStorageLimit && persistLogs) {
        saveLogs(localStorageLogs);
        return
    }

    const jsonString = JSON.stringify(localStorageLogs);
    localStorage.setItem('logs', jsonString);
}

function saveLogs(logs) {
    (async () => {
        const rawResponse = await fetch(baseUrl + '/logs', buildBody({logs: logs}));
        const content = await rawResponse;
        if (content.ok) {
            console.log('Persisting Local Storage Logs was successful, clearing up some space');
            localStorage.removeItem('logs');
        } else {
            console.error(new Error('Error persisting the Local Storage Logs'), content);
        }
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

