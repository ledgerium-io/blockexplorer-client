import React, { Component } from "react"
import { Redirect } from 'react-router-dom';
import {networks, connectedNetwork} from 'Constants/defaultValues'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      connected: false
    }
  }

  componentWillMount() {
    this.listen()
  }

  connect = () => {
  this.setState({
    connected: true
  })
  }

  disconnect = () => {
    this.setState({
      connected: false
    })
  }

  listen = () => {
    const self = this
    if(global.serverSocket) {
      global.serverSocket.on('connect', this.connect)
      global.serverSocket.on('disconnect', this.disconnect)
      if(global.serverSocket.connected) {
        this.connect()
      }
    } else {
      setTimeout(() => {
        this.listen()
      },1000)
    }
  }

  componentWillUnmount () {
    global.serverSocket.off('connect', this.connect)
    global.serverSocket.off('disconnect', this.disconnect)
  }

  addNetwork = () => {

  }

  switchNetwork = (name, url) => {
    if(!name || !url) return;
    const network = JSON.stringify({
      name,
      url
    })
    localStorage.setItem('network', network)
    location.reload(true);
  }

  render() {
    return (
      <UncontrolledDropdown className="ml-2">
        <DropdownToggle
          caret
          color="light"
          size="sm"
          className="language-button"
        >
          <span className="name">{connectedNetwork.name} {this.state.connected ? <i className="simple-icon-check"/> : <i className="simple-icon-exclamation"/> }</span>
        </DropdownToggle>
        <DropdownMenu className="mt-3" right>
          {networks.map( (network, i) => {
            return(<DropdownItem onClick={()=>{this.switchNetwork(network.name, network.url)}} key={network+i}>
              <span >{network.name}</span>
            </DropdownItem>)
          })}
            <DropdownItem>
            Custom host
            </DropdownItem>

        </DropdownMenu>
      </UncontrolledDropdown>
    )
  }
}

export default Search
