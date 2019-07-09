import React, { Component } from "react"
import { Redirect } from 'react-router-dom';
import {
  Input
} from "reactstrap";
class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      redirect: false,
      redirectTo: ''
    }
  }

  inputChange = (e) => {
    const { id, value } = e.currentTarget
    this.setState({ [id]:value })
    console.log(id, value)
  }

  handleSearchIconClick() {
    let {search} = this.state
    if(search.length <= 0) return;
    search = search.trim()
    if(search.length >= 64 && search.length <= 66) {
      this.setState({
        search: '',
        redirect: true,
        redirectTo: `/app/tx/${search}`
      })
    } else if(search.length >= 40 && search.length <=42) {
      this.setState({
        search: '',
        redirect: true,
        redirectTo: `/app/address/${search}`
      })
    } else if(Number.isInteger(+search)) {
      this.setState({
        search: '',
        redirect: true,
        redirectTo: `/app/block/${search}`
      })
    }
  }

  render() {

  const {markers} = this.state
    return (
      <div>
      { this.state.redirect ? <Redirect to={this.state.redirectTo}/> : null}
        <Input
          name="search"
          id="search"
          placeholder="Search by address, transaction hash"
          value={this.state.search}
          onChange={this.inputChange}
        />
        <span
          className="search-icon"
          onClick={e => this.handleSearchIconClick()}
        >
          <i className="simple-icon-magnifier" />
        </span>
      </div>
    )
  }
}

export default Search
