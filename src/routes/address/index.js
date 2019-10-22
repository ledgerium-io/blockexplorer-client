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
import API from 'Components/API'

export default class extends Component {

  constructor(props) {
    super(props)
    this.state = {
      connected: false,
      loading: false,
      address: {
        address: '0x0000000000000000000000000000000000000000',
        balance: 0,
        blockNumber: 0,
        transactions: [],
        type: 0
      }
    }
  }

  componentWillMount() {
    API.get(`/api/address/${this.props.match.params.address}`)
      .then(response => {
        if (!response.data.success) return;
        this.setState({
          address: response.data.data,
          loading: false
        })
    })

  }


  render() {
    const address = this.state.address
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
                  Address Details
                  </CardTitle>
                  <br/>
                  <p><strong> {address.address}</strong> </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span> {address.transactions.length} Transactions Sent/Recieved </span>
                    <span> Last Balance Update Block #<NavLink to={"/blockexplorer/block/"+address.blockNumber}>{address.blockNumber.toLocaleString()} </NavLink></span>
                  </div>
                  <p></p>
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
                    Balance
                  </CardTitle>
                  {address.balance} XLG
                  <div className="progress-bar-circle">
                  </div>
                </CardBody>
              </Card>
            </Colxx>
          </Row>

          { !this.state.loading ? this.state.address.transactions.map((tx, i) => {
                     return <Row>
                      <Colxx md="12" key={i}>
                        <Card className="card d-flex mb-3 side-bar-line-tx">
                          <div className="d-flex flex-grow-1 min-width-zero">
                          <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
                          <NavLink
                            to="#"
                            className="list-item-heading mb-0 truncate w-40 w-xs-100  mb-1 mt-1"
                          >

                          { " " }
                          <span className="align-middle d-inline-block color-theme-1">Transaction</span>
                        </NavLink>
                        <p className="mb-1 text-muted text-small w-15 w-xs-100 ">
                          <span className="color-theme-2"></span>
                        </p>
                        <p className="mb-1 text-muted text-small w-15 w-xs-100">
                          Block #{<NavLink to={'/blockexplorer/block/'+tx.blockNumber}>{tx.blockNumber.toLocaleString()}</NavLink>}
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
                          <NavLink to={'/blockexplorer/tx/'+tx.hash}>{tx.hash}</NavLink>
                          </p>
                          <p className="mb-0">
                          <NavLink to={'/blockexplorer/address/'+(tx.from)}>{tx.from}</NavLink><i className="iconsminds-arrow-out-right"/><NavLink to={'/blockexplorer/address/'+(tx.to)}>{tx.to}</NavLink>
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
