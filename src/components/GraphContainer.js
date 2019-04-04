import React from 'react';
import {Graph} from "react-d3-graph";
import PropTypes from 'prop-types';


const GraphContainer = (props) => {

    // the graph configuration, you only need to pass down properties
    // that you want to override, otherwise default ones will be used
    const myConfig = {
        nodeHighlightBehavior: false,
        node: {
            color: 'lightgreen',
            size: 120,
        },
    };

    return (
        <Graph
            id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
            data={props.data}
            config={myConfig}
            onClickNode={props.onClickNode}
        />
    )
};

export default GraphContainer;

GraphContainer.propTypes = {
  data: PropTypes.object.isRequired,
  onClickNode: PropTypes.func.isRequired,
};

