import {load_file} from '../lattice-library/main.js';
import {Trans} from '@mbarzda/solid-i18next';


const Dropzone = ({update}) => {
    return (
        <div className="drop-zone"
             onDrop={(event) => dropHandler(event, update)}
             onDragOver={(event) => dragOver(event)}>
            <p className="upload-prompt"><Trans key="drag-and-drop-intro"/>
                <span className="upload" onClick={(event) => startUpload(event, update)}>
                    <Trans key="here"/>
                </span>
                <Trans key="drag-and-drop-outro"/>
            </p>
        </div>
    )
}

function startUpload(ev, setFile) {
    ev.preventDefault();
    load_file(setFile);
}

function dragOver(ev) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}

function dropHandler(ev, setFile) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (!ev.dataTransfer.items) return;

    let item = null;
    [...ev.dataTransfer.items].forEach((i) => {
        if (i.type === 'application/json' && i.kind === "file") {
            item = i
        }
    })

    if (!item) {
        alert('No valid json file provided')
        return
    }

    const file = item.getAsFile();
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = event => {
        try {
            let json = JSON.parse(event.target.result);
            setFile(json);
        } catch (e) {
           console.error(e);
        }
    }
}

export default Dropzone;