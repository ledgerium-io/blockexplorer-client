import React, { Component, Fragment } from "react";
import IntlMessages from "Util/IntlMessages";
import { Row, Card, CardBody,CardHeader, CardTitle, Table, Button, Jumbotron, Badge } from "reactstrap";
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
      tx: {
        blockHash: "",
        blockNumber: 0,
        from: "",
        gas: 0,
        gasPrice: 0,
        hash: "",
        input: "",
        nonce: 0,
        to: "",
        transactionIndex: 0,
        value: 0,
        v: "",
        r: "",
        s: "",
        transactionType: "Public",
        TimeElapsed: 1560225937
      },
      block: {
        number: 0,
        hash: "",
        parentHash: "",
        nonce: "",
        sha3Uncles: "",
        logsBloom: "",
        transactionsRoot: "",
        stateRoot: "",
        miner: "",
        difficulty: 0,
        totalDifficulty: 0,
        extraData: "",
        size: 0,
        gasLimit: 0,
        gasUsed: 0,
        timestamp: 0,
        transactions: [ ],
        uncles: null,
        TimeElapsed: 1560219399
      }
    }
  }

  componentWillMount() {
    axios.get(`http://testnet.ledgerium.net:9999/txn/${this.props.match.params.txn}`)
      .then(response => {
        if (response.data.blockNumber === 0) return;
        this.setState({
          tx: response.data,
          loading: false
        })
        axios.get(`http://testnet.ledgerium.net:9999/block/${response.blockNumber}`)
          .then(result => {
            console.log(result.data)
            this.setState({
              block: result.data
            })
          })

    })

  }


  render() {
    const tx = this.state.tx
    const block = this.state.block
    const timestamp = Date.now()
    return (
      <Fragment>
      <div className="d-flex justify-content-between align-items-center">
      <h3>LEDGERIUM BLOCK EXPLORER</h3>
      <NavLink to="/app/dashboards/blockexplorer">
      <Button color="primary" size="sm" className="mb-2">
        <i className="iconsminds-arrow-out-left"/> Go back
      </Button>
      </NavLink>
      </div>
        <Separator className="mb-5" />

        <Row>
          <Colxx md="7" className="mb-4">
              <Card>
                <CardHeader className="p-0 position-relative">
                  <div className="position-absolute handle card-icon">
                    <i className="simple-icon-shuffle" />
                  </div>
                </CardHeader>
                <CardBody>
                  <CardTitle className="mb-0">
                  Transaction Details
                  </CardTitle>
                  <br/>
                  <p><strong> {tx.hash}</strong></p>
                  <p><NavLink to={'/app/dashboards/blockexplorer/address/'+(tx.from)}>{tx.from}</NavLink> <i className="iconsminds-arrow-out-right"/> <NavLink to={'/app/dashboards/blockexplorer/address/'+(tx.to)}>{tx.to}</NavLink></p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span> Transaction </span>
                    <span> Success </span>
                    <span> {moment(block.timestamp*1000).fromNow()} </span>
                  </div>
                  <p></p>
                  <Table>
                    <tbody>
                      <tr><td>Block Number</td><td><NavLink to={'/app/dashboards/blockexplorer/block/'+(tx.blockNumber)}>{tx.blockNumber}</NavLink></td></tr>
                      <tr><td>Nonce</td><td>{tx.nonce}</td></tr>
                      <tr><td>TX Fee</td><td>{tx.gasPrice}</td></tr>

                    </tbody>
                  </Table>


                  <div className="progress-bar-circle">
                  </div>
                </CardBody>
              </Card>
            </Colxx>
            <Colxx md="5"className="mb-4">
              <Card>
                <CardHeader className="p-0 position-relative">
                  <div className="position-absolute handle card-icon">
                    <i className="simple-icon-shuffle" />
                  </div>
                </CardHeader>
                <CardBody className="d-flex justify-content-between align-items-center">
                  <CardTitle className="mb-0">
                    XLG Value
                  </CardTitle>
                  {tx.value}
                  <div className="progress-bar-circle">
                  </div>
                </CardBody>
              </Card>
            </Colxx>
          </Row>
  </Fragment>
    );
  }
}
