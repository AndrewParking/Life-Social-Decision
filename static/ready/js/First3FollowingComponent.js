'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react'),
    AccountStore = require('./AccountStore'),
    AccountActions = require('./AccountActions');

var First3FollowingComponent = (function (_React$Component) {
    _inherits(First3FollowingComponent, _React$Component);

    function First3FollowingComponent() {
        _classCallCheck(this, First3FollowingComponent);

        _get(Object.getPrototypeOf(First3FollowingComponent.prototype), 'constructor', this).call(this);
        this.state = {
            following: AccountStore.First3Following
        };
        this._onChange = this._onChange.bind(this);
    }

    _createClass(First3FollowingComponent, [{
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
            this.setState({
                following: AccountStore.First3Following
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this = this;

            var following_list = this.state.following.map(function (account) {
                var url = _this.props.baseUrl + '/people/' + account.id + '/';
                return React.createElement("div", { className: "small-fol", key: account.id }, React.createElement("img", { src: account.photo }), React.createElement("a", { href: url }, account.short_display_name));
            });
            return React.createElement("div", null, following_list);
        }
    }]);

    return First3FollowingComponent;
})(React.Component);

module.exports = First3FollowingComponent;