import {render} from 'solid-js/web'
import './index.css'
import App from './App.jsx'
import {createSignal} from 'solid-js';

const root = document.getElementById('root')

const [pos, setPos] = createSignal({x: 0, y: 0});

const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    setPos({ x: clientX, y: clientY });
}

render(() => <div onMouseMove={handleMouseMove}>
    <App/>
    <small className="position">[{pos().x}, {pos().y}]</small>
</div>, root)
