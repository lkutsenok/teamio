import React from "react";
import Webdatarocks from "webdatarocks";

export class Pivot extends React.Component {

	componentDidMount() {
		this.webdatarocks = new Webdatarocks({
			...this.props,
			container: this.el
		});
		this.props.handleMount(this.webdatarocks);
	}

	// shouldComponentUpdate() {
	// 	return false;
	// }

	componentWillUnmount() {
		this.webdatarocks.dispose();
	}

	render() {
		return <div ref={el => this.el = el}/>;
	}
}

export default Pivot;