
function Lattice({file}) {
    const {nodes, positions, edges, toplabels, botlabels, valuations, xmax, ymax} = readJSON(file);

    console.log(nodes, positions, edges, toplabels, botlabels, valuations, xmax, ymax)
}

function readJSON(json){
    let nodes = []
    let positions = []
    let edges = []
    let toplabels = []
    let botlabels = []
    let valuations = []

    //Coordinates of Outmost Nodes on either Axis
    let xmax = 0
    let ymax = 0

    //Read Nodes, Positions and Labels
    for (let i = 0; i < json.nodes.length; i++){

        nodes[i] = i
        positions[i] = json.positions[i][i]
        toplabels[i] = Object.entries(json['shorthand-annotation'][i])[0][1][0]
        botlabels[i] = Object.entries(json['shorthand-annotation'][i])[0][1][1]
        valuations[i] = json.valuations[i][i]

        if (json.positions[i][i][0] > xmax){xmax = json.positions[i][i][0]}
        if (json.positions[i][i][1] > ymax){ymax = json.positions[i][i][1]}
    }
    //Read Edges
    for (let k = 0; k < json.edges.length; k++){
        for (let l = 0; l < Object.entries(json.edges[k])[0][1].length; l++){
            edges.push([Object.entries(json.edges[k])[0][0],
                Object.entries(json.edges[k])[0][1][l]])
        }
    }

    return {nodes, positions, edges, toplabels, botlabels, valuations, xmax, ymax}
}

export default Lattice;