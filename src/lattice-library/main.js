import {SVG} from "@svgdotjs/svg.js";
import {subset} from "./utility.js";

const style = getComputedStyle(document.body);

//Data Objects
let nodes = []
let positions = []
let edges = []

let toplabels = []
let botlabels = []

let xmax = 0
let ymax = 0

//SVG Objects
let edge_objects = []
let nodes_upper = []
let nodes_lower = []
let labels_upper = []
let labels_lower = []
let valuations = []
let valuations_objects = []

let width = 800
let height = 900

//Listener for Deselection
let draw = SVG()

//Variables for Node Selection

let selection = new Set()
let selection_type = ""
let selected_edges = new Set()
//Dragging Boundaries
let bounds = {}
let box;

function init(container, wrapper) {
    box = container
    wrapper.addEventListener("click", function (event) {
        //Checks if Click Landed on SVG Draw Object or on Background Box
        let elementFromPoint = document.elementFromPoint(event.clientX, event.clientY);
        let a = Object.is(elementFromPoint, draw['node']);
        let b = Object.is(elementFromPoint, container);
        if (a || b || elementFromPoint.localName === "svg") {
            reset_selection()
        }
    });

    let parent = wrapper.parentElement;
    console.log(parent.clientWidth, parent.clientHeight)
    debugger
    let wrapperWidth = wrapper.clientWidth;
    let wrapperHeight = wrapper.clientHeight;
    console.log(wrapperWidth, wrapperHeight)
    draw.addTo(container).size(wrapperWidth, wrapperHeight).viewbox(`-300 0 ${wrapperWidth + 50} ${wrapperHeight + 50}`)
        .panZoom({
            panning: true,
            wheelZoom: true,
            zoomMin: 0.5,
            zoomMax: 2,
            zoomFactor: 0.1,
            panButton: 1
        })
}

function nodeFromLattice(lattice, index) {
    let node = lattice[0][index]
    let position = lattice[1][index]
    let edges = collectEdges(node.toString())
    let toplabel = lattice[3][index]
    let botlabel = lattice[4][index]
    let valuation = lattice[5][index]
    return {node, position, edges, toplabel, botlabel, valuation}
}

function collectEdges(node) {
    let localEdges = []
    edges.forEach((edge) => {
        if (edge[0] === node || edge[1] === node) {
            localEdges.push(edge)
        }
    })
    return localEdges
}

export function load_file(setFile){
    let input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => {

        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsText(file,'UTF-8')
        reader.onload = readerEvent => {
            try{
                setFile(JSON.parse(readerEvent.target.result))
            }
            catch (e) {
                alert("Failure loading Context File:\n"+e)
            }
        }

    }

    input.click();
}

