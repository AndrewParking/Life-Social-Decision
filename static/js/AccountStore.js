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

var _following = [],
    _incoming_messages = [],
    _outcoming_messages = [];

function _get_base_url() {
    var prev = window.location.hostname;
    if (prev == '127.0.0.1') {
        return 'http://' + prev + ':8000';
    } else {
        return prev;
    }
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) == name + '=') {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var csrftoken = getCookie('csrftoken');

function _get_following_data() {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest(),
            url = _get_base_url() + '/accounts/following/';

        request.onload = function () {
            if (this.status == 200) {
                _following = JSON.parse(this.responseText);
                resolve(this.responseText);
            } else {
                reject(this.responseText);
            }
        };

        request.open('GET', url, true);
        request.send(null);
    });
}

function _get_incoming_messages() {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest(),
            url = _get_base_url() + '/communication/messages/incoming/';

        request.onload = function () {
            if (this.status == 200) {
                _incoming_messages = JSON.parse(this.responseText).reverse();
                resolve(this.responseText);
            } else {
                console.log(this.responseText);
            }
        };

        request.open('GET', url, true);
        request.send(null);
    });
}

function _get_outcoming_messages() {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest(),
            url = _get_base_url() + '/communication/messages/outcoming/';

        request.onload = function () {
            if (this.status == 200) {
                _outcoming_messages = JSON.parse(this.responseText).reverse();
                resolve(this.responseText);
            } else {
                console.log(this.responseText);
            }
        };

        request.open('GET', url, true);
        request.send(null);
    });
}

function _send_remove_message_xhr(id) {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest(),
            url = _get_base_url() + ('/communication/messages/' + id + '/remove/');

        request.onload = function () {
            if (this.status == 200) {
                resolve(id);
            } else {
                reject(this.responseText);
            }
        };

        request.open('PATCH', url, true);
        request.setRequestHeader("X-CSRFToken", csrftoken);
        request.send(null);
    });
}

function _send_read_message_xhr(id) {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest(),
            url = _get_base_url() + ('/communication/messages/' + id + '/read/');

        request.onload = function () {
            if (this.status == 200) {
                resolve(id);
            } else {
                reject(this.responseText);
            }
        };

        request.open('PATCH', url, true);
        request.setRequestHeader("X-CSRFToken", csrftoken);
        request.send(null);
    });
}

function _send_message_xhr(toAccountId, content) {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest(),
            url = _get_base_url() + '/communication/messages/',
            data = {
            to_account: toAccountId,
            content: content
        };

        request.onload = function () {
            if (this.status == 201) {
                resolve(this.responseText);
            } else {
                reject(this.responseText);
            }
        };

        request.open('POST', url, true);
        request.setRequestHeader('X-CSRFToken', csrftoken);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify(data));
    });
}

// Function to send following request
function _send_follow_xhr() {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest(),
            url = window.location.toString().replace('people', 'accounts') + 'follow/';

        request.onload = function () {
            if (this.status == 201) {
                var result = JSON.parse(this.responseText);
                resolve(result);
            } else {
                reject(this.status);
            }
        };

        request.open('GET', url, true);
        request.send(null);
    });
}

function _send_stop_following_xhr() {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest(),
            url = window.location.toString().replace('people', 'accounts') + 'stop_following/';

        request.onload = function () {
            if (this.status == 204) {
                resolve(AccountStore.AccountId);
            } else {
                reject(this.status);
            }
        };

        request.open('GET', url, true);
        request.send(null);
    });
}

// ========== Account Store Class definition ============

var AccountStoreClass = (function (_EventEmitter) {
    _inherits(AccountStoreClass, _EventEmitter);

    function AccountStoreClass() {
        _classCallCheck(this, AccountStoreClass);

        _get(Object.getPrototypeOf(AccountStoreClass.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(AccountStoreClass, [{
        key: 'fetchFollowing',
        value: function fetchFollowing() {
            return _get_following_data;
        }
    }, {
        key: 'fetchIncomingMessages',
        value: function fetchIncomingMessages() {
            return _get_incoming_messages;
        }
    }, {
        key: 'fetchOutcomingMessages',
        value: function fetchOutcomingMessages() {
            return _get_outcoming_messages;
        }
    }, {
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
        key: 'BaseUrl',
        get: function get() {
            return _get_base_url();
        }
    }, {
        key: 'AccountId',
        get: function get() {
            return window.location.toString().substr(-2, 1);
        }
    }, {
        key: 'FollowingData',
        get: function get() {
            return _following;
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
        }
    }, {
        key: 'OutcomingMessages',
        get: function get() {
            return _outcoming_messages;
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
//console.log(AccountStore);

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

    }
    return true;
});

module.exports = AccountStore;