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
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
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
                _incoming_messages = JSON.parse(this.responseText);
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
                _outcoming_messages = JSON.parse(this.responseText);
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
            url = _get_base_url() + `/communication/messages/${id}/remove/`;

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


// Function to send following request
function _send_follow_xhr() {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest(),
            url = window.location.toString().replace('people', 'accounts') + 'follow/';

        request.onload = function () {
            if (this.status == 201) {
                let result = JSON.parse(this.responseText);
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

class AccountStoreClass extends EventEmitter {

    fetchFollowing() {
        return _get_following_data;
    }

    fetchIncomingMessages() {
        return _get_incoming_messages;
    }

    fetchOutcomingMessages() {
        return _get_outcoming_messages;
    }

    get BaseUrl() {
        return _get_base_url();
    }

    get AccountId() {
        return window.location.toString().substr(-2, 1);
    }

    get FollowingData() {
        return _following;
    }

    get IncomingMessages() {
        return _incoming_messages;
    }

    get OutcomingMessages() {
        return _outcoming_messages;
    }

    emitChange() {
        this.emit('change');
    }

    addChangeListener(callback) {
        this.on('change', callback);
    }

    removeChangeListener(callback) {
        this.removeChangeListener('change', callback);
    }

}

var AccountStore = new AccountStoreClass();
//console.log(AccountStore);

AppDispatcher.register(function(payload) {
    switch (payload.actionType) {

        case AccountConstants.FOLLOW:
            _send_follow_xhr().then(result => {
                _following.push(result);
                console.log(_following);
                AccountStore.emitChange();
            }, error => {
                console.log(error);
            });
            break;

        case AccountConstants.STOP_FOLLOWING:
            _send_stop_following_xhr().then(result => {
                for (let i=0, len=_following.length; i<len; i++) {
                    if (_following[i].id == result) {
                        _following.splice(i, 1);
                    }
                }
                console.log(_following);
                AccountStore.emitChange();
            }, error => {
                console.log(error);
            });
            break;

        case AccountConstants.REMOVE_MESSAGE:
            _send_remove_message_xhr(payload.id)
                .then(result => {
                    if (payload.box === 'incoming') {
                        for (let i=0, len=_incoming_messages.length; i<len; i++) {
                            if (_incoming_messages[i].id == result) {
                                _incoming_messages.splice(i, 1);
                            }
                        }
                    } else {
                        for (let i=0, len=_outcoming_messages.length; i<len; i++) {
                            if (_outcoming_messages[i].id == result) {
                                _outcoming_messages.splice(i, 1);
                            }
                        }
                    }
                    AccountStore.emitChange();
                }, error => {
                    console.log(error);
                })
                break;
    }
    return true;
});

module.exports = AccountStore;
