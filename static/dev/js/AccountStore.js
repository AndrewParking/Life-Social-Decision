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

class AccountStoreClass extends EventEmitter {

    get Decisions() { return _decisions; }

    set Decisions(newValue) { _decisions = newValue; }

    get Votes() { return _votes; }

    set Votes(newValue) { _votes = newValue; }

    get OwnDecisions() { return _own_decisions; }

    set OwnDecisions(newValue) { _own_decisions = newValue; }

    get FollowingData() { return _following; }

    set FollowingData(newValue) { _following = newValue; }

    get First3Following() {
        if (_following.length > 3) {
            return _following.slice(-3).reverse();
        } else {
            return _following.reverse();
        }
    }

    get IncomingMessages() { return _incoming_messages; }

    set IncomingMessages(newValue) { _incoming_messages = newValue; }

    get OutcomingMessages() { return _outcoming_messages; }

    set OutcomingMessages(newValue) { _outcoming_messages = newValue; }

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
        this.removeListener('change', callback);
    }

}

var AccountStore = new AccountStoreClass();

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
                    return Promise.all([
                        _get_foreign_decisions(),
                        _get_votes()
                    ]);
                }, error => {
                    console.log('voting failed');
                })
                .then(results => {
                    AccountStore.Decisions = results[0];
                    AccountStore.Votes = results[1];
                    AccountStore.emitChange();
                    console.log('decisions got');
                }, null);
            break;

        case AccountConstants.CANCEL_VOTE:
            _cancel_vote_xhr(payload.decisionId)
                .then(result => {
                    console.log('vote cancelled successfully');
                    return Promise.all([
                        _get_foreign_decisions(),
                        _get_votes()
                    ]);
                }, error => {
                    console.log('vote cancelling failed');
                })
                .then(results => {
                    AccountStore.Decisions = results[0];
                    AccountStore.Votes = results[1];
                    AccountStore.emitChange();
                }, null);
            break;

        case AccountConstants.CREATE_DECISION:
            _create_decision_xhr(payload.data)
                .then(result => {
                    return _get_own_decisions();
                }, error => {
                    console.log(error);
                })
                .then(result => {
                    AccountStore.OwnDecisions = result;
                    AccountStore.emitChange();
                }, null);
            break;

        case AccountConstants.DELETE_DECISION:
            _delete_decision_xhr(payload.id)
                .then(result => {
                    return _get_own_decisions();
                }, error => {
                    console.log(error);
                })
                .then(result => {
                    AccountStore.OwnDecisions = result;
                    AccountStore.emitChange();
                }, error => {
                    console.log(error);
                });
            break;
    }
    return true;
});

module.exports = AccountStore;
