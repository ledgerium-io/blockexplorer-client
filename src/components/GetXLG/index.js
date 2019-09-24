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
  FormText,
  NavLink
} from "reactstrap";
import { Separator } from "Components/CustomBootstrap";

class GetXLG extends Component {
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




  render() {
    return (
      <div>
      <UncontrolledDropdown className="ml-2">
        <DropdownToggle
          caret
          color="light"
          size="sm"
          className="language-button"
        >
        Get XLG
        </DropdownToggle>
        <DropdownMenu className="mt-3" right>
        {connectedNetwork.name == "Ledgerium Mainnet" ?
          <div>
            <a target="_blank" href="https://idex.market/eth/xlg">
              <DropdownItem>
              ACX <i className="simple-icon-login"/>
              </DropdownItem>
            </a>
            <a target="_blank" href="https://acx.io/markets/xlgbtc">
              <DropdownItem>
              IDEX <i className="simple-icon-login"/>
              </DropdownItem>
            </a>
          </div>
        :

          <div>
            <a target="_blank" href="/app/faucet">
              <DropdownItem>
                Faucet
              </DropdownItem>
            </a>
          </div>
        }

        </DropdownMenu>
      </UncontrolledDropdown>
      </div>
    )
  }
}

export default GetXLG
