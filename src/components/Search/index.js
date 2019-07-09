import React, { Component } from "react"

class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: []
    }
  }

  inputChange(e) {
    const { id, value } = e.currentTarget
    this.setState({ [id]:value })
  }

  search() {
    const {search} = this.state
    if(search.length >= 64 && search.length <= 66) {
      // Tx Hash
    } else if(search.length >= 40 && search.length <=42) {
      // Address
    } else if(Number.isInteger(+search)) {
      // Block
    }
  }

  render() {

  const {markers} = this.state
    return (
      <div>
        <Input
          name="search"
          id="search"
          placeholder="Search by address, transaction hash"
          value={this.state.search}
          onChange={this.inputChange}
        />
        <span
          className="search-icon"
          onClick={e => this.handleSearchIconClick(e)}
        >
          <i className="simple-icon-magnifier" />
        </span>
      </div>
    )
  }
}

export default Search
