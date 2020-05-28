import React from "react";
import Flexmonster from "flexmonster";

export class Pivot extends React.Component {

	componentDidMount() {
		this.webdatarocks = new Flexmonster({
			...this.props,
			container: this.el,
			licenseKey: "Z7GC-XBDJ43-65471O-1X144W",
		});
		this.props.handleMount(this.webdatarocks);
	}

	componentWillUnmount() {
		this.webdatarocks.dispose();
		delete this.webdatarocks
	}

	render() {
		return <div style={this.props.style} ref={el => this.el = el}/>;
	}
}

export default Pivot;
