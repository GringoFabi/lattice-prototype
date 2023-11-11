import {SVG} from '@svgdotjs/svg.js';
import '@svgdotjs/svg.panzoom.js'
import {createEffect, createMemo, createRenderEffect, onMount} from 'solid-js';
import {draw_lattice, updateColors} from '../lattice-library/main.js';
import './Lattice.css'

const Lattice = ({file, colors}) => {
    const svgContainer = createMemo(() => SVG(), []);
    let svgWrapper;

    onMount(() => draw_lattice(file, svgContainer(), svgWrapper, colors))
    createEffect(() => svgContainer().addTo(svgWrapper))

    createRenderEffect(() => updateColors(colors()))

    return (
        <div className="box" ref={ref => svgWrapper = ref}></div>
    )
}

export default Lattice;