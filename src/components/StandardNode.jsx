import {SVG} from "@svgdotjs/svg.js";
import {createEffect, createMemo, onMount} from "solid-js";
import './standard-node.css'

const style = getComputedStyle(document.body);

const StandardNode = () => {
    const svgContainer = createMemo(() => SVG(), []);
    let svgWrapper;
    onMount(() => {
        const draw = SVG().addTo(svgContainer()).size(200, 200).viewbox(`0 -10 200 200`)

        draw.text(String("Property"))
            .attr('name', (style.getPropertyValue('--label-upper-indicator') + "Property"))
            .move(10, -10)
            .font({fill: style.getPropertyValue('--intent-faint'), size: 20, family: 'Arial'})

        draw.text(String("Article"))
            .attr('name', (style.getPropertyValue('--label-lower-indicator') + "Article"))
            .move(15,80)
            .font({fill: style.getPropertyValue('--extent-color'), size: 20, family: 'Arial'})

        draw.text(String("00"))
            .move(75, 50)
            .font({fill: style.getPropertyValue('--extent-color'), size: 20, family: 'Arial'})

        draw.path("M 0 0 L 25 0 A 1 1 0 0 0 -25 0 Z")
            .attr('name', "Property")
            .attr('drag', 0)
            .move(20, 20)
            .stroke({color: style.getPropertyValue('--default-black'), width: 3, linecap: 'round', linejoin: 'round'})
            .fill(style.getPropertyValue('--intent-faint'))

        draw.path("M 0 0 L -25 0 A 1 1 0 0 0 25 0 Z")
            .attr('name', "Article")
            .attr('drag', 0)
            .move(20, 45)
            .stroke({color: style.getPropertyValue('--default-black'), width: 3, linecap: 'round', linejoin: 'round'})
            .fill(style.getPropertyValue('--extent-faint'))
    })

    createEffect(() => svgContainer().addTo(svgWrapper))

    return (
        <div className="standard-node" ref={ref => svgWrapper = ref}></div>
    )
}

export default StandardNode