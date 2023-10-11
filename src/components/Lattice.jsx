import {SVG} from '@svgdotjs/svg.js';
import '@svgdotjs/svg.panzoom.js'
import {createEffect, createMemo, onMount} from 'solid-js';
import {draw_lattice} from '../lattice-library/main.js';
import './Lattice.css'

const Lattice = ({file}) => {
    const svgContainer = createMemo(() => SVG(), []);
    let svgWrapper;

    onMount(() => draw_lattice(file, svgContainer(), svgWrapper))
    createEffect(() => svgContainer().addTo(svgWrapper))

    return (
        <div className="box" ref={ref => svgWrapper = ref}></div>
    )
}

export default Lattice;