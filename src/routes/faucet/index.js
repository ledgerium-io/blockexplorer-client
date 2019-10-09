import React, { Component, Fragment } from "react";
import IntlMessages from "Util/IntlMessages";
import { Row, Card, CardBody,CardHeader, CardTitle, Table, Button, Jumbotron, Badge, FormGroup, Input, Label } from "reactstrap";

import { Colxx, Separator } from "Components/CustomBootstrap";
import BreadcrumbContainer from "Components/BreadcrumbContainer";
import { NavLink } from "react-router-dom";
import axios from 'axios'
import {connectedNetwork} from 'Constants/defaultValues'
import ReCAPTCHA from "react-google-recaptcha";
import Web3 from 'web3';
const web3 = new Web3(new Web3.providers.HttpProvider('http://testnet.ledgerium.net:8545/'));

export default class extends Component {

  constructor(props) {
    super(props)
    this.state = {
      validAddress: null,
      message: '',
      address: '',
      balance: '',
      requestAmount: 1,
      token: null,
      loading: false,
      receipt: null,

    }
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
      web3.eth.getBalance(address)
        .then(balance => {
          balance = web3.utils.fromWei(balance, 'ether')
          console.log(balance)
          this.setState({address, balance, validAddress: true})
        })
        .catch(()=>{
          this.setState({address, validAddress: true})
        })
    }
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
    if(!this.state.validAddress) return false;
    if(this.state.address.length <= 0) return false;
    if(!this.state.token) return false;
    if(this.state.requestAmount < 0 || this.state.requestAmount > 3) return false;
    return true;
  }

  submit = () => {
    this.setState({loading: true, receipt: null, message: ''});
    if(!this.passedChecks()) {
      return this.setState({loading: false});
    } else {
      const amount = parseInt(this.state.requestAmount)
      const address = this.state.address
      axios.post('http://testnet.ledgerium.net:5577/', {amount, address,})
        .then(response => {
          this.setState({loading: false, receipt: response.data.receipt, message: response.data.message});
          console.log(response.data)
        })
        .catch(error => {
          this.setState({loading: false});
          console.log(error)
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
               {this.state.receipt ? <a target="_blank" href={`/blockexplorer/tx/${this.state.receipt.transactionHash}`}> View Transaction <i className="simple-icon-login"/> </a> : null }
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
