import React, { Component } from 'react';
import {Graph} from "react-d3-graph";
import PropTypes from 'prop-types';

export default class GraphContainer extends Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return JSON.stringify(this.props) !== JSON.stringify(nextProps);
    }

    render() {
        // the graph configuration, you only need to pass down properties
        // that you want to override, otherwise default ones will be used
        const myConfig = {
            nodeHighlightBehavior: false,
            height: 550,
            width: 600,
            node: {
                color: 'lightgreen',
                size: 400,
                fontSize: 15,
            },
        };

        return (
            <div id="graph-container">
                <div
                    id="overlay"
                    className={this.props.data.nodes.length === 1 ? "show" : ""}
                >
                    <div id="instructions">
                        <span className="title">
                            Add a node above to start your graph
                        </span>
                        <span>
                            You can do the following:
                        </span>
                        <ul>
                            <li>
                                Drag and drop nodes
                            </li>
                            <li>
                                Zoom in and out
                            </li>
                            <li>
                                Create edges between 2 nodes
                            </li>
                        </ul>
                    </div>
                </div>
                <Graph
                    id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                    data={this.props.data}
                    config={myConfig}
                    onClickNode={this.props.onClickNode}
                />
            </div>
        )
    }
};

GraphContainer.propTypes = {
  data: PropTypes.object.isRequired,
  onClickNode: PropTypes.func.isRequired,
};

