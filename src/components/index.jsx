import {render} from 'solid-js/web'
import './index.css'
import App from './App.jsx'
import {createSignal, Show, useContext} from 'solid-js';
import {TransProvider} from '@mbarzda/solid-i18next';
import {resources} from '../i18n/dict.js';
import {CoordinatesContext} from './tools/Settings.jsx';

const root = document.getElementById('root')

const [pos, setPos] = createSignal({x: 0, y: 0});

const [showCoordinates,] = useContext(CoordinatesContext);

const handleMouseMove = (event) => {
    const {clientX, clientY} = event;
    setPos({x: clientX, y: clientY});
}

render(() => (
    <TransProvider options={{resources}} lng="en">
        <div onMouseMove={(event) => handleMouseMove(event)}>
            <App/>
            <Show when={showCoordinates()}>
                <small className="position">[{pos().x}, {pos().y}]</small>
            </Show>
        </div>
    </TransProvider>
), root)
