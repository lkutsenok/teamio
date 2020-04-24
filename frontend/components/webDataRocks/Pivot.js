import React from "react";
import Flexmonster from "flexmonster";

export class Pivot extends React.Component {

	componentDidMount() {
		this.webdatarocks = new Flexmonster({
			...this.props,
			container: this.el,
			licenseKey: "Z709-X9711G-1S0132-293E23",
		});
		this.props.handleMount(this.webdatarocks);
	}

	componentWillUnmount() {
		this.webdatarocks.dispose();
	}

	render() {
		return <div ref={el => this.el = el}/>;
	}
}

export default Pivot;
