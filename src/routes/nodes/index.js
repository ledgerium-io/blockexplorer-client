import React, { Component, Fragment } from "react";
import { Row, Card, CardBody, Table, CardTitle, Button} from "reactstrap";
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

import { BarChart, Bar, YAxis, ReferenceLine } from 'recharts';
import RoundedBar from 'Components/RoundedBar';
import WorldMap from "Components/mapNodes";

export default class extends Component {

  constructor(props) {
    super(props)
    this.state = {
      connected: false,
      connecting: false,
      loading: false,
      data: [],
      geo: [],
      blockStats: {
        bestBlock: 0,
        lastBlockTime: Date.now(),
        avgBlockTime: 5000,
        minBlockTime: 5000,
        maxBlockTime: 5000,
        blockTimes: [{seconds: 5}],
        transactions: [{blockNumber: 0, transactions: 0}]
      }
    }
    this.listen()
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
    // API.get('/api/nodes')
    //   .then(response => {
    //     if(!response.data.success) return;
    //     this.setState({
    //       loading: false,
    //       data: response.data.data
    //     })
    //   })

  }

  componentWillUnmount () {
   global.serverSocket.off('nodeList', this.setNodeList)
   global.serverSocket.off('blockStats', this.setBlockStats)

 }

 listen = () => {
    global.serverSocket.on('nodeList', this.setNodeList)
    global.serverSocket.on('blockStats', this.setBlockStats)

  }

  setBlockStats = (blockStats) => {
    this.setState({
      blockStats
    })
  }

  setNodeList = (nodes) => {
    let data = []
    let geo = []
    Object.keys(nodes).forEach((node) => {
      data.push(nodes[node])
      geo.push({
        coordinates: nodes[node].geo.ll,
        name:  nodes[node].name
      })
    })
    this.setState({
      geo,
      data
    })
  }



  formatPing(latency) {
    if(latency <= 0) {
      return (<div className="good">0 ms</div>)
    } else if(latency <=100)  {
      return (<div className="good">{latency} ms</div>)
    } else if(latency <= 1000) {
      return (<div className="ok">{latency} ms</div>)
    } else {
      return (<div className="bad">{latency} ms</div>)
    }
  }

  formatUptime(uptime) {
    if(uptime >= 90) {
      return (<div className="good">{uptime}%</div>)
    } else if(uptime >= 80)  {
      return (<div className="ok">{uptime}%</div>)
    } else {
      return (<div className="bad">{uptime}%</div>)
    }
  }

  formatLastBlockTime(lastBlock) {
    const now = Date.now()
    const elapsed = now-lastBlock
    if(elapsed < 13000) {
      return (<div className="good">{moment(lastBlock).fromNow()}</div>)
    } else if (elapsed < 20000) {
      return (<div className="ok">{moment(lastBlock).fromNow()}</div>)
    } else {
      return (<div className="bad">{moment(lastBlock).fromNow()}</div>)
    }
  }

