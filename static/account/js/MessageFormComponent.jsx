var React = require('react'),
    AccountStore = require('./AccountStore'),
    AccountActions = require('./AccountActions');


class MessageFormComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            opened: false
        };
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.getDisplayName = this.getDisplayName.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    getDisplayName() {
        return document.getElementById('account-display-name').innerHTML;
    }

    open() {
        this.setState({
            opened: true
        });
    }

    close() {
        this.setState({
            opened: false
        });
    }

    sendMessage() {
        let content = document.getElementById('message-input').value,
            toAccountId = AccountStore.AccountId;
        AccountActions.sendMessage(toAccountId, content);
        this.close();
    }

    render() {
        let defaultValue = 'Type your message here...',
            displayName = this.getDisplayName(),
            accountUrl = AccountStore.BaseUrl + '/people/' + AccountStore.AccountId + '/',
            messageFormClass = 'message-form' + (this.state.opened ? ' opened' : '');
        return (
            <div className="message-form-container">
                <button className="btn btn-info send-message-btn" onClick={this.open}>Send message</button>
                <div className={messageFormClass}>
                    <h4>Send message to <a href={accountUrl}>{displayName}</a></h4>
                    <textarea id="message-input" placeholder={defaultValue}></textarea>
                    <button className="btn btn-primary" onClick={this.sendMessage}>Send</button>
                    <button className="btn btn-default" onClick={this.close}>Cancel</button>
                </div>
            </div>
        );
    }

}


module.exports = MessageFormComponent;