export function draw_lattice(file, container, wrapper) {
    init(container, wrapper)
    const lattice = readJSON(file)

    delete_all()

    nodes = lattice[0]
    positions = lattice[1]
    edges = lattice[2]

    toplabels = lattice[3]
    botlabels = lattice[4]
    valuations = lattice[5]

    xmax = lattice[6]
    ymax = lattice[7]

    //Draw Edges
    let buffer = 50

    for (let i = 0; i < edges.length; i++) {
        let source = edges[i][0]
        let target = edges[i][1]

        edge_objects[i] = draw.line(positions[source][0] * (width / (2.2 * xmax)) + width / 2, -(positions[source][1] * (height / (1.2 * ymax))) + height - buffer,
            positions[target][0] * (width / (2.2 * xmax)) + width / 2, -(positions[target][1] * (height / (1.2 * ymax))) + height - buffer)
            .stroke({width: 5, color: style.getPropertyValue('--default-black')})
            .attr('source', source)
            .attr('target', target)

    }
    //Draw Nodes and Labels
    for (let j = 0; j < nodes.length; j++) {

        labels_upper[j] = draw.text(String(toplabels[j]))
            .attr('name', (style.getPropertyValue('--label-upper-indicator') + String(j)))
            .move(positions[j][0] * (width / (2.2 * xmax)) + width / 2 + 20,
                -(positions[j][1] * (height / (1.2 * ymax))) - 60 - buffer + height)
            .font({fill: style.getPropertyValue('--intent-color'), size: 30, family: 'Arial'})
            .click(function () {
                handle_downwards(this)
            })

        labels_lower[j] = draw.text(String(botlabels[j]))
            .attr('name', (style.getPropertyValue('--label-lower-indicator') + String(j)))
            .move(positions[j][0] * (width / (2.2 * xmax)) + width / 2 + 20,
                -(positions[j][1] * (height / (1.2 * ymax))) + 10 - buffer + height)
            .font({fill: style.getPropertyValue('--extent-color'), size: 30, family: 'Arial'})
            .click(function () {
                handle_upwards(this)
            })

        valuations_objects[j] = draw.text(String(valuations[j]))
            .move(positions[j][0] * (width / (2.2 * xmax)) + width / 2 + 30,
                -(positions[j][1] * (height / (1.2 * ymax))) - 20 - buffer + height)
            .font({fill: style.getPropertyValue('--extent-color'), size: 30, family: 'Arial'})

        nodes_upper[j] = draw.path("M 0 0 L 25 0 A 1 1 0 0 0 -25 0 Z")
            .attr('name', j)
            .attr('drag', 0)
            .move(positions[j][0] * (width / (2.2 * xmax)) + width / 2 - 25
                , -(positions[j][1] * (height / (1.2 * ymax))) - 25 - buffer + height)
            .stroke({color: style.getPropertyValue('--default-black'), width: 4, linecap: 'round', linejoin: 'round'})
            .click(function () {
                handle_downwards(this)
            })
            .mousedown(function (e) {
                startDrag(e, this)
            })
            .mousemove(function (e) {
                Drag(e, this)
            })
            .mouseup(function (e) {
                endDrag(e, this)
            })
            .mouseover(function (e) {
                console.log(nodeFromLattice(lattice, j))
            })

        if (labels_upper[j].text() === "") {
            nodes_upper[j].fill(style.getPropertyValue('--clear'))
        } else {
            nodes_upper[j].fill(style.getPropertyValue('--intent-faint'))
        }


        nodes_lower[j] = draw.path("M 0 0 L -25 0 A 1 1 0 0 0 25 0 Z")
            .attr('name', j)
            .attr('drag', 0)
            .move(positions[j][0] * (width / (2.2 * xmax)) + width / 2 - 25
                , -(positions[j][1] * (height / (1.2 * ymax))) - buffer + height)
            .stroke({color: style.getPropertyValue('--default-black'), width: 4, linecap: 'round', linejoin: 'round'})
            .click(function () {
                handle_upwards(this)
            })
            .mousedown(function (e) {
                startDrag(e, this)
            })
            .mousemove(function (e) {
                Drag(e, this)
            })
            .mouseup(function (e) {
                endDrag(e, this)
            })

        if (labels_lower[j].text() === "") {
            nodes_lower[j].fill(style.getPropertyValue('--clear'))
        } else {
            nodes_lower[j].fill(style.getPropertyValue('--extent-faint'))
        }

    }
}

function readJSON(json) {
    //Read Nodes, Positions and Labels
    for (let i = 0; i < json.nodes.length; i++) {

        nodes[i] = i
        positions[i] = json.positions[i][i]
        toplabels[i] = Object.entries(json['shorthand-annotation'][i])[0][1][0]
        botlabels[i] = Object.entries(json['shorthand-annotation'][i])[0][1][1]
        valuations[i] = json.valuations[i][i]

        if (json.positions[i][i][0] > xmax) {
            xmax = json.positions[i][i][0]
        }
        if (json.positions[i][i][1] > ymax) {
            ymax = json.positions[i][i][1]
        }
    }
    //Read Edges
    for (let k = 0; k < json.edges.length; k++) {


        for (let l = 0; l < Object.entries(json.edges[k])[0][1].length; l++) {

            edges.push([Object.entries(json.edges[k])[0][0],
                Object.entries(json.edges[k])[0][1][l]])
        }
    }

    return [nodes, positions, edges, toplabels, botlabels, valuations, xmax, ymax]
}

