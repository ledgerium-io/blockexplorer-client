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
    API.get('/api/contracts')
      .then(response => {
        if(response.data.success) {
          let transactions = []
          for(let i=0; i<response.data.data.length; i++){
            transactions.push({
              address: response.data.data[i].address,

            })
          }
          console.log(transactions)
              this.setState({
                transactions,
                loading: false
              })
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
            Smart Contracts
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
          return <Row key={i}>
           <Colxx xxs="12">
             <Card className="card d-flex mb-3 side-bar-line-tx">
               <div className="d-flex flex-grow-1 min-width-zero">
               {tx.address}
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
