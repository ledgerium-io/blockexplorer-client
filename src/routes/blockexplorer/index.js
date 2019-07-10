import React, { Component, Fragment } from "react";
import IntlMessages from "Util/IntlMessages";
import { Row, Card, CardBody,CardHeader, CardTitle, Button, Jumbotron, Badge } from "reactstrap";
import moment from 'moment'
moment.updateLocale('en', {
    relativeTime : {
        future: "in %s",
        past:   "%s ago",
        s  : '%d seconds',
        ss : '%d seconds',
        m:  "a minute",
        mm: "%d minutes",
        h:  "an hour",
        hh: "%d hours",
        d:  "a day",
        dd: "%d days",
        M:  "a month",
        MM: "%d months",
        y:  "a year",
        yy: "%d years"
    }
});
import { Colxx, Separator } from "Components/CustomBootstrap";
import BreadcrumbContainer from "Components/BreadcrumbContainer";
import WorldMap from "Components/map";
import io from 'socket.io-client';
import { NavLink } from "react-router-dom";
import Web3 from 'web3';
const web3 = new Web3(new Web3.providers.HttpProvider('http://testnet.ledgerium.net:8545/'));
import axios from 'axios';

export default class extends Component {

  constructor(props) {
    super(props)
    this.state = {
      connected: false,
      loading: false,
      lastBlockSeconds: 0,
      averageBlockTime: 5,
      transactions: [],
      blocks: [],
      latestBlock: 0,
      totalContracts: 0,
      activeNode: 0,
      blockReward: 0,
      gasPrice: 0
    }
    this.serverSocket()
    this.startTimer()
  }

  startTimer() {
    this.timer = setInterval(()=>{
      const lastBlockSeconds = this.state.lastBlockSeconds + 1
      this.setState({
        lastBlockSeconds
      })
    },1000)
  }

  componentWillMount() {

    axios.get('http://localhost:2000/api/blockExplorer')
      .then(response => {
        this.setState({
          blocks: response.data.data.blocks,
          latestBlock: response.data.data.blocks[0].number,
          latestBlockSeconds: 0,
          blockReward: response.data.data.reward,
          transactions: response.data.data.transactions,
          totalContracts: response.data.data.contracts,
          activeNodes: response.data.data.peers,
          gasPrice: response.data.data.gasPrice
        })
      })

  }

  addTransactions(tx) {
    let transactions = this.state.transactions
    for(let i=0; i<tx.length; i++) {
      web3.eth.getTransaction(tx[i])
        .then(response => {
          transactions.unshift(response)
          if(transactions.length > 10) {
            transactions.pop()
          }
        })

    }
    this.setState({transactions})
  }

  addBlock(block) {
    let blocks = this.state.blocks
    if(block.transactions.length > 0) {
      this.addTransactions(block.transactions)
    }
    blocks.unshift(block)
    if(blocks.length > 4) {
      blocks.pop()
    }
    this.setState({blocks})
  }


  serverSocket() {
    const self = this
    this.setState({
      connecting: true
    })
    const socket = io('http://localhost:2000')

    socket.on('connect', () => {
      self.setState({
        connected: true,
        connecting: false
      })
    })

    socket.on('disconnect', () => {
      self.setState({
        connected: false,
        connecting: false
      })
    })

    socket.on('newBlockHeaders', (block) => {
      self.addBlock(block)
      self.setState({
        latestBlock: block.number,
        lastBlockSeconds: 0
      })
    })
  }

