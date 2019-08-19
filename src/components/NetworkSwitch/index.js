import React, { Component } from "react"
import { Redirect } from 'react-router-dom';
import {networks, connectedNetwork, originalNetworkCount} from 'Constants/defaultValues'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ModalHeader,
  ModalBody,
  Form,
  Input,
  Button,
  ModalFooter,
  Modal,
  Label,
  FormGroup,
  FormText
} from "reactstrap";
import { Separator } from "Components/CustomBootstrap";

class NetworkSwitch extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: false,
      customNetworkName: '',
      customNetworkURL: '',
      customNetworkError: '',
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
    const expectedURLCharacters = ['http', "://", ":"]
    const {customNetworkName, customNetworkURL} = this.state
    if(customNetworkName === "" || customNetworkURL === "") return this.setState({customNetworkError: "Both fields are required"})
    for(let i=0; i<expectedURLCharacters.length; i++) {
      if(!customNetworkURL.includes(expectedURLCharacters[i])) return this.setState({customNetworkError: "Valid URL required"})
    }
    const network = {
      id: networks.length+1,
      name: customNetworkName,
      url: customNetworkURL
    }

    localStorage.setItem('network', JSON.stringify(network))
    if(localStorage.getItem('customNetworks')) {
      let customNetworks = JSON.parse(localStorage.getItem('customNetworks'))
      customNetworks.push(network)
      localStorage.setItem('customNetworks', JSON.stringify(customNetworks))
    } else {
      localStorage.setItem('customNetworks', JSON.stringify([network]))
    }
    location.reload(true);

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

  deleteCustomNetwork = () => {
    localStorage.removeItem('customNetworks')
    location.reload(true);
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  inputChange = (e) => {
    const {name, value} = e.currentTarget
    console.log(value)
    this.setState({
      [name]: value,
      customNetworkError: ''
    })
  }

  render() {
    return (
      <div>
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>
          Custom host
        </ModalHeader>
        <Form onSubmit={this.addNetwork}>
        <ModalBody>
            {this.state.customNetworkError}
            <br/><br/>
            <FormGroup>
              <Label for="customNetworkName">
                Name
              </Label>
              <Input
                value={this.state.customNetworkName}
                type="text"
                name="customNetworkName"
                onChange={this.inputChange}
                placeholder="Network Name"
              />
            </FormGroup>

            <FormGroup>
              <Label for="customNetworkURL">
                URL
              </Label>
              <Input
                value={this.state.customNetworkURL}
                type="text"
                name="customNetworkURL"
                onChange={this.inputChange}
                placeholder="Network URL"
              />
              <FormText color="muted">
                Example: http://testnet.ledgerium.net:2002
              </FormText>
            </FormGroup>


        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.toggle}>
            Cancel
          </Button>{" "}
          <Button color="secondary" onClick={this.addNetwork}>
            Connect
          </Button>
        </ModalFooter>
        </Form>
      </Modal>
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
              {network.name}
            </DropdownItem>)
          })}
          <Separator/><Separator/>
            <DropdownItem onClick={this.toggle}>
            Custom host
            </DropdownItem>
            {networks.length > originalNetworkCount ?
              <DropdownItem onClick={this.deleteCustomNetwork}>
              Clear Custom Hosts
              </DropdownItem>
             : null}
        </DropdownMenu>
      </UncontrolledDropdown>
      </div>
    )
  }
}

export default NetworkSwitch
