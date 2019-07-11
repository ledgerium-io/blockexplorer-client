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

export default class extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      blocks: [],
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
    API.get('/api/blocks')
      .then(response => {
        if(response.data.success) {
            this.setState({
              blocks: response.data.data,
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
            Last 100 Blocks
            <div className="float-right float-none-xs mt-2">
            <NavLink to="/app/blockexplorer">
            <Button color="primary" size="sm" className="mb-2">
              <i className="iconsminds-arrow-out-left"/> Go back
            </Button>
            </NavLink>
            </div>
            </CardTitle>
      <Row>
    <Colxx sm="12" className="mb-4">


        { !this.state.loading ? this.state.blocks.map((block, i) => {
                   return <Row key={block.number}>
                    <Colxx xxs="12">
                    <Card>
                    <CardBody className="side-bar-line">
                        <CardTitle>
                          {<NavLink to={'/app/block/'+block.number}>{block.number.toLocaleString()}</NavLink>} <br/>
                        </CardTitle>
                        <div className="d-flex justify-content-between">
                          <p>{block.transactions.length} Transactions</p>
                          <p>{moment(block.timestamp*1000).fromNow()}</p>
                        </div>
                        <div> Miner: <NavLink to={"/app/address/"+block.miner}>{block.miner}</NavLink></div>
                        <div> Reward: {block.gasUsed} XLG</div>
                      </CardBody>
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
