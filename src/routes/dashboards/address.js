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
      transactionsSent: 0,
      lastBalanceBlock: 0,
      balance: 0
      }
  }

  componentWillMount() {
    web3.eth.getBalance(this.props.match.params.address)
      .then(balance => {
        balance = web3.utils.fromWei(balance, 'ether')
        balance = balance.toLocaleString()
        this.setState({balance})
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
      <a href="/app/dashboards/blockexplorer">
      <Button color="primary" size="sm" className="mb-2">
        <i className="iconsminds-arrow-out-left"/> Go back
      </Button>
      </a>
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
                  Address Details
                  </CardTitle>
                  <br/>
                  <p><strong> {this.props.match.params.address}</strong></p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span> {this.state.transactionsSent} Transactions Sent </span>
                    <span> Last Balance Update Block #{this.state.lastBalanceBlock} </span>
                    <span></span>
                  </div>

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
                  {this.state.balance}
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
