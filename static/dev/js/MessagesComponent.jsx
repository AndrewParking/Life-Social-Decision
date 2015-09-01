var React = require('react'),
    InMessageComponent = require('./InMessageComponent'),
    OutMessageComponent = require('./OutMessageComponent'),
    AccountStore = require('./AccountStore');


class MessagesComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            outcoming: AccountStore.OutcomingMessages,
            incoming: AccountStore.IncomingMessages,
            current: 'incoming'
        };
        this._onChange = this._onChange.bind(this);
        this.pickIncoming = this.pickIncoming.bind(this);
        this.pickOutcoming = this.pickOutcoming.bind(this);
    }

    componentDidMount() {
        AccountStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        AccountStore.removeChangeListener(this._onChange);
    }

    _onChange() {
        this.setState(prevState => {
            return {
                outcoming: AccountStore.OutcomingMessages,
                incoming: AccountStore.IncomingMessages,
                current: prevState.current
            }
        });
    }

    pickIncoming() {
        this.setState(prevState => {
            return {
                outcoming: prevState.outcoming,
                incoming: prevState.incoming,
                current: 'incoming'
            }
        });
    }

    pickOutcoming() {
        this.setState(prevState => {
            return {
                outcoming: prevState.outcoming,
                incoming: prevState.incoming,
                current: 'outcoming'
            }
        });
    }

    render() {
        let messages,
            btnInClass = this.state.current === 'incoming' ? 'success' : 'default',
            btnOutClass = this.state.current === 'outcoming' ? 'success' : 'default';
        btnInClass = 'btn btn-' + btnInClass;
        btnOutClass = 'btn btn-' + btnOutClass;
        if (this.state.current === 'incoming') {
            messages = this.state.incoming.map(message => {
                return <InMessageComponent data={message} key={message.id} />
            });
            console.log(messages);
        } else {
            messages = this.state.outcoming.map(message => {
                return <OutMessageComponent data={message} key={message.id} />
            });
            console.log(messages);
        }
        return (
            <div>
                <div>
                    <button className={btnInClass} onClick={this.pickIncoming}>
                        Incoming <span className="messages-counter">{this.state.incoming.length}</span>
                    </button>
                    <button className={btnOutClass} onClick={this.pickOutcoming}>
                        Outcoming <span className="messages-counter">{this.state.outcoming.length}</span>
                    </button>
                </div>
                <hr/>
                <div>
                    {messages}
                </div>
            </div>
        );
    }

}


module.exports = MessagesComponent;
