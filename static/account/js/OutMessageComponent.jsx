var React = require('react'),
    AccountActions = require('./AccountActions');


class OutMessageComponent extends React.Component {

    constructor() {
        super();
        this.removeMessage = this.removeMessage.bind(this);
    }

    removeMessage() {
        AccountActions.removeMessage(this.props.data.id, 'outcoming');
    }

    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <a className="pull-right" onClick={this.removeMessage}>Remove</a>
                    <h4>{this.props.data.to_account.short_display_name}</h4>
                </div>
				<div className="panel-body">
                    <div className="clearfix"></div>
                    {this.props.data.content}
				</div>
			</div>
        );
    }

}

module.exports = OutMessageComponent;
