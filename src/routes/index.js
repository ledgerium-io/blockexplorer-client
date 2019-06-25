import React, { Component } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';

import TopNav from 'Containers/TopNav'
import Sidebar from 'Containers/Sidebar';

import blockexplorer from './blockexplorer';
import block from './block';
import blocks from './blocks';
import transaction from './transaction';
import transactions from './transactions'
import address from './address';
import nodes from './nodes';

import { connect } from 'react-redux';

class MainApp extends Component {
	render() {
		const { match, containerClassnames} = this.props;
		return (
			<div id="app-container" className={containerClassnames}>
				<TopNav history={this.props.history} />
				<Sidebar/>
				<main>
					<div className="container-fluid">
						<Switch>
							<Route path={`${match.url}/blockexplorer`} exact component={blockexplorer} />
							<Route path={`${match.url}/block/:block`} component={block} />
							<Route path={`${match.url}/blocks`} component={blocks} />
							<Route path={`${match.url}/tx/:txn`} component={transaction} />
							<Route path={`${match.url}/transactions`} component={transactions} />
							<Route path={`${match.url}/address/:address`} component={address} />
							<Route path={`${match.url}/nodes`} component={nodes} />
							<Redirect to="/app/blockexplorer" />
						</Switch>
					</div>
				</main>
			</div>
		);
	}
}
const mapStateToProps = ({ menu }) => {
	const { containerClassnames} = menu;
	return { containerClassnames };
  }

export default withRouter(connect(mapStateToProps, {})(MainApp));
