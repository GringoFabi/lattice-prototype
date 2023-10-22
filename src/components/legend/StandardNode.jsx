import {SVG} from '@svgdotjs/svg.js';
import {createEffect, createMemo, onMount} from 'solid-js';
import './standard-node.css'

const style = getComputedStyle(document.body);
const textSize = 16;

const StandardNode = () => {
    const svgContainer = createMemo(() => SVG().id("svg-container"), []);
    let svgWrapper;
    onMount(() => {
        svgContainer().text(String('Property'))
            .attr('name', (style.getPropertyValue('--label-upper-indicator') + 'Property'))
            .move(0, 0)
            .font({fill: style.getPropertyValue('--intent-faint'), size: textSize, family: 'Arial'})

        svgContainer().text(String('Article'))
            .attr('name', (style.getPropertyValue('--label-lower-indicator') + 'Article'))
            .move(10, 60)
            .font({fill: style.getPropertyValue('--extent-color'), size: textSize, family: 'Arial'})

        svgContainer().text(String('00'))
            .move(55, 30)
            .font({fill: style.getPropertyValue('--extent-color'), size: textSize, family: 'Arial'})

        svgContainer().path('M 0 0 L 20 0 A 1 1 0 0 0 -20 0 Z')
            .attr('name', 'Property')
            .attr('drag', 0)
            .move(10, 20)
            .stroke({color: style.getPropertyValue('--default-black'), width: 3, linecap: 'round', linejoin: 'round'})
            .fill(style.getPropertyValue('--intent-faint'))

        svgContainer().path('M 0 0 L -20 0 A 1 1 0 0 0 20 0 Z')
            .attr('name', 'Article')
            .attr('drag', 0)
            .move(10, 40)
            .stroke({color: style.getPropertyValue('--default-black'), width: 3, linecap: 'round', linejoin: 'round'})
            .fill(style.getPropertyValue('--extent-faint'))
    })

    createEffect(() => svgContainer().addTo(svgWrapper))

    return (
        <div className="standard-node" ref={ref => svgWrapper = ref}></div>
    )
}

export default StandardNode