import React, { Component, Fragment } from "react";
import IntlMessages from "Util/IntlMessages";
import { Row, Card, CardBody,CardHeader, CardTitle, Button, Jumbotron, Badge } from "reactstrap";
import moment from 'moment'
import { Colxx, Separator } from "Components/CustomBootstrap";
import BreadcrumbContainer from "Components/BreadcrumbContainer";
import io from 'socket.io-client';
import { NavLink } from "react-router-dom";
import Web3 from 'web3';
const web3 = new Web3(new Web3.providers.HttpProvider('http://125.254.27.14:28545/'));
import axios from 'axios';

export default class extends Component {

  constructor(props) {
    super(props)
    this.state = {
      nodes: [],
      currentMiner: '',
      latestBlock: 0
    }
  }

  componentWillMount() {
    web3.eth.getBlock('latest')
      .then(block => {
        let nodes = block.validators
        nodes.push(block.miner)
        this.setState({
          currentMiner: block.miner,
          nodes,
          latestBlock: block.number
        })
      })
      this.listenForBlocks()
  }

  listenForBlocks() {
    setInterval(()=>{
      web3.eth.getBlock('latest')
      .then(block => {
        this.setState({
          currentMiner: block.miner,
          latestBlock: block.number
        })
        console.log(block.miner)
      })
    },5000)
  }



  render() {
    const validator = {
      color: 'red'
    }
    const {nodes, currentMiner, latestBlock} = this.state
    const radius = '12em'
    const start = -90
    const slice = 360/nodes.length
    return (
      <Fragment>
        <h3>LEDGERIUM BLOCK EXPLORER</h3>
        <Separator className="mb-5" />
        <Row>
          <Colxx md="12">
          <ul>
          {nodes.length > 0 ? nodes.map((node, i)=> {
            const rotate = slice * i + start
            const rotateReverse = rotate * -1;
            const nodeStyle = {
              transform: 'rotate(' + rotate + 'deg) translate(' + radius + ') rotate(' + rotateReverse + 'deg)'
            }
            const validatorStyle = {
              transform: 'rotate(' + rotate + 'deg) translate(' + radius + ') rotate(' + rotateReverse + 'deg)',
              color: 'red'
            }
            return (<li key={node+i}>{node.toLowerCase() == currentMiner.toLowerCase() ? <span style={validatorStyle}> {node} </span>: <span style={nodeStyle}> {node} </span>}</li>)
          }) : null}
          </ul>
          </Colxx>
        </Row>
  </Fragment>
    );
  }
}
