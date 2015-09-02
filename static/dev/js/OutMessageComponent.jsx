var React = require('react'),
    baseUrl = require('./utils').baseUrl,
    AccountStore = require('./AccountStore'),
    AccountActions = require('./AccountActions');


class OutMessageComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            full: false
        };
        this.read = this.read.bind(this);
        this.removeMessage = this.removeMessage.bind(this);
        this.getContent = this.getContent.bind(this);
    }

    getContent() {
        if (!this.state.full && this.props.data.content.length > 70) {
            return this.props.data.content.substr(0,70) + '...';
        } else {
            return this.props.data.content;
        }
    }

    read() {
        this.setState(prevState => {
            return {
                full: !prevState.full
            }
        });
    }

    removeMessage() {
        AccountActions.removeMessage(this.props.data.id, 'outcoming');
    }

    render() {
        let messageClass =`panel panel-default ${this.props.data.read ? '' : ' unread'}`,
            contentClass = 'message-content' + (this.state.full ? ' full' : ''),
            personUrl = baseUrl + '/people/' + this.props.data.to_account.id + '/',
            content = this.getContent();
        return (
            <div className={messageClass}>
                <div className="panel-heading">
                    <a className="pull-right" onClick={this.removeMessage}>Remove</a>
                    <h4>
                        To: <a className="message-author" href={personUrl}>{this.props.data.to_account.short_display_name}</a>
                    </h4>
                </div>
				<div className="panel-body">
                    <div className="clearfix"></div>
                    <div className={contentClass}>{content}</div>
                    <a className="read-link" onClick={this.read}>Show full</a>
				</div>
			</div>
        );
    }

}

module.exports = OutMessageComponent;
