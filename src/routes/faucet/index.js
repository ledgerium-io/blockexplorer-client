import React, { Component, Fragment } from "react";
import IntlMessages from "Util/IntlMessages";
import { Alert, Row, Card, CardBody,CardHeader, CardTitle, Table, Button, Jumbotron, Badge, FormGroup, Input, Label } from "reactstrap";

import { Colxx, Separator } from "Components/CustomBootstrap";
import BreadcrumbContainer from "Components/BreadcrumbContainer";
import { NavLink } from "react-router-dom";
import axios from 'axios'
import {connectedNetwork} from 'Constants/defaultValues'
import ReCAPTCHA from "react-google-recaptcha";
import Web3 from 'web3';
const web3 = new Web3();

export default class extends Component {

  constructor(props) {
    super(props)
    this.state = {
      validAddress: null,
      message: '',
      error: '',
      address: '',
      balance: '',
      requestAmount: 1,
      requestLimit: 3,
      token: null,
      loading: false,
      receipt: null,

    }
  }

  componentWillMount() {
    axios.get('faucetsvc/api/q')
      .then(response => {
        if(!response.data.success) return
        this.setState({
          requestLimit: response.data.data.limit
        })
      })
  }

  onAddressChange = (e) => {
    const address = e.target.value
    console.log(address)
    if(address === '') {
      return this.setState({address, validAddress: null})
    }
    if(!web3.utils.isAddress(address)) {
      return this.setState({address, validAddress: false})
    } else {
      this.setState({address, validAddress: true})
      this.getBalance(address)
    }
  }

  getBalance(address) {
    axios.get(`/faucetsvc/api/balance/${address}`)
        .then(response => {
          if(!response.data.success) return;
          const balance = response.data.data.balance
          this.setState({
            balance: web3.utils.fromWei(balance.toString(), "ether")
          })
        })
        .catch(console.log)
  }

  onRequestAmountChange = (e) => {
    const requestAmount = e.target.value
    console.log(requestAmount)
    this.setState({
      requestAmount
    })
  }

  onChange = (token) => {
    this.setState({
      token
    })
  }

  passedChecks = () => {
    if(!this.state.validAddress) {
      this.setState({error: 'Invalid Ledgerium address'})
      return false;
    }
    if(this.state.address.length <= 0) {
      this.setState({error: 'Invalid Ledgerium address'})
      return false;
    }
    if(!this.state.token) {
      this.setState({error: 'Complete reCaptcha before submitting'})
      return false;
    }
    if(this.state.requestAmount < 0 || this.state.requestAmount > 3) {
      this.setState({error: 'Invalid request amount'})
      return false;
    }
    return true;
  }

  submit = () => {
    this.setState({loading: true, receipt: null, message: '', error: ''});
    if(!this.passedChecks()) {
      return this.setState({loading: false});
    } else {
      const amount = parseInt(this.state.requestAmount)
      const address = this.state.address
      axios.post('/faucetsvc/api/', {amount, address,})
        .then(response => {
          this.setState({loading: false, receipt: response.data.data.receipt.data, message: <span>Transaction sent: <NavLink to={`/blockexplorer/tx/${response.data.data.receipt.data.transactionHash}`}>{response.data.data.receipt.data.transactionHash}</NavLink></span>});
          console.log(response.data)
        })
        .catch(error => {
          this.setState({loading: false});
          if(!error.response.data.success) {
            this.setState({
              error: error.response.data.message
            })
          }
        })
    }
  }

  render() {
    return (
      <Fragment>
      <Row>
        <Colxx md="3">
        </Colxx>
        <Colxx md="6">
          <Card>
            <CardBody>
            <div>
              <h3> {connectedNetwork.name} Faucet </h3>
              <Separator className="mb-5" />

              {this.state.error ? <Alert color="danger">{this.state.error}</Alert> : null}
              {this.state.message ? <Alert color="info">{this.state.message}</Alert> : null}
              {this.state.message || this.state.error ? null : <br/>}

              <FormGroup>
                <Label for="address"> Address {this.state.address.length>0 && this.state.validAddress ? <i className="simple-icon-check"/> : <i className="simple-icon-exclamation"/> }</Label>
                <Input type="text" id="address" value={this.state.address} onChange={this.onAddressChange}/>
              </FormGroup>

              {this.state.balance === "" ?  null : <div>Current Balance: {this.state.balance} XLG</div>}
              <br/>
              <FormGroup>
               <Label for="amount">Request XLG</Label>
               <Input type="select" name="select" id="amount" onChange={this.onRequestAmountChange}>
                 <option>1</option>
                 <option>2</option>
                 <option>3</option>
               </Input>
             </FormGroup>
             <br/>
             <div className="d-flex justify-content-between align-items-center">
             <ReCAPTCHA
              sitekey="6LckqzIUAAAAAOQtQAxFwCjtpilWmug5weMECc8U"
              onChange={this.onChange}
            />
             <Button
              color="primary"
              size="md"
              className="mb-2"
              onClick={this.submit}
              disabled={this.state.loading}
             >
            Submit
            </Button>
             </div>
             <br/>
               <div className="d-flex justify-content-center">
               {this.state.message ? this.state.message : null }
               </div>
               <div className="d-flex justify-content-center">
               {this.state.receipt ? <a target="_blank" href={`/blockexplorer/tx/${this.state.receipt.transactionHash}`}> View Transaction  </a> : null }
               </div>
             </div>
            </CardBody>

          </Card>

          <div className="d-flex justify-content-center ">
          <br/>
          Request limit: 3 XLG per 24 hours
          </div>

        </Colxx>
        <Colxx md="3">
        </Colxx>
      </Row>

    </Fragment>
      );
  }
}
