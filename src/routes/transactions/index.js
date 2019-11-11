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
const web3 = new Web3();
import API from 'Components/API'
import {addressType} from "Components/Functions"

export default class extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      transactions: [],
    }
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
    API.get('/api/transactions')
      .then(response => {
        if(response.data.success) {
          let promises = []
          let transactions = response.data.data
          for(let i=0; i<transactions.length; i++) {
            promises.push(addressType(transactions[i].to))
          }
          Promise.all(promises)
            .then(data => {
              for(let i=0; i<data.length; i++) {
                transactions[i].type = data[i] || ""
              }
              this.setState({
                transactions,
                loading: false
              })
            })
            .catch(console.log)

        }
      })
  }


  render() {
    const blocks = this.state.blocks
    return (
      <Fragment>
        <h3>LEDGERIUM BLOCK EXPLORER</h3>
        <Separator className="mb-5" />

            <Card>
            <CardBody>
            <CardTitle>
            Last 100 Transactions
            <div className="float-right float-none-xs mt-2">
            <NavLink to="/blockexplorer">
            <Button color="primary" size="sm" className="mb-2">
              <i className="iconsminds-arrow-out-left"/> Go back
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
               <span className="align-middle d-inline-block color-theme-1">{tx.type}</span>
             </NavLink>
             <p className="mb-1 text-muted text-small w-15 w-xs-100 ">
               <span className="color-theme-2"></span>
             </p>
             <p className="mb-1 text-muted text-small w-15 w-xs-100">
               <NavLink to={'/blockexplorer/block/'+tx.blockNumber}>Block #{tx.blockNumber.toLocaleString()}</NavLink>
             </p>

             </CardBody>
             </div>
             <div className="card-body pt-1">
               <p className="mb-0">
               <NavLink to={'/blockexplorer/tx/'+tx.hash}>{tx.hash}</NavLink>
               </p>
               <div className="mb-0">
               <p><NavLink to={'/blockexplorer/address/'+(tx.from)}>{tx.from}</NavLink> <i className="iconsminds-arrow-out-right"/> <NavLink to={'/blockexplorer/address/'+(tx.to)}>{tx.to}</NavLink></p>
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