  formatLastBlock(lastBlock) {
    const difference = this.state.blockStats.bestBlock - lastBlock
    if( difference === 0) {
      return (<div className="good">#{lastBlock.toLocaleString()}</div>)
    } else if (difference < 3) {
      return (<div className="ok">#{lastBlock.toLocaleString()}</div>)
    } else {
      return (<div className="bad">#{lastBlock.toLocaleString()}</div>)

    }
  }

  formatPeers(peers) {
    if(peers <= 0) {
      return (<div className="bad">{peers}</div>)
    } else if(peers < 3) {
      return (<div className="ok">{peers}</div>)
    } else {
      return (<div className="good">{peers}</div>)

    }
  }

  render() {
    const RoundedBar = (props) => {
      const {fill, x, y, height} = props;

      return (
        <g>
          <rect id="Rectangle-3" x={x} y={y} width="4" height={height} fill={fill} rx="1"/>
          <rect id="Rectangle-3" x={x - 1} y="0" width="6" height="80" fill={fill} fillOpacity="0" rx="1"/>
        </g>
      );
    };

    const data = this.state.blockStats.blockTimes
    let min;
    let max;
    let avg;
    let minTX;
    let maxTX;
    let avgTX;
    min = this.state.blockStats.minBlockTime/1000
    max = this.state.blockStats.maxBlockTime/1000
    avg = this.state.blockStats.avgBlockTime
    minTX = this.state.blockStats.minTransactions
    maxTX = this.state.blockStats.maxTransactions
    avgTX = this.state.blockStats.avgTransactions
    return (
      <Fragment>

        <div className="d-flex justify-content-between align-items-center">
          <h3>LEDGERIUM NODE STATS</h3>
          <NavLink to="/blockexplorer">
          <Button color="primary" size="sm" className="mb-2">
            <i className="iconsminds-arrow-out-left"/> Go back
          </Button>
          </NavLink>
        </div>
        <Separator className="mb-5" />



        <Card>
          <CardBody>
            <Row>
              <Colxx sm="12" className="mb-4">


              <div className="d-flex justify-content-between align-items-center">

                <div className="d-flex justify-content-between align-items-center">

                  <div>
                    <span> Best block </span>
                    <h3> #{this.state.blockStats.bestBlock.toLocaleString()} </h3>
                    <br/>
                    <br/>
                    <span> Last Block </span>
                    <h3> {moment(this.state.blockStats.lastBlockTime).fromNow()}</h3>
                    <br/>
                    <span> Avg Block Time </span>
                    <h3> {(this.state.blockStats.avgBlockTime).toFixed(2)}s </h3>
                  </div>

                  <div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div> Max Block Time {(this.state.blockStats.maxBlockTime).toFixed(2)}s </div>
                      <div> Min Block Time {(this.state.blockStats.minBlockTime).toFixed(2)}s </div>
                    </div>
                    <br/>

                    <BarChart
                      width={400}
                      height={150}
                      data={this.state.blockStats.blockTimes}
                      margin={{
                        top: 0, right: 0, bottom: 0, left: 0,
                      }}
                      >
                      <Bar dataKey={'seconds'} minPointSize={1} isAnimationActive={false} fill="#145388" shape={<RoundedBar/>}/>}
                      <ReferenceLine y={avg} label="" stroke="#145388" />
                      <YAxis domain={[0, max]}/>}
                    </BarChart>

                  </div>
                </div>


                <div className="d-flex justify-content-between align-items-center">



                  <div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div> Max TXs  {(this.state.blockStats.maxTransactions)} </div>
                      <div> Min Txs {(this.state.blockStats.minTransactions)} </div>
                    </div>
                    <br/>

                    <BarChart
                      width={400}
                      height={150}
                      data={this.state.blockStats.transactionHistory}
                      margin={{
                        top: 0, right: 0, bottom: 0, left: 0,
                      }}
                      >
                      <Bar dataKey={'transactions'} minPointSize={1} allowDecimals={false} isAnimationActive={false} fill="#145388" shape={<RoundedBar/>}/>}
                      <ReferenceLine y={avgTX} label="" stroke="#145388" />
                      <YAxis domain={[0, maxTX]}/>}
                    </BarChart>

                  </div>
                </div>



                <div>
                  <WorldMap data={this.state.geo}/>
                </div>


              </div>


              </Colxx>
              </Row>
            </CardBody>
          </Card>


          <br/>
          <div className="d-flex justify-content-between align-items-center">
            <h3> Active Nodes: {this.state.data.length}/{this.state.data.length} </h3>
            <br/>
            <div> Last Miner
            <NavLink to={"/blockexplorer/adress/" + this.state.blockStats.lastBlockMiner}>
                {this.state.blockStats.lastBlockMiner}
            </NavLink>
            </div>
          </div>
          <Card>
            <CardBody>
            <Row>
            <Colxx>

              <Table>
                <thead>
                  <tr>
                    <th> Name </th>
                    <th> Type </th>
                    <th> Latency </th>
                    <th> Is mining </th>
                    <th> Peers </th>
                    <th> Last Block </th>
                    <th> Last Block TXs </th>
                    <th> Last Block time </th>
                    <th> Uptime </th>
                  </tr>
                </thead>
                <tbody>
                { !this.state.loading && this.state.data.length > 0 ? this.state.data.map((node, i ) => {
                  return (
                    <tr>
                      <td className="bolder"> {node.name} </td>
                      <td className="bolder"> {node.type} </td>
                      <td className="bolder"> {this.formatPing(node.ping)}</td>
                      <td className="bolder"> {node.isMining ? <div className="good">Yes</div> : <div className="bad">Yes</div>}</td>
                      <td className="bolder"> {this.formatPeers(node.peers)}</td>
                      <td className="bolder"> {this.formatLastBlock(node.lastBlockNumber)}</td>
                      <td className="bolder"> {node.lastBlockTransactions} </td>
                      <td className="bolder"> {this.formatLastBlockTime(node.lastRecievedBlock)} </td>
                      <td className="bolder"> {this.formatUptime(node.upTime)} </td>
                    </tr>
                  )
                }) : "" }
                </tbody>
              </Table>

              </Colxx>
           </Row>
          </CardBody>
        </Card>
        <br/>
        This page does not represent the entire state of the Ledgerium network - listing a node on this page is a voluntary process.

  </Fragment>
    );
  }
}
