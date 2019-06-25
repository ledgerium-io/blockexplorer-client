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
      transactions: [],
      blocks: [],
      latestBlock: 0,
      totalContracts: 0,
      activeNode: 0
    }
    this.serverSocket()
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
    axios.get('http://localhost:2000/api/latestBlocks/4')
      .then(response => {
        this.setState({
          blocks: response.data.data,
          latestBlock: response.data.data[0].number,
          lastBlockSeconds: 0
        })
    })

    axios.get('http://localhost:2000/api/latestTransactions/20')
      .then(response => {
        this.setState({
          transactions: response.data.data,
        })
    })


    axios.get('http://testnet.ledgerium.net:9999/contractCount')
      .then(response => {
        console.log(response.data)
        this.setState({
          totalContracts: response.data.totalContracts
        })
    })
    axios.get('http://localhost:2000/api/peers')
      .then(response => {
        this.setState({
          activeNodes: response.data.data
        })
      })
  }

  addTransactions(tx) {
    let transactions = this.state.transactions
    for(let i=0; i<tx.length; i++) {
      web3.eth.getTransaction(tx[i])
        .then(response => {
          console.log(response)
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
      console.log(block)
      self.addBlock(block)
      self.setState({
        latestBlock: block.number,
        lastBlockSeconds: 0
      })
    })
  }

  render() {
    const blocks = this.state.blocks
    return (
      <Fragment>
        <h3>LEDGERIUM BLOCK EXPLORER</h3>
        <Separator className="mb-5" />
        <Row>
          <Colxx xl="3" lg="6" className="mb-4">
              <Card>
                <CardHeader className="p-0 position-relative">
                  <div className="position-absolute handle card-icon">
                    <i className="simple-icon-shuffle" />
                  </div>
                </CardHeader>
                <CardBody className="d-flex justify-content-between align-items-center">
                  <CardTitle className="mb-0">
                  <i className="iconsminds-sand-watch-2"/> Average Block Time
                  </CardTitle>
                  5.00 s
                  <div className="progress-bar-circle">
                  </div>
                </CardBody>
              </Card>
            </Colxx>
            <Colxx xl="3" lg="6" className="mb-4">
              <Card>
                <CardHeader className="p-0 position-relative">
                  <div className="position-absolute handle card-icon">
                    <i className="simple-icon-shuffle" />
                  </div>
                </CardHeader>
                <NavLink to="/app/nodes">
                <CardBody className="d-flex justify-content-between align-items-center">
                  <CardTitle className="mb-0">

                    <i className="iconsminds-communication-tower-2"/> Active Nodes

                  </CardTitle>
                  {this.state.activeNodes}
                  <div className="progress-bar-circle">
                  </div>
                </CardBody>
                </NavLink>
              </Card>
            </Colxx>
            <Colxx xl="3" lg="6" className="mb-4 ">
                  <Card>
                    <CardHeader className="p-0 position-relative ">
                      <div className="position-absolute handle card-icon">
                        <i className="simple-icon-shuffle" />
                      </div>
                    </CardHeader>
                    <CardBody className="d-flex justify-content-between align-items-center">
                      <CardTitle className="mb-0">
                        <i className="iconsminds-link"/> Total Blocks
                      </CardTitle>
                        {blocks.length > 0 ? blocks[0].number.toLocaleString() : "..."}
                      <div className="progress-bar-circle">

                      </div>
                    </CardBody>
                  </Card>
                </Colxx>
                <Colxx xl="3" lg="6" className="mb-4">
                  <Card>
                    <CardHeader className="p-0 position-relative">
                      <div className="position-absolute handle card-icon">
                        <i className="simple-icon-shuffle" />
                      </div>
                    </CardHeader>
                    <CardBody className="d-flex justify-content-between align-items-center">
                      <CardTitle className="mb-0">
                        <i className="iconsminds-testimonal"/> Total Contracts
                      </CardTitle>
                      {this.state.totalContracts}

                      <div className="progress-bar-circle">
                      </div>
                    </CardBody>
                  </Card>
                </Colxx>

          </Row>


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
            <Row>
            { blocks.length > 0 ? blocks.map((block, i) => {
              return (
                <Colxx xl="3" lg="6" className="mb-4" key={block+i}>
                <Card>
                <CardBody className="side-bar-line">
                    <CardTitle>
                      {<NavLink to={'/app/block/'+block.number}>{block.number.toLocaleString()}</NavLink>} <br/>
                    </CardTitle>
                    <div className="d-flex justify-content-between">
                      <p>{block.transactions.length} Transactions</p>
                      <p>{moment(block.timestamp*1000).fromNow()}</p>
                    </div>
                    <div> Miner: <NavLink to={"/app/address/"+block.miner}>{block.miner}</NavLink></div>
                    <div> Reward: {block.gasUsed} XLG</div>
                  </CardBody>
                </Card>
              </Colxx>
              )
            }) : "" }
            { blocks.length < 4 ? blocks.map((block, i) => {
              return (
                <Colxx xl="3" lg="6" className="mb-4" key={block+i}>
                <Card>
                <CardBody className="side-bar-line">
                    <CardTitle>
                      {<NavLink to={'/app/block/'+block.number}>{block.number.toLocaleString()}</NavLink>} <br/>
                    </CardTitle>
                    <div className="d-flex justify-content-between">
                      <p>{block.transactions.length} Transactions</p>
                      <p>{moment(block.timestamp*1000).fromNow()}</p>
                    </div>
                    <div> Miner: <NavLink to={"/app/address/"+block.miner}>{block.miner}</NavLink></div>
                    <div> Reward: {block.gasUsed} XLG</div>
                  </CardBody>
                </Card>
              </Colxx>
              )
            }) : '' }
        </Row>
            </CardBody>
            </Card>



            <br/><br/>
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
      <Row>
    <Colxx sm="12" className="mb-4">


        { !this.state.loading ? this.state.transactions.map((tx, i) => {
                   return <Row key={tx.id}>
                    <Colxx xxs="12">
                      <Card className="card d-flex mb-3 side-bar-line-tx">
                        <div className="d-flex flex-grow-1 min-width-zero">
                        <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
                        <NavLink
                          to="#"
                          className="list-item-heading mb-0 truncate w-40 w-xs-100  mb-1 mt-1"
                        >

                        { " " }
                        <span className="align-middle d-inline-block color-theme-1">TX</span>
                      </NavLink>
                      <p className="mb-1 text-muted text-small w-15 w-xs-100 ">
                        <span className="color-theme-2"></span>
                      </p>
                      <p className="mb-1 text-muted text-small w-15 w-xs-100">
                        <NavLink to={'/app/block/'+tx.blockNumber}>Block #{tx.blockNumber.toLocaleString()}</NavLink>
                      </p>
                      <div className="w-15 w-xs-100">
                        <Badge pill>
                          {tx.transaction_type}
                        </Badge>
                      </div>
                      </CardBody>
                      </div>
                      <div className="card-body pt-1">
                        <p className="mb-0">
                        <NavLink to={'/app/tx/'+tx.hash}>{tx.hash}</NavLink>
                        </p>
                        <div className="mb-0">
                        <p><NavLink to={'/app/address/'+(tx.from)}>{tx.from}</NavLink> <i className="iconsminds-arrow-out-right"/> <NavLink to={'/app/address/'+(tx.to)}>{tx.to}</NavLink></p>
                        </div>
                        <br/>
                        <p className="mb-0">
                        {tx.value == 0 ? 0 : web3.utils.fromWei(tx.value.toString(), 'ether')} XLG
                        </p>
                        <p className="mb-0">
                        <small>
                        {tx.gasPrice == 0 ? 0 : web3.utils.fromWei(tx.gasPrice.toString(), 'ether')} GAS
                        </small>
                        </p>
                      </div>
                      </Card>
                    </Colxx>
                   </Row>
                }) : 'Loading . . .'
              }

    </Colxx>
    </Row>
    </CardBody>
    </Card>
  </Fragment>
    );
  }
}
