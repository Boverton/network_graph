import React, { Component } from 'react';
import './App.css';
import GraphContainer from "./components/GraphContainer";

class App extends Component {

  constructor() {
    super();

    this.state = {
        nodes: [{id: '', color: 'transparent'}],
        links: [],
        selected: null,
        nodeNameInput: '',
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

    // check if we already have this node
    if (nodesClone.filter( node => node.id === name).length > 0) {
        return;
    }

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
    stateClone.nodeNameInput = '';

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

  submitNodeName = (event) => {
      event.preventDefault();
      let value = document.getElementById("node-name-input").value.toUpperCase().trim();
      if (value === "") {
          return;
      }
      this.addNewNode(value);
  };

  updateInputValue = () => {
    let value = document.getElementById('node-name-input').value
        .replace(/[^a-zA-Z0-9]/g, '')
        .toUpperCase();

    this.setState({nodeNameInput: value})
  };

  //   /**
  //    * Not part of the initial requirements, future possible feature
  //    * @param source
  //    * @param target
  //    */
  // onClickLink = (source, target) => {
  //     let stateClone = {...this.state},
  //         sourceTargetArray = [source, target].sort(),
  //         sourceTargetString = JSON.stringify((sourceTargetArray));//
  //
  //     let filteredLinks = stateClone.links.filter(link => {
  //             let orderedString= JSON.stringify([link.source, link.target].sort());
  //             return link.color === undefined
  //             && sourceTargetString !== orderedString
  //         }
  //     );
  //
  //     stateClone.links = filteredLinks;
  //     this.setState(stateClone);
  // };

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
    let stateClone = {...this.state},
        linksClone = [...stateClone.links];

      let newArrayString = JSON.stringify([source, target].sort());

      let duplicates = linksClone.filter( link => {
          let orderedLinks = JSON.stringify([link.source, link.target].sort());
          return newArrayString === orderedLinks;
      });

      if (duplicates.length > 0) {
          return;
      }

    // add new connection to copy of link
    linksClone.push({source: source, target: target});

    this.deselectAllNodes(stateClone);

    // remove default link to the default node
    stateClone.links = linksClone;

    this.setState(stateClone);
  };

  render() {
    // graph payload (with minimalist structure)
    const data = {
      nodes: this.state.nodes,
      links: this.state.links
    };

    return (
        <div>
            <div id="header">
                <span>
                    Welcome To Your Graph
                </span>
                <form>
                    <input
                        type="text"
                        id="node-name-input"
                        value={this.state.nodeNameInput}
                        onChange={this.updateInputValue}
                        placeholder="Add a node here"
                        autoComplete="off"
                    />
                    <button type="submit"
                        onClick={(event) => this.submitNodeName(event)}
                    >
                        Add Node
                    </button>
                </form>
            </div>
            <GraphContainer
                data={data}
                onClickNode={this.onClickNode}
            />
        </div>
    );
  }
}

export default App;
