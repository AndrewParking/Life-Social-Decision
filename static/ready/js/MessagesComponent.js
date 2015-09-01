'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react'),
    InMessageComponent = require('./InMessageComponent'),
    OutMessageComponent = require('./OutMessageComponent'),
    AccountStore = require('./AccountStore');

var MessagesComponent = (function (_React$Component) {
    _inherits(MessagesComponent, _React$Component);

    function MessagesComponent() {
        _classCallCheck(this, MessagesComponent);

        _get(Object.getPrototypeOf(MessagesComponent.prototype), 'constructor', this).call(this);
        this.state = {
            outcoming: AccountStore.OutcomingMessages,
            incoming: AccountStore.IncomingMessages,
            current: 'incoming'
        };
        this._onChange = this._onChange.bind(this);
        this.pickIncoming = this.pickIncoming.bind(this);
        this.pickOutcoming = this.pickOutcoming.bind(this);
    }

    _createClass(MessagesComponent, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            AccountStore.addChangeListener(this._onChange);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            AccountStore.removeChangeListener(this._onChange);
        }
    }, {
        key: '_onChange',
        value: function _onChange() {
            this.setState(function (prevState) {
                return {
                    outcoming: AccountStore.OutcomingMessages,
                    incoming: AccountStore.IncomingMessages,
                    current: prevState.current
                };
            });
        }
    }, {
        key: 'pickIncoming',
        value: function pickIncoming() {
            this.setState(function (prevState) {
                return {
                    outcoming: prevState.outcoming,
                    incoming: prevState.incoming,
                    current: 'incoming'
                };
            });
        }
    }, {
        key: 'pickOutcoming',
        value: function pickOutcoming() {
            this.setState(function (prevState) {
                return {
                    outcoming: prevState.outcoming,
                    incoming: prevState.incoming,
                    current: 'outcoming'
                };
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var messages = undefined,
                btnInClass = this.state.current === 'incoming' ? 'success' : 'default',
                btnOutClass = this.state.current === 'outcoming' ? 'success' : 'default';
            btnInClass = 'btn btn-' + btnInClass;
            btnOutClass = 'btn btn-' + btnOutClass;
            if (this.state.current === 'incoming') {
                messages = this.state.incoming.map(function (message) {
                    return React.createElement(InMessageComponent, { data: message, key: message.id });
                });
                console.log(messages);
            } else {
                messages = this.state.outcoming.map(function (message) {
                    return React.createElement(OutMessageComponent, { data: message, key: message.id });
                });
                console.log(messages);
            }
            return React.createElement("div", null, React.createElement("div", null, React.createElement("button", { className: btnInClass, onClick: this.pickIncoming }, "Incoming ", React.createElement("span", { className: "messages-counter" }, this.state.incoming.length)), React.createElement("button", { className: btnOutClass, onClick: this.pickOutcoming }, "Outcoming ", React.createElement("span", { className: "messages-counter" }, this.state.outcoming.length))), React.createElement("hr", null), React.createElement("div", null, messages));
        }
    }]);

    return MessagesComponent;
})(React.Component);

module.exports = MessagesComponent;