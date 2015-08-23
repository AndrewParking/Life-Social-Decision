'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AppDispatcher = require('./AppDispatcher'),
    AccountConstants = require('./AccountConstants'),
    EventEmitter = require('events').EventEmitter,
    _ = require('underscore');

var _following = [];

var _first_3_followers = [];

function _get_base_url() {
    var prev = window.location.hostname;
    if (prev == '127.0.0.1') {
        return 'http://' + prev + ':8000';
    } else {
        return prev;
    }
}

function _get_following_data() {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest(),
            url = _get_base_url() + '/accounts/following/';

        request.onload = function () {
            if (this.status == 200) {
                _following = JSON.parse(this.responseText);
                console.log('Array got from response text ->> ', _following);
                resolve(this.responseText);
            } else {
                reject(this.responseText);
            }
        };

        request.open('GET', url, true);
        request.send(null);
    });
}

function _get_first_3_followers() {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest(),
            url = _get_base_url() + '/accounts/first_3_followers/';

        request.onload = function () {
            if (this.status == 200) {
                _first_3_followers = JSON.parse(this.responseText);
                resolve(this.responseText);
            } else {
                console.log(this.responseText);
            }
        };

        request.open('GET', url, true);
        request.send(null);
    });
}

// Function to send following request
function _send_follow_xhr() {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest(),
            url = window.location.toString().replace('people', 'accounts') + 'follow/';

        request.onload = function () {
            if (this.status == 201) {
                console.log(url);
                resolve(this.status);
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
                console.log(url);
                resolve(this.status);
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
        key: 'fetchData',
        value: function fetchData() {
            var _this = this;

            _get_following_data().then(function (result) {
                console.log('Response ->>', result);
                return _get_first_3_followers();
            }, function (error) {
                console.log('following data got with the error');
            }).then(function (result) {
                _this.emitChange();
            }, function (error) {
                console.log('followers data got with error');
            });
        }
    }, {
        key: 'getBaseUrl',
        value: function getBaseUrl() {
            return _get_base_url();
        }
    }, {
        key: 'getAccountId',
        value: function getAccountId() {
            return window.location.toString().substr(-2, 1);
        }
    }, {
        key: 'getFollowingData',
        value: function getFollowingData() {
            return _following;
        }
    }, {
        key: 'getFirst3Following',
        value: function getFirst3Following() {
            return _following.splice(0, 3);
        }
    }, {
        key: 'getFirst3Followers',
        value: function getFirst3Followers() {
            return _first_3_followers;
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
    }]);

    return AccountStoreClass;
})(EventEmitter);

var AccountStore = new AccountStoreClass();
//console.log(AccountStore);

AppDispatcher.register(function (payload) {
    switch (payload.actionType) {
        case AccountConstants.FOLLOW:
            _send_follow_xhr().then(function (result) {
                AccountStore.fetchData();
            }, function (error) {
                console.log(error);
            });
            break;
        case AccountConstants.STOP_FOLLOWING:
            _send_stop_following_xhr().then(function (result) {
                AccountStore.fetchData();
            }, function (error) {
                console.log(error);
            });
            break;
    }
    return true;
});

module.exports = AccountStore;