function startDrag(e, node) {

    //Only Add Node to Selection, if other Half is not Already Present
    let name = node.attr('name')
    if (!(selection.has(nodes_upper[name]) || selection.has(nodes_lower[name]))) {
        selection.add(node)
    }
    highlight_selection(selection)
    //Find Affected Edges and Compute Boundaries for all Selected Nodes
    //Edges Run from Lower to Higher Numbers/Nodes
    selection.forEach(element => {
        let name = element.attr('name')

        let maxY = Infinity
        let minY = 0
        for (let i = 0; i < edge_objects.length; i++) {

            if (edge_objects[i].attr('source') === name) {
                selected_edges.add(edge_objects[i])
                if (nodes_upper[edge_objects[i].attr('target')]['_array'][0][2] > minY) {
                    minY = nodes_upper[edge_objects[i].attr('target')]['_array'][0][2]
                }
            }
            if (edge_objects[i].attr('target') === name) {
                selected_edges.add(edge_objects[i])
                if (nodes_upper[edge_objects[i].attr('source')]['_array'][0][2] < maxY) {
                    maxY = nodes_upper[edge_objects[i].attr('source')]['_array'][0][2]
                }
            }
        }
        bounds[name] = [minY, maxY]
    })

    //Reset Drag Flag for all other Nodes
    for (let j = 0; j < nodes_upper.length; j++) {

        if (nodes_upper[j].attr('source') !== name) {
            nodes_upper[j].attr('drag', 0)
            nodes_lower[j].attr('drag', 0)
        }
    }

    //Set Drag Flag
    nodes_upper[node.attr('name')].attr('drag', 1)
    nodes_lower[node.attr('name')].attr('drag', 1)

}

function Drag(e, node) {

    if (node.attr('drag') === 1) {

        let p = draw.point(e.clientX, e.clientY)
        let cursorX = p.x
        let cursorY = p.y

        selection.forEach(element => {

            if (!(element.attr('name') === node.attr('name'))) {
                redrawNode(element, node, cursorX, cursorY, bounds, selected_edges)
            }
        })
        redrawNode(node, node, cursorX, cursorY, bounds, selected_edges)
    }
}

function endDrag(e, node) {
    let name = node.attr('name')
    //Reset Drag Flag
    nodes_upper[name].attr('drag', 0)
    nodes_lower[name].attr('drag', 0)
    selected_edges.clear()
    bounds = {}
}

function redrawNode(current_node, dragged_node, cursorX, cursorY, bounds, selected_edges) {


    let name = current_node.attr('name')

    //Static Offset
    const node_offsetX = -30
    const node_offsetY = 0


    //Distance to Selected Node
    let distX = current_node['_array'][0][1] - dragged_node['_array'][0][1]
    let distY = current_node['_array'][0][2] - dragged_node['_array'][0][2]

    let posX = cursorX + node_offsetX + distX
    let posY = cursorY + node_offsetY + distY

    //Account for Boundaries
    if (posY < bounds[name][0]) {
        posY = bounds[name][0]
    }
    if (posY > bounds[name][1]) {
        posY = bounds[name][1]
    }

    nodes_upper[name].move(posX, posY - 25)
    nodes_lower[name].move(posX, posY)

    labels_upper[name].move(posX + 43, posY - 50)
    labels_lower[name].move(posX + 43, posY + 20)
    valuations_objects[name].move(posX + 53, posY - 15)

    //Readraw Affected Edges
    selected_edges.forEach(element => {

        if (element.attr('source') === name) {
            element.attr('x1', posX + 25)
            element.attr('y1', posY)
        }
        if (element.attr('target') === name) {
            element.attr('x2', posX + 25)
            element.attr('y2', posY)
        }
    })
}

