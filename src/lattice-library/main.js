import '@svgdotjs/svg.draggable.js'
import {subset} from './utility.js';
import {log} from './logging.js';
import {Action} from './action.js';
import {HoverState} from '../node-util/node.jsx';

const style = getComputedStyle(document.body);
const popupXOffset = 50;
const popupYOffset = 50;

//Data Objects
let lattice = []
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
let draw;
let currentColors;

//Variables for Node Selection
let selection = new Set()
let selection_type = ""
let selected_edges = new Set()
let selectionData = []

//Dragging Boundaries
let bounds = {}
let updateSelection = () => {};
let updateSuperConcept = () => {};
let updateSubConcept = () => {};
let updateHoverNode = () => {};
let updateHoverSuperConcept = () => {};
let updateHoverSubConcept = () => {};
let updateHoverState = () => {};
export function bindSelectionUpdates(setSelection, setSuperConcept, setSubConcept, setHoverNode, setHoverSuperConcept, setHoverSubConcept, setHoverState) {
    updateSelection = setSelection
    updateSuperConcept = setSuperConcept
    updateSubConcept = setSubConcept
    updateHoverNode = setHoverNode
    updateHoverSuperConcept = setHoverSuperConcept
    updateHoverSubConcept = setHoverSubConcept
    updateHoverState = setHoverState
}

Array.prototype.addIfUnique = function (item) {
    if (!this.includes(item)) {
        this.push(item)
    }
}

Set.prototype.addToSession = function (node, data) {
    selection.add(node)
    selectionData.addIfUnique(data)
    updateSelection([...selectionData])
}

Set.prototype.clearSession = function () {
    selection.clear()
    selectionData = []
    updateSelection(selectionData)
    updateSubConcept(null)
    updateSuperConcept(null)
}

function init(container, wrapper) {
    draw = container;
    wrapper.addEventListener("click", function (event) {
        //Checks if Click Landed on SVG Draw Object or on Background Box
        let elementFromPoint = document.elementFromPoint(event.clientX, event.clientY);
        let a = Object.is(elementFromPoint, draw['node']);
        let b = Object.is(elementFromPoint, container);
        if (a || b || elementFromPoint.localName === "svg") {
            if (selection.size !== 0) {
                log(Action.ClearSelection, null)
                reset_selection()
            }
        }
    });

    let {clientWidth, clientHeight} = wrapper;
    draw.size(clientWidth, clientHeight).viewbox(`-${xmax * 50} 10 ${clientWidth + 50} ${clientHeight + 50}`)
        .panZoom({
            panning: true,
            wheelZoom: true,
            zoomMin: 0.5,
            zoomMax: 2,
            zoomFactor: 0.1,
            panButton: 1
        })
}

