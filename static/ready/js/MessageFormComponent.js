'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react'),
    baseUrl = require('./utils').baseUrl,
    accountId = require('./utils').accountId,
    AccountStore = require('./AccountStore'),
    AccountActions = require('./AccountActions');

var MessageFormComponent = (function (_React$Component) {
    _inherits(MessageFormComponent, _React$Component);

    function MessageFormComponent() {
        _classCallCheck(this, MessageFormComponent);

        _get(Object.getPrototypeOf(MessageFormComponent.prototype), 'constructor', this).call(this);
        this.state = {
            opened: false
        };
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.getDisplayName = this.getDisplayName.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    _createClass(MessageFormComponent, [{
        key: 'getDisplayName',
        value: function getDisplayName() {
            return document.getElementById('account-display-name').innerHTML;
        }
    }, {
        key: 'open',
        value: function open() {
            this.setState({
                opened: true
            });
        }
    }, {
        key: 'close',
        value: function close() {
            this.setState({
                opened: false
            });
        }
    }, {
        key: 'sendMessage',
        value: function sendMessage() {
            var content = document.getElementById('message-input').value;
            AccountActions.sendMessage(accountId, content);
            this.close();
        }
    }, {
        key: 'render',
        value: function render() {
            var defaultValue = 'Type your message here...',
                displayName = this.getDisplayName(),
                accountUrl = baseUrl + '/people/' + accountId + '/',
                messageFormClass = 'message-form' + (this.state.opened ? ' opened' : '');
            return React.createElement("div", { className: "message-form-container" }, React.createElement("button", { className: "btn btn-info send-message-btn", onClick: this.open }, "Send message"), React.createElement("div", { className: messageFormClass }, React.createElement("h4", null, "Send message to ", React.createElement("a", { href: accountUrl }, displayName)), React.createElement("textarea", { id: "message-input", placeholder: defaultValue }), React.createElement("button", { className: "btn btn-primary", onClick: this.sendMessage }, "Send"), React.createElement("button", { className: "btn btn-default", onClick: this.close }, "Cancel")));
        }
    }]);

    return MessageFormComponent;
})(React.Component);

module.exports = MessageFormComponent;