function handle_upwards(node) {
    reset_marking()
    if (selection_type === style.getPropertyValue('--attribute')) {
        reset_selection()
    }
    selection_type = style.getPropertyValue('--object')
    //Only Add Node to Selection, if other Half is not Already Present

    //Retrieve Corresponding Nodes if Label was Selected
    let name = String(node.attr('name'))
    if (name.includes(style.getPropertyValue('--label-lower-indicator'))) {
        node = nodes_lower[name.replace(style.getPropertyValue('--label-lower-indicator'), '')]
    }
    if (name.includes(style.getPropertyValue('--label-upper-indicator'))) {
        node = nodes_upper[name.replace(style.getPropertyValue('--label-upper-indicator'), '')]
    }

    //Check if Other Half is Alredy Present
    if (!selection.has(nodes_upper[name])) {
        selection.add(node)
    }
    grey_out()
    if (selection.size > 1) {
        find_sup(node)
    } else {
        mark_upper(node)
    }
    highlight_selection(selection)
}

function handle_downwards(node) {
    reset_marking()
    if (selection_type === style.getPropertyValue('--object')) {
        reset_selection()
    }
    selection_type = style.getPropertyValue('--attribute')
    //Only Add Node to Selection, if other Half is not Already Present


    //Retrieve Corresponding Nodes if Label was Selected
    let name = String(node.attr('name'))
    if (name.includes(style.getPropertyValue('--label-lower-indicator'))) {
        node = nodes_lower[name.replace(style.getPropertyValue('--label-lower-indicator'), '')]
    }
    if (name.includes(style.getPropertyValue('--label-upper-indicator'))) {
        node = nodes_upper[name.replace(style.getPropertyValue('--label-upper-indicator'), '')]
    }

    //Check if Other Half is Alredy Present
    if (!selection.has(nodes_lower[name])) {
        selection.add(node)
    }
    grey_out()
    if (selection.size > 1) {
        find_inf(node)
    } else {
        mark_lower(node)
    }
    highlight_selection(selection)
}

function mark_upper(node) {

    let name = node.attr("name")
    if (nodes_upper[name].attr('fill') === style.getPropertyValue('--greyed-out')) {
        nodes_upper[name].fill(style.getPropertyValue('--intent-color'))
    }
    labels_upper[name].font({weight: 'bold', fill: style.getPropertyValue('--intent-color')})
    nodes_lower[name].stroke({color: style.getPropertyValue('--default-black')})
    nodes_upper[name].stroke({color: style.getPropertyValue('--default-black')})

    //Find and Mark all Edges to Greater Nodes
    //Mark Appropriate Node Halves
    let super_concepts = new Set()
    super_concepts.add(String(name))
    let changed = true
    while (changed === true) {
        changed = false
        for (let i = 0; i < edges.length; i++) {

            if (super_concepts.has(String(edges[i][0])) && edge_objects[i].stroke() === style.getPropertyValue('--greyed-out')) {

                edge_objects[i].stroke({color: style.getPropertyValue('--intent-color'), width: 8})
                changed = true
                super_concepts.add(edges[i][1])
                nodes_lower[edges[i][1]].stroke({color: style.getPropertyValue('--default-black')})
                nodes_upper[edges[i][1]].stroke({color: style.getPropertyValue('--default-black')})
                labels_upper[edges[i][1]].font({weight: 'bold', fill: style.getPropertyValue('--intent-color')})

                if (nodes_upper[edges[i][1]].attr('fill') === style.getPropertyValue('--greyed-out')) {
                    nodes_upper[edges[i][1]].fill(style.getPropertyValue('--intent-color'))
                }
            }
        }
    }
}