  render() {
    const blocks = this.state.blocks
    const transactions = this.state.transactions
    return (
      <Fragment>
        <h3>LEDGERIUM BLOCK EXPLORER</h3>
        <Separator className="mb-5" />
          <Row>
            <Colxx md="12">
            <Card>
              <Row>
                <Colxx md="4">
                  <Row>
                    <Colxx md="12">
                      <CardBody>
                        <CardTitle>
                          <NavLink to={'/app/block/' + (blocks.length > 0 ? blocks[0].number : "#")}>
                          <small>Best Block</small> #{blocks.length > 0 ? blocks[0].number.toLocaleString() : ""}
                          </NavLink>
                        </CardTitle>
                      </CardBody>
                    </Colxx>
                    <Colxx md="12">
                      <CardBody>
                        <CardTitle>
                          <small>Gas Limit</small> {blocks[0] ? blocks[0].gasLimit : 0} gas
                        </CardTitle>
                      </CardBody>
                    </Colxx>


                  </Row>
                </Colxx>
                <Colxx md="4">
                <Row>
                <Colxx md="6">
                  <CardBody>
                    <CardTitle>
                      <small>Last Block</small> {this.state.lastBlockSeconds}s ago <small>(Average {this.state.averageBlockTime}s)</small>
                    </CardTitle>
                  </CardBody>
                </Colxx>

                  <Colxx md="6">
                  <CardBody>
                    <NavLink to={'/app/nodes/'}>
                      <CardTitle>
                        <small>Nodes Online</small> {this.state.activeNodes}
                      </CardTitle>
                    </NavLink>
                    </CardBody>
                  </Colxx>

                  <Colxx md="6">
                  <CardBody>
                    <CardTitle>
                      <small>Gas Price</small> {this.state.gasPrice} gwei
                      </CardTitle>
                    </CardBody>
                  </Colxx>
                  <Colxx md="6">
                  <CardBody>
                    <CardTitle>
                    <small>Total Contracts</small> {this.state.totalContracts}
                      </CardTitle>
                    </CardBody>
                  </Colxx>
                </Row>
                </Colxx>
                <Colxx md="4">
                <WorldMap/>
                </Colxx>

              </Row>
            </Card>
            </Colxx>
          </Row>
          <br/><br/>

          <Row>
          <Colxx md="6">
          <Card>
          <CardBody>
            <CardTitle>
            Blocks
            <div className="float-right float-none-xs mt-2">
            <NavLink to={'/app/blocks'}>
              <Button color="primary" size="sm" className="mb-2">
                View all Blocks <i className="iconsminds-arrow-out-right"/>
              </Button>
            </NavLink>
            </div>
            </CardTitle>
            { blocks.length > 0 ? blocks.map((block, i) => {
              return (
                <Card key={`block${i}`}>
                <CardBody className="side-bar-line-tx">
                    <CardTitle>
                      {<NavLink to={'/app/block/'+block.number}>{block.number.toLocaleString()}</NavLink>} <br/>
                    </CardTitle>
                    <div className="d-flex justify-content-between">
                      <p>{block.transactions.length} Transactions</p>
                      <p>{moment(block.timestamp*1000).fromNow()}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p>Miner: <NavLink to={"/app/address/"+block.miner}>{block.miner}</NavLink></p>
                      <p>Reward: {this.state.blockReward} XLG</p>
                    </div>
                  </CardBody>
                </Card>
              )
            }) : "Loading . . ." }
            </CardBody>
            </Card>
            </Colxx>

            <Colxx md="6">
            <Card>
            <CardBody>
            <CardTitle>


            Transactions
            <div className="float-right float-none-xs mt-2">
            <NavLink to={'/app/transactions'}>
              <Button color="primary" size="sm" className="mb-2">
                View all Transactions <i className="iconsminds-arrow-out-right"/>
              </Button>
            </NavLink>
            </div>
            </CardTitle>
        { transactions.length > 0 ? this.state.transactions.map((tx, i) => {
                   return <Card key={`tx${i}`}>
                   <CardBody className="side-bar-line-tx">
                       <CardTitle>
                         {<NavLink to={'/app/tx/'+tx.hash}>{tx.hash}</NavLink>}
                       </CardTitle>
                       <div className="d-flex justify-content-between">
                        <p></p>
                        <p><small><NavLink to={'/app/address/'+(tx.from)}>{tx.from}</NavLink><i className="iconsminds-arrow-out-right"/><NavLink to={'/app/address/'+(tx.to)}>{tx.to}</NavLink></small></p>
                        <p></p>
                       </div>
                       <div className="d-flex justify-content-between">
                         <p>
                         {tx.value} XLG
                         </p>
                         <p>
                         <small>
                         {tx.gasPrice == 0 ? 0 : web3.utils.fromWei(tx.gasPrice.toString(), 'ether')} GAS
                         </small>
                         </p>
                         <p>
                         Block #{<NavLink to={'/app/block/'+(tx.blockNumber)}>{tx.blockNumber.toLocaleString()}</NavLink>}
                         </p>
                       </div>
                      </CardBody>
                      </Card>
                }) : 'Loading . . .'
              }

              </CardBody>
              </Card>
    </Colxx>
    </Row>
  </Fragment>
    );
  }
}