export function nodeFromLattice(index) {
    return {
        node: lattice[0][index],
        position: lattice[1][index],
        edges: collectEdges(lattice[0][index].toString()),
        toplabel: lattice[3][index],
        botlabel: lattice[4][index],
        valuation: lattice[5][index]
    }
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

export function load_file(setFile) {
    let input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => {

        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsText(file, 'UTF-8')
        reader.onload = readerEvent => {
            try {
                setFile(JSON.parse(readerEvent.target.result))
            } catch (e) {
                alert("Failure loading Context File:\n" + e)
            }
        }

    }

    input.click();
}

export function draw_lattice(file, container, wrapper, colors) {
    lattice = readJSON(file)
    init(container, wrapper)
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
    for (let i = 0; i < edges.length; i++) {
        let source = edges[i][0]
        let target = edges[i][1]

        edge_objects[i] = draw.line(positions[source][0] * (width / (2.2 * xmax)) + width / 2, -(positions[source][1] * (height / (1.2 * ymax))) + height,
            positions[target][0] * (width / (2.2 * xmax)) + width / 2, -(positions[target][1] * (height / (1.2 * ymax))) + height)
            .stroke({width: 3, color: style.getPropertyValue('--default-black')})
            .attr('source', source)
            .attr('target', target)

    }
    //Draw Nodes and Labels
    for (let j = 0; j < nodes.length; j++) {
        let group = draw.group();
        let node = nodeFromLattice(j);
        labels_upper[j] = group.text(String(toplabels[j]))
            .attr('name', (style.getPropertyValue('--label-upper-indicator') + String(j)))
            .move(positions[j][0] * (width / (2.2 * xmax)) + width / 2 - 30,
                -(positions[j][1] * (height / (1.2 * ymax))) - 50 + height)
            .font({fill: colors()['top-label'], size: 20, family: 'Arial'})
            .click(function () {
                handle_downwards(this, node)
                log(Action.SelectUpperLabel, node)
            })

        labels_lower[j] = group.text(String(botlabels[j]))
            .attr('name', (style.getPropertyValue('--label-lower-indicator') + String(j)))
            .move(positions[j][0] * (width / (2.2 * xmax)) + width / 2 - 15,
                -(positions[j][1] * (height / (1.2 * ymax))) + 30 + height)
            .font({fill: colors()['bottom-label'], size: 20, family: 'Arial'})
            .click(function () {
                handle_upwards(this, node)
                log(Action.SelectLowerLabel, node)
            })

        valuations_objects[j] = group.text(String(valuations[j]))
            .move(positions[j][0] * (width / (2.2 * xmax)) + width / 2 + 30,
                -(positions[j][1] * (height / (1.2 * ymax))) + height - 10)
            .font({fill: colors()['value-label'], size: 20, family: 'Arial'})

        nodes_upper[j] = group.path("M 0 0 L 25 0 A 1 1 0 0 0 -25 0 Z")
            .attr('name', j)
            .attr('drag', 0)
            .move(positions[j][0] * (width / (2.2 * xmax)) + width / 2 - 25
                , -(positions[j][1] * (height / (1.2 * ymax))) - 25 + height)
            .stroke({color: style.getPropertyValue('--default-black'), width: 3, linecap: 'round', linejoin: 'round'})
            .click(function () {
                handle_downwards(this, node)
                log(Action.SelectUpperNode, node)
            })
            .draggable()
            .on('dragstart.namespace', function (e) {
                startDrag(e, this, node)
            })
            .on('dragmove.namespace', function (e) {
                e.preventDefault();
                Drag(e, this)
            })
            .on('dragend.namespace', function (e) {
                endDrag(e, this, node)
            })

        if (labels_upper[j].text() === "") {
            nodes_upper[j].fill(style.getPropertyValue('--clear'))
        } else {
            nodes_upper[j].fill(colors()['top-half'])
        }

        nodes_lower[j] = group.path("M 0 0 L -25 0 A 1 1 0 0 0 25 0 Z")
            .attr('name', j)
            .attr('drag', 0)
            .move(positions[j][0] * (width / (2.2 * xmax)) + width / 2 - 25
                , -(positions[j][1] * (height / (1.2 * ymax))) + height)
            .stroke({color: style.getPropertyValue('--default-black'), width: 3, linecap: 'round', linejoin: 'round'})
            .click(function () {
                handle_upwards(this, node)
                log(Action.SelectLowerNode, node)
            })
            .draggable()
            .on('dragstart.namespace', function (e) {
                startDrag(e, this, node)
            })
            .on('dragmove.namespace', function (e) {
                e.preventDefault();
                Drag(e, this)
            })
            .on('dragend.namespace', function (e) {
                endDrag(e, this, node)
            })

        if (labels_lower[j].text() === "") {
            nodes_lower[j].fill(style.getPropertyValue('--clear'))
        } else {
            nodes_lower[j].fill(colors()['bottom-half'])
        }

        // label hover functionality
        labels_upper[j]
            .mouseover(function (e) {
                log(Action.HoverUpperNode, node)
                updateHoverSubConcept(nodesFromConcept(collectSubConcepts(nodes_upper[j])))
                updateHoverState(HoverState.Upper)
                updateHoverNode({
                    node: node,
                    coordinates: {
                        x: `${e.clientX + popupXOffset}px`,
                        y: `${e.clientY - popupYOffset}px`
                    }
                })
            })
            .mouseout(function () {
                updateHoverNode(null)
                updateHoverSubConcept(null)
                updateHoverState('')
            })

        labels_lower[j]
            .mouseover(function (e) {
                log(Action.HoverLowerNode, node)
                updateHoverSuperConcept(nodesFromConcept(collectSuperConcepts(nodes_lower[j])))
                updateHoverState(HoverState.Lower)
                updateHoverNode({
                    node: node,
                    coordinates: {
                        x: `${e.clientX + popupXOffset}px`,
                        y: `${e.clientY - popupYOffset}px`
                    }
                })
            })
            .mouseout(function () {
                updateHoverNode(null)
                updateHoverSubConcept(null)
                updateHoverState('')
            })
    }
}

export function updateColors(colors) {
    currentColors = colors;
    for (let i = 0; i < nodes_upper.length; i++) {
        labels_upper[i].font({weight: 'regular', fill: colors['top-label']})
        labels_lower[i].font({weight: 'regular', fill: colors['bottom-label']})
        valuations_objects[i].font({weight: 'regular', fill: colors['value-label']})
        if (labels_upper[i].text() !== "") nodes_upper[i].fill(colors['top-half'])
        if (labels_lower[i].text() !== "") nodes_lower[i].fill(colors['bottom-half'])
    }

}

export function updateFontSize(value) {
    for (let i = 0; i < nodes_upper.length; i++) {
        labels_upper[i].font({size: value})
        labels_lower[i].font({size: value})
        valuations_objects[i].font({size: value})
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

function startDrag(e, node, nodeData) {
    log(Action.StartDrag, nodeData)

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
    node.css('z-index', 2)
    nodes_upper[node.attr('name')].attr('drag', 1)
    nodes_lower[node.attr('name')].attr('drag', 1)
}

function Drag(e, node) {
    if (node.attr('drag') === 1) {
        let p = draw.point(e.detail.event.clientX, e.detail.event.clientY)
        let cursorX = p.x
        let cursorY = p.y

        selection.forEach(element => {
            redrawNode(element, node, cursorX, cursorY, bounds, selected_edges)
        })
    }
}

function endDrag(e, node, nodeData) {
    log(Action.EndDrag, nodeData)
    let name = node.attr('name')
    //Reset Drag Flag
    nodes_upper[name].attr('drag', 0)
    nodes_lower[name].attr('drag', 0)
    selected_edges.clear()
    bounds = {}
    node.css('z-index', 1)
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

    labels_upper[name].move(posX, posY - 55)
    labels_lower[name].move(posX, posY + 30)
    valuations_objects[name].move(posX + 55, posY - 10)

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

function handle_upwards(node, nodeData) {
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

    //Check if Other Half is Already Present
    if (!selection.has(nodes_upper[name])) {
        selection.addToSession(node, nodeData)
    }
    grey_out()
    if (selection.size > 1) {
        find_sup(node)
    } else {
        mark_upper(node)
    }
    highlight_selection(selection)
}

function handle_downwards(node, nodeData) {
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

    //Check if Other Half is Already Present
    if (!selection.has(nodes_lower[name])) {
        selection.addToSession(node, nodeData)
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
        nodes_upper[name].fill(currentColors['top-half'])
    }
    labels_upper[name].font({weight: 'bold', fill: currentColors['top-label']})
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

                edge_objects[i].stroke({color: currentColors['top-label'], width: 4})
                changed = true
                super_concepts.add(edges[i][1])
                nodes_lower[edges[i][1]].stroke({color: style.getPropertyValue('--default-black')})
                nodes_upper[edges[i][1]].stroke({color: style.getPropertyValue('--default-black')})
                labels_upper[edges[i][1]].font({weight: 'bold', fill: currentColors['top-label']})

                if (nodes_upper[edges[i][1]].attr('fill') === style.getPropertyValue('--greyed-out')) {
                    nodes_upper[edges[i][1]].fill(style.getPropertyValue('--intent-color'))
                }
            }
        }
    }
    updateSuperConcept([...super_concepts])
    updateSubConcept([])
}

function mark_lower(node) {

    let name = node.attr("name")
    if (nodes_lower[name].attr('fill') === style.getPropertyValue('--greyed-out')) {
        nodes_lower[name].fill(currentColors['bottom-half'])
    }
    labels_lower[name].font({weight: 'bold', fill: currentColors['bottom-label']})
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

                edge_objects[i].stroke({color: currentColors['bottom-label'], width: 4})
                changed = true
                sub_concepts.add(edges[i][0])
                nodes_lower[edges[i][0]].stroke({color: style.getPropertyValue('--default-black')})
                nodes_upper[edges[i][0]].stroke({color: style.getPropertyValue('--default-black')})
                labels_lower[edges[i][1]].font({weight: 'bold', fill: currentColors['bottom-label']})

                if (nodes_lower[edges[i][1]].attr('fill') === style.getPropertyValue('--greyed-out')) {
                    nodes_lower[edges[i][1]].fill(style.getPropertyValue('--extent-color'))
                }
            }
        }
    }
    updateSubConcept([...sub_concepts])
    updateSuperConcept([])
}

