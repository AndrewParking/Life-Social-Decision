var AppDispatcher = require('./AppDispatcher'),
    AccountConstants = require('./AccountConstants'),
    EventEmitter = require('events').EventEmitter,
    jQuery = require('jquery'),
    _ = require('underscore');

var _following = [],
    _decisions = [],
    _own_decisions = [],
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
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var csrftoken = getCookie('csrftoken');


function _get_foreign_decisions() {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest(),
            url = _get_base_url() + '/accounts/' + AccountStore.AccountId + '/decisions/';

        request.onload = function () {
            if (this.status == 200) {
                _decisions = JSON.parse(this.responseText);
                resolve(this.responseText);
            } else {
                reject(this.responseText);
            }
        };

        request.open('GET', url, true);
        request.send(null);
    });
}


function _get_own_decisions() {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest(),
            url = _get_base_url() + '/decisions-api/decisions/own_decisions/';

        request.onload = function () {
            if (this.status == 200) {
                _own_decisions = JSON.parse(this.responseText);
                resolve(this.responseText);
            } else {
                reject(this.responseText);
            }
        };

        request.open('GET', url, true);
        request.send(null);
    });
}


function _create_decision_xhr(data) {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest(),
            url = _get_base_url() + '/decisions-api/decisions/';

        request.onload = function () {
            if (this.status == 201) {
                resolve(this.responseText);
            } else {
                reject(this.responseText);
            }
        };

        request.open('POST', url, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader("X-CSRFToken", csrftoken);
        request.send(JSON.stringify(data));

    });
}


function _vote_xhr(choiceId) {
    return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest(),
        url = _get_base_url() + '/decisions-api/votes/';

        request.onload = function() {
            if (this.status == 201) {
                resolve(this.responseText);
            } else {
                reject(this.responseText);
            }
        };

        console.log(choiceId);

        request.open('POST', url, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader("X-CSRFToken", csrftoken);
        request.send(JSON.stringify({choice: choiceId}));

    });
}


function _cancel_vote_xhr(decisionId) {
    return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest(),
        url = _get_base_url() + '/decisions-api/decisions/' + decisionId + '/cancel_vote/';

        request.onload = function() {
            if (this.status == 204) {
                resolve(this.responseText);
            } else {
                reject(this.responseText);
            }
        };

        console.log(url);

        request.open('DELETE', url, true);
        request.setRequestHeader("X-CSRFToken", csrftoken);
        request.send(null);

    });
}


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


function _send_read_message_xhr(id) {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest(),
            url = _get_base_url() + `/communication/messages/${id}/read/`;

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
            url = _get_base_url() + `/communication/messages/`,
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

    fetchForeignDecisions() {
        return _get_foreign_decisions;
    }

    fetchOwnDecisions() {
        return _get_own_decisions;
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

    get Decisions() {
        return _decisions;
    }

    get OwnDecisions() {
        return _own_decisions;
    }

    get FollowingData() {
        return _following;
    }

    get First3Following() {
        if (_following.length > 3) {
            return _following.slice(-3).reverse();
        } else {
            return _following.reverse();
        }

    }

    get IncomingMessages() {
        return _incoming_messages;
    }

    get OutcomingMessages() {
        return _outcoming_messages;
    }

    get UnreadMessagesCount() {
        let counter = 0;
        console.log(_incoming_messages);
        for (let i in _incoming_messages) {
            if (!_incoming_messages[i].read) {
                counter++;
            }
        }
        return counter;
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
                        break;
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
                                break;
                            }
                        }
                    } else {
                        for (let i=0, len=_outcoming_messages.length; i<len; i++) {
                            if (_outcoming_messages[i].id == result) {
                                _outcoming_messages.splice(i, 1);
                                break;
                            }
                        }
                    }
                    AccountStore.emitChange();
                }, error => {
                    console.log(error);
                });
            break;

        case AccountConstants.READ_MESSAGE:
            _send_read_message_xhr(payload.id)
                .then(result => {
                    for (let i=0, len=_incoming_messages.length; i<len; i++) {
                        if (_incoming_messages[i].id == result) {
                            _incoming_messages[i].read = true;
                        }
                    }
                    AccountStore.emitChange();
                }, error => {
                    console.log(error);
                });
            break;

        case AccountConstants.SEND_MESSAGE:
            _send_message_xhr(payload.toAccountId, payload.content)
                .then(result => {
                    console.log('message sent');
                }, error => {
                    console.log('error occured while message sending');
                });
            break;

        case AccountConstants.VOTE:
            _vote_xhr(payload.choiceId)
                .then(result => {
                    console.log('voted successfully');
                    return _get_foreign_decisions();
                }, error => {
                    console.log('voting failed');
                })
                .then(result => {
                    console.log('decisions updated');
                    AccountStore.emitChange()
                }, null);
            break;

        case AccountConstants.CANCEL_VOTE:
            _cancel_vote_xhr(payload.decisionId)
                .then(result => {
                    console.log('vote cancelled successfully');
                    return _get_foreign_decisions();
                }, error => {
                    console.log('vote cancelling failed');
                })
                .then(result => {
                    AccountStore.emitChange();
                }, null);
            break;

        case AccountConstants.CREATE_DECISION:
            _create_decision_xhr(payload.data)
                .then(result => {
                    console.log('decision created');
                    return _get_own_decisions();
                }, error => {
                    console.log('decision creation failed');
                })
                .then(result => {
                    AccountStore.emitChange();
                }, null);
            break;
    }
    return true;
});

module.exports = AccountStore;
