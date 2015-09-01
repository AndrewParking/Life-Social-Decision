'use strict';

var AppDispatcher = require('./AppDispatcher'),
    AccountConstants = require('./AccountConstants');

var AccountActions = {

    follow: function follow(id) {
        AppDispatcher.dispatch({
            actionType: AccountConstants.FOLLOW,
            id: id
        });
    },

    stop_following: function stop_following(id) {
        AppDispatcher.dispatch({
            actionType: AccountConstants.STOP_FOLLOWING,
            id: id
        });
    },

    removeMessage: function removeMessage(id, box) {
        AppDispatcher.dispatch({
            actionType: AccountConstants.REMOVE_MESSAGE,
            box: box,
            id: id
        });
    },

    readMessage: function readMessage(id) {
        AppDispatcher.dispatch({
            actionType: AccountConstants.READ_MESSAGE,
            id: id
        });
    },

    sendMessage: function sendMessage(toAccountId, content) {
        AppDispatcher.dispatch({
            actionType: AccountConstants.SEND_MESSAGE,
            toAccountId: toAccountId,
            content: content
        });
    },

    vote: function vote(choiceId) {
        AppDispatcher.dispatch({
            actionType: AccountConstants.VOTE,
            choiceId: choiceId
        });
    },

    cancelVote: function cancelVote(decisionId) {
        AppDispatcher.dispatch({
            actionType: AccountConstants.CANCEL_VOTE,
            decisionId: decisionId
        });
    },

    createDecision: function createDecision(data) {
        AppDispatcher.dispatch({
            actionType: AccountConstants.CREATE_DECISION,
            data: data
        });
    }

};

module.exports = AccountActions;