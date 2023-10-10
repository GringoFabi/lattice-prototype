import StandardNode from "./StandardNode.jsx";


const Legend = () => {

    return (
        <div className="card">
            <div className="column">
                <h3 style="margin: 1px">Legend</h3>
                <hr style="width: 100%"></hr>
                <span style="margin: 0.5em 0.75em">Hover with your cursor on top of a node to display more information</span>
                <div className="row-middle">
                    <StandardNode />
                </div>
                <div className="row">
                    <StandardNode />
                    Choose an article by clicking on it
                </div>
                <div className="row">
                    <StandardNode />
                    Choose a property by clicking on it
                </div>
            </div>
        </div>
    )
}

export default Legend