function nodesFromConcept(concepts) {
    let names = [];
    concepts.forEach(value => {
        let name = value.attr("name")
        names.push(name)
    })
    return names
}

function collectSuperConcepts(node) {
    let super_concepts = new Set([node])

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

    nodesFromConcept(super_concepts);

    return super_concepts;
}

function find_sup(node) {
    let supremum;
    const super_concepts = collectSuperConcepts(node);

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

function collectSubConcepts(node) {
    let sub_concepts = new Set([node])

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
    return sub_concepts;
}

function find_inf(node) {
    let infimum;
    let sub_concepts = collectSubConcepts(node);

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
        labels_upper[i].font({weight: 'regular', fill: currentColors['top-label']})
        labels_lower[i].font({weight: 'regular', fill: currentColors['bottom-label']})
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
    selection.clearSession()
    reset_marking()
}

function highlight_selection(selection) {

    selection.forEach(node => {
        let name = node.attr("name")
        nodes_upper[name].stroke({color: style.getPropertyValue('--highlight-color')})
        nodes_lower[name].stroke({color: style.getPropertyValue('--highlight-color')})

        if (selection_type === style.getPropertyValue('--attribute')) {
            labels_upper[name].font({weight: 'bold', fill: currentColors['top-label']})
        }
        if (selection_type === style.getPropertyValue('--object')) {
            labels_lower[name].font({weight: 'bold', fill: currentColors['bottom-label']})
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
    draw.each(function (i, children) {
        this.remove()
    }, true)

}
