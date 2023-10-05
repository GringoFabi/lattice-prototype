import {createEffect, createMemo, onMount} from "solid-js";
import {SVG} from "@svgdotjs/svg.js";


function Legend() {
    const svgContainer = createMemo(() => SVG(), []);
    // svgContainer().add(SVG().rect(100, 100).fill("#123456"))

    let svgWrapper;

    onMount(() => drawNode(svgContainer(), svgWrapper))

    createEffect(() => svgContainer().addTo(svgWrapper))


    return (
        <div>
            <h1>Legend</h1>
            <line></line>
            <p>Hover with your cursor on top of a node to display more information</p>
            <div className="box" ref={ref => svgWrapper = ref}></div>
        </div>
    )
}

function drawNode(container, wrapper) {
    const style = getComputedStyle(document.body);
    let draw = SVG().addTo(container).size(100, 100).viewbox(`0 0 100 100`)

    draw.text(String("Property"))
        .attr('name', (style.getPropertyValue('--label-upper-indicator') + "Property"))
        .move(0, 10)
        .font({fill: style.getPropertyValue('--intent-color'), size: 30, family: 'Arial'})

    draw.text(String("Article"))
        .attr('name', (style.getPropertyValue('--label-lower-indicator') + "Article"))
        .move(0,-10)
        .font({fill: style.getPropertyValue('--extent-color'), size: 30, family: 'Arial'})

    draw.text(String("00"))
        .move(10, -5)
        .font({fill: style.getPropertyValue('--default-black'), size: 30, family: 'Arial'})

    draw.path("M 0 0 L 25 0 A 1 1 0 0 0 -25 0 Z")
        .attr('name', "Property")
        .attr('drag', 0)
        .move(20, 20)
        .stroke({color: style.getPropertyValue('--default-black'), width: 4, linecap: 'round', linejoin: 'round'})

    draw.path("M 0 0 L -25 0 A 1 1 0 0 0 25 0 Z")
        .attr('name', "Article")
        .attr('drag', 0)
        .move(20, 48)
        .stroke({color: style.getPropertyValue('--default-black'), width: 4, linecap: 'round', linejoin: 'round'})
}

export default Legend