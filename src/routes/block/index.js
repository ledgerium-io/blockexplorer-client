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
    axios.get(`http://localhost:2000/api/block/${this.props.match.params.block}`)
      .then(response => {
        if (response.data.data.number === 0) return;
        if (!response.data.success) return;
        this.setState({
          block: response.data.data,
          loading: false
        })
    })

  }


  render() {
    const block = this.state.block
    return (
      <Fragment>
        <div className="d-flex justify-content-between align-items-center">
        <h3>LEDGERIUM BLOCK EXPLORER</h3>
        <NavLink to="/app/blockexplorer">
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
                  Block Details
                  </CardTitle>
                  <br/>
                  <p><strong> Block Height: </strong> {block.number.toLocaleString()}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span> {block.transactions.length} Transactions </span>
                    <span> {block.size.toLocaleString()} bytes </span>
                    <span> {moment(block.timestamp*1000).fromNow()} </span>
                  </div>
                  <p></p>
                  <Table>
                    <tbody>
                      <tr><td>Hash</td><td>{block.hash}</td></tr>
                      <tr><td>Parent Hash</td><td><NavLink to={'/app/block/'+(block.number-1)}>{block.parentHash}</NavLink></td></tr>
                      <tr><td>Difficulty</td><td>{block.difficulty}</td></tr>
                      <tr><td>Total Difficulty</td><td>{block.totalDifficulty}</td></tr>
                      <tr><td>Nonce</td><td>{block.nonce}</td></tr>
                      <tr><td>Gas Used</td><td>{block.gasUsed.toLocaleString()}</td></tr>
                      <tr><td>Gas Limit</td><td>{block.gasLimit.toLocaleString()}</td></tr>

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
                    Miner
                  </CardTitle>
                  <NavLink to={"/app/address/"+block.miner}>{block.miner}</NavLink>
                  <div className="progress-bar-circle">
                  </div>
                </CardBody>
              </Card>
            </Colxx>
          </Row>


            { !this.state.loading ? this.state.block.transactions.map((tx, i) => {
                       return <Row>
                        <Colxx md="12" key={tx.id}>
                          <Card className="card d-flex mb-3 side-bar-line-tx">
                            <div className="d-flex flex-grow-1 min-width-zero">
                            <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
                            <NavLink
                              to="#"
                              id={`toggler${i}`}
                              className="list-item-heading mb-0 truncate w-40 w-xs-100  mb-1 mt-1"
                            >

                            { " " }
                            <span className="align-middle d-inline-block color-theme-1">Transaction</span>
                          </NavLink>
                          <p className="mb-1 text-muted text-small w-15 w-xs-100 ">
                            <span className="color-theme-2"></span>
                          </p>
                          <p className="mb-1 text-muted text-small w-15 w-xs-100">
                          </p>
                          <div className="w-15 w-xs-100">
                            <Badge pill>
                            </Badge>
                          </div>
                          </CardBody>
                          </div>
                          <div className="card-body pt-1">
                            <p className="mb-0">
                            <NavLink to={'/app/tx/'+tx}>{tx}</NavLink>
                            </p>
                            <p className="mb-0">
                            </p>
                            <br/>
                          </div>
                          </Card>
                        </Colxx>
                       </Row>
                    }) : '0 Transactions'
                  }





  </Fragment>
    );
  }
}