function mark_lower(node) {

    let name = node.attr("name")
    if (nodes_lower[name].attr('fill') === style.getPropertyValue('--greyed-out')) {
        nodes_lower[name].fill(style.getPropertyValue('--extent-color'))
    }
    labels_lower[name].font({weight: 'bold', fill: style.getPropertyValue('--extent-color')})
    nodes_lower[name].stroke({color: style.getPropertyValue('--default-black')})
    nodes_upper[name].stroke({color: style.getPropertyValue('--default-black')})

    //Find and Mark all Edges to Smaller Nodes
    //Mark Appropriate Node Halves
    let sub_concepts = new Set()
    sub_concepts.add(String(name))
    let changed = true
    while (changed === true) {
        changed = false
        for (let i = 0; i < edges.length; i++) {

            if (sub_concepts.has(String(edges[i][1])) && edge_objects[i].stroke() === style.getPropertyValue('--greyed-out')) {

                edge_objects[i].stroke({color: style.getPropertyValue('--extent-color'), width: 8})
                changed = true
                sub_concepts.add(edges[i][0])
                nodes_lower[edges[i][0]].stroke({color: style.getPropertyValue('--default-black')})
                nodes_upper[edges[i][0]].stroke({color: style.getPropertyValue('--default-black')})
                labels_lower[edges[i][1]].font({weight: 'bold', fill: style.getPropertyValue('--extent-color')})

                if (nodes_lower[edges[i][1]].attr('fill') === style.getPropertyValue('--greyed-out')) {
                    nodes_lower[edges[i][1]].fill(style.getPropertyValue('--extent-color'))
                }
            }
        }
    }
}

function find_sup(node) {

    let super_concepts = new Set()
    super_concepts.add(node)
    let supremum

    //Find all Greater Reachable Nodes
    let changed = true
    while (changed === true) {
        changed = false
        for (let i = 0; i < edges.length; i++) {

            if (super_concepts.has(nodes_lower[edges[i][0]])) {

                if (!super_concepts.has(nodes_lower[edges[i][1]])) {
                    super_concepts.add(nodes_lower[edges[i][1]])
                    changed = true
                }
            }
        }
    }

    //Search in Opposite Direction
    super_concepts.forEach(element => {
        let reachable = new Set()
        reachable.add(element)

        let changed2 = true
        while (changed2 === true) {
            changed2 = false
            for (let j = 0; j < edges.length; j++) {

                if (reachable.has(nodes_lower[edges[j][1]])) {

                    if (!reachable.has(nodes_lower[edges[j][0]])) {
                        reachable.add(nodes_upper[edges[j][0]])
                        reachable.add(nodes_lower[edges[j][0]])
                        changed2 = true
                    }
                }
            }
        }
        //If all Selected Nodes are Contained within the Reachable Nodes, the Starting Node is a Potential Supremum
        if (subset(reachable, selection)) {
            //Update Supremum, if a Smaller Candidate has been Found
            if (supremum === undefined || element.attr("name") < supremum.attr("name")) {
                supremum = element
            }
        }
    })
    mark_upper(supremum)
}

function find_inf(node) {

    let sub_concepts = new Set()
    sub_concepts.add(node)
    let infimum

    //Find all Smaller Reachable Nodes
    let changed = true
    while (changed === true) {
        changed = false
        for (let i = 0; i < edges.length; i++) {

            if (sub_concepts.has(nodes_upper[edges[i][1]])) {

                if (!sub_concepts.has(nodes_upper[edges[i][0]])) {
                    sub_concepts.add(nodes_upper[edges[i][0]])
                    changed = true
                }
            }
        }
    }

    //Search in Opposite Direction
    sub_concepts.forEach(element => {
        let reachable = new Set()
        reachable.add(element)
        let changed2 = true
        while (changed2 === true) {
            changed2 = false
            for (let j = 0; j < edges.length; j++) {

                if (reachable.has(nodes_upper[edges[j][0]])) {

                    if (!reachable.has(nodes_upper[edges[j][1]])) {
                        reachable.add(nodes_upper[edges[j][1]])
                        reachable.add(nodes_lower[edges[j][1]])
                        changed2 = true
                    }
                }
            }
        }
        //If all Selected Nodes are Contained within the Reachable Nodes, the Starting Node is a Potential Infimum
        if (subset(reachable, selection)) {
            if (infimum === undefined || element.attr("name") > infimum.attr("name")) {
                infimum = element
            }
        }
    })
    mark_lower(infimum)
}

