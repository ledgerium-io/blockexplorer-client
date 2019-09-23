import React, { Component, Fragment } from "react";
import IntlMessages from "Util/IntlMessages";
import { Row, Card, CardBody,CardHeader, CardTitle, Table, Button, Jumbotron, Badge } from "reactstrap";

import { Colxx, Separator } from "Components/CustomBootstrap";
import BreadcrumbContainer from "Components/BreadcrumbContainer";
import io from 'socket.io-client';
import { NavLink } from "react-router-dom";
import Web3 from 'web3';
import API from 'Components/API'

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
        transactionType: "Public"
      },
    }
  }

  componentWillMount() {
    API.get(`/api/tx/${this.props.match.params.txn}`)
      .then(response => {
        if(!response.data.success) return
        this.setState({
          tx: response.data.data
        })
      })
      .catch(error => {
          console.log(error)
      })


  }


  render() {
    const tx = this.state.tx
    const timestamp = Date.now()
    return (
      <Fragment>
      <div className="d-flex justify-content-between align-items-center">
      <h3>LEDGERIUM BLOCK EXPLORER</h3>
      <NavLink to="/blockexplorer">
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
                  <p><strong> {tx.blockHash}</strong></p>
                  <p><NavLink to={'/blockexplorer/address/'+(tx.from)}>{tx.from}</NavLink> <i className="iconsminds-arrow-out-right"/> <NavLink to={'/blockexplorer/address/'+(tx.to)}>{tx.to}</NavLink></p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span> Transaction </span>
                    <span> Success </span>
                  </div>
                  <p></p>
                  <Table>
                    <tbody>
                      <tr><td>Block Number</td><td><NavLink to={'/blockexplorer/block/'+(tx.blockNumber)}>{tx.blockNumber.toLocaleString()}</NavLink></td></tr>
                      <tr><td>Nonce</td><td>{tx.nonce}</td></tr>
                      <tr><td>TX Fee</td><td>{tx.gasPrice}</td></tr>
                      <tr><td>v</td><td>{tx.v}</td></tr>
                      <tr><td>r</td><td>{tx.r}</td></tr>
                      <tr><td>s</td><td>{tx.s}</td></tr>
                    </tbody>
                  </Table>
                  <CardTitle className="mb-0">Raw input</CardTitle>
                  <br/>
                  {tx.input}
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
                    Tx Value
                  </CardTitle>
                  {tx.value} XLG
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
