var React = require('react'),
    AccountStore = require('./AccountStore');


class MessageCounterComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            count: AccountStore.UnreadMessagesCount
        }
        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        AccountStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        AccountStore.removeChangeListener(this._onChange);
    }

    _onChange() {
        this.setState({
            count: AccountStore.UnreadMessagesCount
        });
    }

    render() {
        console.log(this.state.count);
        return (
            <div>
                Messages <span className="messages-count">{this.state.count}</span>
            </div>
        );
    }

}


module.exports = MessageCounterComponent;