function reset_marking() {

    for (let i = 0; i < nodes_upper.length; i++) {
        nodes_upper[i].stroke({color: style.getPropertyValue('--default-black')})
        nodes_lower[i].stroke({color: style.getPropertyValue('--default-black')})
        labels_upper[i].font({weight: 'regular', fill: style.getPropertyValue('--intent-color')})
        labels_lower[i].font({weight: 'regular', fill: style.getPropertyValue('--extent-color')})
        if (nodes_upper[i].attr('fill') === style.getPropertyValue('--intent-color') ||
            nodes_upper[i].attr('fill') === style.getPropertyValue('--greyed-out')) {
            nodes_upper[i].fill(style.getPropertyValue('--intent-faint'))
        }
        if (nodes_lower[i].attr('fill') === style.getPropertyValue('--extent-color') ||
            nodes_lower[i].attr('fill') === style.getPropertyValue('--greyed-out')) {
            nodes_lower[i].fill(style.getPropertyValue('--extent-faint'))
        }
    }
    for (let j = 0; j < edge_objects.length; j++) {
        edge_objects[j].stroke({color: style.getPropertyValue('--default-black'), width: 5})
    }

}

function reset_selection() {
    selection.clear()
    reset_marking()
}

function highlight_selection(selection) {

    selection.forEach(node => {
        let name = node.attr("name")
        nodes_upper[name].stroke({color: style.getPropertyValue('--highlight-color')})
        nodes_lower[name].stroke({color: style.getPropertyValue('--highlight-color')})

        if (selection_type === style.getPropertyValue('--attribute')) {
            labels_upper[name].font({weight: 'bold', fill: style.getPropertyValue('--intent-color')})
        }
        if (selection_type === style.getPropertyValue('--object')) {
            labels_lower[name].font({weight: 'bold', fill: style.getPropertyValue('--extent-color')})
        }
    })

}

function grey_out() {

    for (let i = 0; i < nodes_upper.length; i++) {
        nodes_upper[i].stroke({color: style.getPropertyValue('--greyed-out')})
        nodes_lower[i].stroke({color: style.getPropertyValue('--greyed-out')})
        labels_upper[i].font({weight: 'regular', fill: style.getPropertyValue('--greyed-out')})
        labels_lower[i].font({weight: 'regular', fill: style.getPropertyValue('--greyed-out')})
        if (nodes_upper[i].attr('fill') === style.getPropertyValue('--intent-faint') ||
            nodes_upper[i].attr('fill') === style.getPropertyValue('--extent-faint')) {
            nodes_upper[i].fill(style.getPropertyValue('--greyed-out'))
        }
        if (nodes_lower[i].attr('fill') === style.getPropertyValue('--intent-faint') ||
            nodes_lower[i].attr('fill') === style.getPropertyValue('--extent-faint')) {
            nodes_lower[i].fill(style.getPropertyValue('--greyed-out'))
        }
    }
    for (let j = 0; j < edge_objects.length; j++) {
        edge_objects[j].stroke({color: style.getPropertyValue('--greyed-out'), width: 5})
    }

}

function delete_all() {
    reset_selection()
    nodes = []
    positions = []
    edges = []

    toplabels = []
    botlabels = []

    xmax = 0
    ymax = 0

    edge_objects = []
    nodes_upper = []
    nodes_lower = []
    labels_upper = []
    labels_lower = []
    valuations = []
    valuations_objects = []
    draw.each(function(i, children) {
        this.remove()
      }, true)

}
