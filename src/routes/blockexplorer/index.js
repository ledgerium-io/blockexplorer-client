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

    axios.get('http://localhost:2000/api/latestTransactions/25')
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
    const blockLength = this.state.blocks.length
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
                <a href="/app/nodes">
                <CardBody className="d-flex justify-content-between align-items-center">
                  <CardTitle className="mb-0">

                    <i className="iconsminds-communication-tower-2"/> Active Nodes

                  </CardTitle>
                  {this.state.activeNodes}
                  <div className="progress-bar-circle">
                  </div>
                </CardBody>
                </a>
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
                        {blockLength > 0 ? blocks[0].number.toLocaleString() : "..."}
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
              <Button color="primary" size="sm" className="mb-2">
                View all Blocks <i className="iconsminds-arrow-out-right"/>
              </Button>
            </div>
            </CardTitle>
            <Row>
            <Colxx sm="6" md="3" className="mb-4">
              <Card>
              <CardBody className="side-bar-line">
                  <CardTitle>
                    {blockLength > 0 ? <a href={'/app/block/'+(blocks[0].number)}>{blocks[0].number.toLocaleString()}</a> : "..."} <br/>
                  </CardTitle>
                  <div className="d-flex justify-content-between">
                    <p>{blockLength > 0 ? blocks[0].transactions.length : 0} Transactions</p>
                    <p>{blockLength > 0 ? moment(blocks[0].timestamp*1000).fromNow() : 0}</p>
                  </div>
                  <div> Miner: {blockLength > 0 ? <a href={"/app/address/"+blocks[0].miner}>{blocks[0].miner}</a> : "Unknown"}</div>
                  <div> Reward: {blockLength > 0 ? blocks[0].gasUsed : "0"} XLG</div>
                </CardBody>
              </Card>
            </Colxx>

            <Colxx sm="6" md="3" className="mb-4">
              <Card>
              <CardBody className="side-bar-line">
                  <CardTitle>
                  {blockLength > 1 ? <a href={'/app/block/'+(blocks[1].number)}>{blocks[1].number.toLocaleString()}</a> : "..."} <br/>
                  </CardTitle>
                  <div className="d-flex justify-content-between">
                    <p>{blockLength > 1 ? blocks[1].transactions.length : 0} Transactions</p>
                    <p>{blockLength > 1 ? moment(blocks[1].timestamp*1000).fromNow() : 0}</p>
                  </div>
                  <div> Miner: {blockLength > 1 ? <a href={"/app/address/"+blocks[1].miner}>{blocks[1].miner}</a> : "Unknown"}</div>
                  <div> Reward: {blockLength > 1 ? blocks[1].gasUsed : "0"} XLG</div>
                </CardBody>
              </Card>
            </Colxx>

            <Colxx sm="6" md="3" className="mb-4">
              <Card>
              <CardBody className="side-bar-line">
                  <CardTitle>
                  {blockLength > 2 ? <a href={'/app/block/'+(blocks[2].number)}>{blocks[2].number.toLocaleString()}</a> : "..."} <br/>
                  </CardTitle>
                  <div className="d-flex justify-content-between">
                    <p>{blockLength > 2 ? blocks[2].transactions.length : 0} Transactions</p>
                    <p>{blockLength > 2 ? moment(blocks[2].timestamp*1000).fromNow() : 0}</p>
                  </div>
                  <div> Miner: {blockLength > 2 ? <a href={"/app/address/"+blocks[2].miner}>{blocks[2].miner}</a> : "Unknown"}</div>
                  <div> Reward: {blockLength > 2 ? blocks[2].gasUsed : "0"} XLG</div>
                </CardBody>
              </Card>
            </Colxx>

            <Colxx sm="6" md="3" className="mb-4" >
              <Card>
                <CardBody className="side-bar-line">
                  <CardTitle>
                  {blockLength > 3 ? <a href={'/app/block/'+(blocks[3].number)}>{blocks[3].number.toLocaleString()}</a> : "..."} <br/>
                  </CardTitle>
                  <div className="d-flex justify-content-between">
                    <p>{blockLength > 3 ? blocks[3].transactions.length : 0} Transactions</p>
                    <p>{blockLength > 3 ? moment(blocks[3].timestamp*1000).fromNow() : 0}</p>
                  </div>
                  <div> Miner: {blockLength > 3 ? <a href={"/app/address/"+blocks[3].miner}>{blocks[3].miner}</a> : "Unknown"}</div>
                  <div> Reward: {blockLength > 3 ? blocks[3].gasUsed : "0"} XLG</div>
                </CardBody>
              </Card>
            </Colxx>



        </Row>
            </CardBody>
            </Card>



            <br/><br/>
            <Card>
            <CardBody>
            <CardTitle>
            Transactions
            <div className="float-right float-none-xs mt-2">
              <Button color="primary" size="sm" className="mb-2">
                View all Transactions <i className="iconsminds-arrow-out-right"/>
              </Button>
            </div>
            </CardTitle>
      <Row>
    <Colxx sm="12" className="mb-4">


        { !this.state.loading ? this.state.transactions.map((tx, i) => {
                   return <Row>
                    <Colxx xxs="12" key={tx.id}>
                      <Card className="card d-flex mb-3 side-bar-line-tx">
                        <div className="d-flex flex-grow-1 min-width-zero">
                        <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
                        <NavLink
                          to="#"
                          id={`toggler${i}`}
                          className="list-item-heading mb-0 truncate w-40 w-xs-100  mb-1 mt-1"
                        >

                        { " " }
                        <span className="align-middle d-inline-block color-theme-1">TX</span>
                      </NavLink>
                      <p className="mb-1 text-muted text-small w-15 w-xs-100 ">
                        <span className="color-theme-2"></span>
                      </p>
                      <p className="mb-1 text-muted text-small w-15 w-xs-100">
                        <a href={'/app/address/'+(tx.blockNumber)}>Block #{tx.blockNumber.toLocaleString()}</a>
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
                        <a href={'/app/tx/'+tx.hash}>{tx.hash}</a>
                        </p>
                        <p className="mb-0">
                        <p><a href={'/app/address/'+(tx.from)}>{tx.from}</a> <i className="iconsminds-arrow-out-right"/> <a href={'/app/address/'+(tx.to)}>{tx.to}</a></p>
                        </p>
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
                }) : ''
              }

    </Colxx>
    </Row>
    </CardBody>
    </Card>
  </Fragment>
    );
  }
}
