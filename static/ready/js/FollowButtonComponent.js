'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react'),
    AccountStore = require('./AccountStore'),
    AccountActions = require('./AccountActions');

var FollowButtonComponent = (function (_React$Component) {
    _inherits(FollowButtonComponent, _React$Component);

    function FollowButtonComponent() {
        _classCallCheck(this, FollowButtonComponent);

        _get(Object.getPrototypeOf(FollowButtonComponent.prototype), 'constructor', this).call(this);
        this.state = {
            followings: AccountStore.FollowingData
        };
        this._onChange = this._onChange.bind(this);
        this.follow = this.follow.bind(this);
        this.stop_following = this.stop_following.bind(this);
        this.getIsFollowed = this.getIsFollowed.bind(this);
    }

    _createClass(FollowButtonComponent, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            AccountStore.addChangeListener(this._onChange);
        }
    }, {
        key: 'componentWillUnmout',
        value: function componentWillUnmout() {
            AccountStore.removeChangeListener(this._onChange);
        }
    }, {
        key: '_onChange',
        value: function _onChange() {
            this.setState({
                followings: AccountStore.FollowingData
            });
        }
    }, {
        key: 'follow',
        value: function follow() {
            console.log('Now executes follow.');
            AccountActions.follow(this.props.accountId);
        }
    }, {
        key: 'stop_following',
        value: function stop_following() {
            console.log('Now executes stop_following.');
            AccountActions.stop_following(this.props.accountId);
        }
    }, {
        key: 'getIsFollowed',
        value: function getIsFollowed() {
            var isFollowed = false,
                followings = this.state.followings;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = followings[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var elem = _step.value;

                    if (elem.id == this.props.accountId) {
                        isFollowed = true;
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator['return']) {
                        _iterator['return']();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return isFollowed;
        }
    }, {
        key: 'render',
        value: function render() {
            var isFollowed = this.getIsFollowed(),
                buttonText = isFollowed ? 'Stop following' : 'Follow',
                buttonClass = isFollowed ? 'stop-following' : 'follow',
                folFunc = isFollowed ? this.stop_following : this.follow;
            buttonClass = "btn " + buttonClass;
            return React.createElement("button", { className: buttonClass, onClick: folFunc }, buttonText);
        }
    }]);

    return FollowButtonComponent;
})(React.Component);

module.exports = FollowButtonComponent;