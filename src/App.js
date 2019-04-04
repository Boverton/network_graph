import React, { Component } from 'react';
import { Graph } from 'react-d3-graph';
import './App.css';

class App extends Component {

  constructor() {
    super();

    this.state = {
    nodes: [{id: '', color: 'transparent'}, {id: 'Harry'}, {id: 'Sally'}, {id: 'Alice'}],
    links: [{source: 'Harry', target: 'Sally', highlightColor: "blue"}, {source: 'Harry', target: 'Alice'}],
    selected: null,
    }
  }

  /**
   * Add a new node to the graph
   * @param name String
   */
  addNewNode = (name) => {
    let stateClone = {...this.state};
    let nodesClone = [...stateClone.nodes];
    let linksClone = [...stateClone.links];

    // add by name
    nodesClone.push({id: name});
    // add link to the initial empty node
    //    if we don't do this the new node just sits in the upper left corner
    //    linking it pulls it into view
    linksClone.push({
      source: name,
      target: "",
      color: "transparent",
      highlightColor: "SAME",
      highlightStrokeColor: "SAME"
    });

    // pull mutated node/link arrays back onto the copy of the state
    stateClone.nodes = nodesClone;
    stateClone.links = linksClone;

    // replace state with updated clone
    this.setState(stateClone);
  };

  /**
   * Triggered when user clicks on a node
   * actions taken:
   *    Toggle selected UI
   *    if 2nd node clicked create link
   * @param nodeId
   */
  onClickNode = (nodeId) => {
    let stateClone = {...this.state};
    this.toggleSelectedNodes(stateClone, nodeId);

    // if not same node clicked and already have one selected create link
    if (nodeId !== this.state.selected && this.state.selected !== null) {
      this.addLink(nodeId, this.state.selected);
      return;
    }

    this.setState(stateClone);
  };

  onClickLink = (source, target) => {
    window.alert(`Clicked link between ${source} and ${target}`);
  };

  /**
   * remove color property from all nodes (except default 0 node, needs to stay 'transparent')
   * @param stateClone
   */
  deselectAllNodes(stateClone) {
    let updatedNodes = stateClone.nodes.map( node => {
      // keep default node as is
      if (node.id === "") {
        return node;
      }
      return {id: node.id};
    });

    stateClone.selected = null;
    stateClone.nodes = updatedNodes;
  }

  /**
   * toggles a selected node 'red' or not
   * @param stateClone
   * @param nodeId
   * @returns {*}
   */
  toggleSelectedNodes(stateClone, nodeId) {
    let somethingSelected;

    let updatedNodes = stateClone.nodes.map(node => {
      if (node.id === nodeId && stateClone.selected !== nodeId) {
        somethingSelected = true;
        return {id: node.id, color: "red"};
      }
      // keep default node as is, with transparent color
      else if (node.id === "") {
        return node;
      } else {
        return {id: node.id};
      }
    });

    // clear selected if nothing has been selected
    stateClone.selected = somethingSelected ? nodeId : null;
    stateClone.nodes = updatedNodes;

    return stateClone;
  };

  /**
   * Add a link between nodes
   * @param source String
   * @param target String
   */
  addLink(source, target) {
    let stateClone = {...this.state};
    let linksClone = [...stateClone.links];

    // add new connection to copy of link
    linksClone.push({source: source, target: target});

    this.deselectAllNodes(stateClone);

    stateClone.links = linksClone;

    this.setState(stateClone);
  };

  render() {
    // graph payload (with minimalist structure)
    const data = {
      nodes: this.state.nodes,
      links: this.state.links
    };

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
            data={data}
            config={myConfig}
            onClickNode={this.onClickNode}
            onClickLink={this.onClickLink}
        />
    );
  }
}

export default App;
