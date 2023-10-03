import './App.css'
import graph from './assets/graph.svg'

function App() {
    return (
        <>
            <div className="drop-zone"
                 onDrop={(event) => dropHandler(event)}
                 onDragOver={(event) => dragOver(event)}
            >
                <p className="upload-prompt">Drag and drop a json file or click&nbsp
                    <span className="upload" onClick={(event) => startUpload(event)}>here</span>
                    , to start the
                    upload.</p>
                <img src={graph} className="back-ground" alt="background"/>
            </div>
        </>
    )
}

function startUpload(ev) {
    console.log(ev)
}

function dragOver(ev) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}

function dropHandler(ev) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (!ev.dataTransfer.items) {
        return;
    }

    // Currently, we only care for one file at the time, therefore return here
    if (ev.dataTransfer.items.length !== 1) {
        alert("Please, do not drop more then 1 file at the time");
        return;
    }

    // Use DataTransferItemList interface to access the file(s)
    const item = ev.dataTransfer.items[0];

    // If dropped items aren't files, reject them
    if (!isJsonFile(item)) {
        return;
    }

    const file = item.getAsFile();
    console.log(`${file.name}`);
}

function isJsonFile(item) {
    return item && item.type === 'application/json' && item.kind === "file";
}

export default App
