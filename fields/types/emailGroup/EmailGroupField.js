/**
 * TODO:
 * - Custom path support
 */

var _ = require('underscore'),
	React = require('react'),
	Field = require('../Field'),
	Note = require('../../components/Note');

module.exports = Field.create({
	
	displayName: 'EmailGroupField',
	
	getInitialState: function() {
		return {
			collapsedFields: {},
			sendEmail:false
		};
	},
	
	componentWillMount: function() {
		
		var collapsedFields = {};
				
		this.setState({
			collapsedFields: collapsedFields
		});
		
	},
	
	componentDidUpdate: function(prevProps, prevState) {
		if (prevState.fieldsCollapsed && !this.state.fieldsCollapsed) {
			this.refs.number.getDOMNode().focus();
		}
	},
	
	shouldCollapse: function() {
		return true;
	},
	
	uncollapseFields: function() {
		this.setState({
			collapsedFields: {}
		});
	},
	
	fieldChanged: function(path, event) {
		var value = this.props.value;
		value[path] = event.target.value;
		this.props.onChange({
			path: this.props.path,
			value: value
		});
	},

	checkboxChanged: function(path, event) {
		var value = this.props.value;
		value[path] = event.target.checked;
		this.props.onChange({
			path: this.props.path,
			value: value
		});
		this.setState({sendEmail: event.target.checked});
	},

	formatValue: function() {
		return _.compact([
			this.props.value.emailSubject,
			this.props.value.emailBody
		]).join(', ');
	},

	renderField: function(path, label, collapse) {
		
		if (this.state.collapsedFields[path]) {
			return null;
		}
		
		return (
			<div className="row">
				<div className="col-sm-2 location-field-label">
					<label className="text-muted">{label}</label>
				</div>
				<div className="col-sm-10 col-md-7 col-lg-6 location-field-controls">
					<input type="text" name={this.props.path + '.' + path} ref={path} value={this.props.value[path]} onChange={this.fieldChanged.bind(this, path)} className="form-control" />
				</div>
			</div>
		);
		
	},

	renderCheckbox: function(path, label, collapse) {

		return (
			<div className="row">
				<div className="col-sm-2 location-field-label">
					<label className="text-muted">{label}</label>
				</div>
				<div className="col-sm-10 col-md-7 col-lg-6 location-field-controls">
					<input type="checkbox" name={this.props.path + '.' + path} ref={path} checked={this.state.sendEmail || this.props.value[path] }  onClick={this.checkboxChanged.bind(this, path)} />
				</div>
			</div>
		);

	},
	
	renderUI: function() {
		
		return <div className="field field-type-location">
			<div className="field-ui">
				<label>{this.props.label}</label>
				{this.renderCheckbox('sendEmail', 'Send Email')}
				{this.renderField('emailSubject', 'Email Subject')}
				{this.renderField('emailBody', 'Email Body')}
			</div>
		</div>;
		
	}
	
});
