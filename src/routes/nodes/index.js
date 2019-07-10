import React, { Component, Fragment } from "react";
import IntlMessages from "Util/IntlMessages";
import { Row, Card, CardBody,CardHeader, Table, CardTitle, Button, Jumbotron, Badge } from "reactstrap";
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

export default class extends Component {

  constructor(props) {
    super(props)
    this.state = {
      connected: false,
      connecting: false,
      loading: true,
      data: []
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
    API.get('/api/nodes')
      .then(response => {
        if(!response.data.success) return;
        this.setState({
          loading: false,
          data: response.data.data
        })
      })

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

    socket.on('retry', () => {
      self.setState({
        connected: false,
        connecting: true
      })
    })


  }

  render() {
    return (
      <Fragment>
        <h3>LEDGERIUM BLOCK EXPLORER</h3>
        <Separator className="mb-5" />


        <Card>
          <CardBody>
            <Row>
              <Colxx sm="12" className="mb-4">
              <div className="d-flex justify-content-between align-items-center">
              <h3> Active Nodes: {this.state.data.length}/{this.state.data.length} </h3>
              <NavLink to="/app/blockexplorer">
              <Button color="primary" size="sm" className="mb-2">
                <i className="iconsminds-arrow-out-left"/> Go back
              </Button>
              </NavLink>
              </div>
              <Table>
                <thead>
                  <tr>
                    <th> Node Name </th>
                    <th> Node Type </th>
                    <th> Node Latency </th>
                    <th> Network Port </th>
                    <th> Node Peers </th>
                    <th> Last Block </th>
                    <th> Difficulty </th>
                    <th> Last Block Time </th>
                    <th> Uptime </th>
                  </tr>
                </thead>
                <tbody>
                { !this.state.loading && this.state.data.length > 0 ? this.state.data.map((node, i ) => {
                  return (
                    <tr>
                      <td> {node.name.split('/')[1]} </td>
                      <td> {node.name} </td>
                      <td> 0 ms</td>
                      <td> {node.network.remoteAddress.split(':')[1]}</td>
                      <td> {this.state.data.length}</td>
                      <td> #{(node.protocols.istanbul.difficulty-1).toLocaleString()}</td>
                      <td> {node.protocols.istanbul.difficulty} </td>
                      <td> {moment(Date.now()).fromNow()} </td>
                      <td> 100% </td>
                    </tr>
                  )
                }) : "" }
                </tbody>
              </Table>
              This page does not represent the entire state of the Ledgerium network - listing a node on this page is a voluntary process.

              </Colxx>
           </Row>
          </CardBody>
        </Card>
  </Fragment>
    );
  }
}
