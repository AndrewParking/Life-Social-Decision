'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AppDispatcher = require('./AppDispatcher'),
    AccountConstants = require('./AccountConstants'),
    EventEmitter = require('events').EventEmitter,
    jQuery = require('jquery'),
    _ = require('underscore');

var _get_foreign_decisions = require('./XHRequest')._get_foreign_decisions,
    _get_own_decisions = require('./XHRequest')._get_own_decisions,
    _get_votes = require('./XHRequest')._get_votes,
    _create_decision_xhr = require('./XHRequest')._create_decision_xhr,
    _delete_decision_xhr = require('./XHRequest')._delete_decision_xhr,
    _vote_xhr = require('./XHRequest')._vote_xhr,
    _cancel_vote_xhr = require('./XHRequest')._cancel_vote_xhr,
    _get_following_data = require('./XHRequest')._get_following_data,
    _send_remove_message_xhr = require('./XHRequest')._send_remove_message_xhr,
    _send_read_message_xhr = require('./XHRequest')._send_read_message_xhr,
    _send_message_xhr = require('./XHRequest')._send_message_xhr,
    _send_follow_xhr = require('./XHRequest')._send_follow_xhr,
    _send_stop_following_xhr = require('./XHRequest')._send_stop_following_xhr;

var csrftoken = require('./utils').csrftoken;

var _votes = [],
    _following = [],
    _decisions = [],
    _own_decisions = [],
    _incoming_messages = [],
    _outcoming_messages = [];

// ========== Account Store Class definition ============

var AccountStoreClass = (function (_EventEmitter) {
    _inherits(AccountStoreClass, _EventEmitter);

    function AccountStoreClass() {
        _classCallCheck(this, AccountStoreClass);

        _get(Object.getPrototypeOf(AccountStoreClass.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(AccountStoreClass, [{
        key: 'emitChange',
        value: function emitChange() {
            this.emit('change');
        }
    }, {
        key: 'addChangeListener',
        value: function addChangeListener(callback) {
            this.on('change', callback);
        }
    }, {
        key: 'removeChangeListener',
        value: function removeChangeListener(callback) {
            this.removeChangeListener('change', callback);
        }
    }, {
        key: 'Decisions',
        get: function get() {
            return _decisions;
        },
        set: function set(newValue) {
            _decisions = newValue;
        }
    }, {
        key: 'Votes',
        get: function get() {
            return _votes;
        },
        set: function set(newValue) {
            _votes = newValue;
        }
    }, {
        key: 'OwnDecisions',
        get: function get() {
            return _own_decisions;
        },
        set: function set(newValue) {
            _own_decisions = newValue;
        }
    }, {
        key: 'FollowingData',
        get: function get() {
            return _following;
        },
        set: function set(newValue) {
            _following = newValue;
        }
    }, {
        key: 'First3Following',
        get: function get() {
            if (_following.length > 3) {
                return _following.slice(-3).reverse();
            } else {
                return _following.reverse();
            }
        }
    }, {
        key: 'IncomingMessages',
        get: function get() {
            return _incoming_messages;
        },
        set: function set(newValue) {
            _incoming_messages = newValue;
        }
    }, {
        key: 'OutcomingMessages',
        get: function get() {
            return _outcoming_messages;
        },
        set: function set(newValue) {
            _outcoming_messages = newValue;
        }
    }, {
        key: 'UnreadMessagesCount',
        get: function get() {
            var counter = 0;
            console.log(_incoming_messages);
            for (var i in _incoming_messages) {
                if (!_incoming_messages[i].read) {
                    counter++;
                }
            }
            return counter;
        }
    }]);

    return AccountStoreClass;
})(EventEmitter);

var AccountStore = new AccountStoreClass();

AppDispatcher.register(function (payload) {
    switch (payload.actionType) {

        case AccountConstants.FOLLOW:
            _send_follow_xhr().then(function (result) {
                _following.push(result);
                AccountStore.emitChange();
            }, function (error) {
                console.log(error);
            });
            break;

        case AccountConstants.STOP_FOLLOWING:
            _send_stop_following_xhr().then(function (result) {
                for (var i = 0, len = _following.length; i < len; i++) {
                    if (_following[i].id == result) {
                        _following.splice(i, 1);
                        break;
                    }
                }
                console.log(_following);
                AccountStore.emitChange();
            }, function (error) {
                console.log(error);
            });
            break;

        case AccountConstants.REMOVE_MESSAGE:
            _send_remove_message_xhr(payload.id).then(function (result) {
                if (payload.box === 'incoming') {
                    for (var i = 0, len = _incoming_messages.length; i < len; i++) {
                        if (_incoming_messages[i].id == result) {
                            _incoming_messages.splice(i, 1);
                            break;
                        }
                    }
                } else {
                    for (var i = 0, len = _outcoming_messages.length; i < len; i++) {
                        if (_outcoming_messages[i].id == result) {
                            _outcoming_messages.splice(i, 1);
                            break;
                        }
                    }
                }
                AccountStore.emitChange();
            }, function (error) {
                console.log(error);
            });
            break;

        case AccountConstants.READ_MESSAGE:
            _send_read_message_xhr(payload.id).then(function (result) {
                for (var i = 0, len = _incoming_messages.length; i < len; i++) {
                    if (_incoming_messages[i].id == result) {
                        _incoming_messages[i].read = true;
                    }
                }
                AccountStore.emitChange();
            }, function (error) {
                console.log(error);
            });
            break;

        case AccountConstants.SEND_MESSAGE:
            _send_message_xhr(payload.toAccountId, payload.content).then(function (result) {
                console.log('message sent');
            }, function (error) {
                console.log('error occured while message sending');
            });
            break;

        case AccountConstants.VOTE:
            _vote_xhr(payload.choiceId).then(function (result) {
                console.log('voted successfully');
                return Promise.all([_get_foreign_decisions(), _get_votes()]);
            }, function (error) {
                console.log('voting failed');
            }).then(function (results) {
                AccountStore.Decisions = results[0];
                AccountStore.Votes = results[1];
                AccountStore.emitChange();
                console.log('decisions got');
            }, null);
            break;

        case AccountConstants.CANCEL_VOTE:
            _cancel_vote_xhr(payload.decisionId).then(function (result) {
                console.log('vote cancelled successfully');
                return Promise.all([_get_foreign_decisions(), _get_votes()]);
            }, function (error) {
                console.log('vote cancelling failed');
            }).then(function (results) {
                AccountStore.Decisions = results[0];
                AccountStore.Votes = results[1];
                AccountStore.emitChange();
            }, null);
            break;

        case AccountConstants.CREATE_DECISION:
            _create_decision_xhr(payload.data).then(function (result) {
                return _get_own_decisions();
            }, function (error) {
                console.log(error);
            }).then(function (result) {
                AccountStore.OwnDecisions = result;
                AccountStore.emitChange();
            }, null);
            break;

        case AccountConstants.DELETE_DECISION:
            _delete_decision_xhr(payload.id).then(function (result) {
                return _get_own_decisions();
            }, function (error) {
                console.log(error);
            }).then(function (result) {
                AccountStore.OwnDecisions = result;
                AccountStore.emitChange();
            }, function (error) {
                console.log(error);
            });
            break;
    }
    return true;
});

module.exports = AccountStore;