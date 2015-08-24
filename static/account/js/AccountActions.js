'use strict';

var AppDispatcher = require('./AppDispatcher'),
    AccountConstants = require('./AccountConstants');

var AccountActions = {

    follow(id) {
        AppDispatcher.dispatch({
            actionType: AccountConstants.FOLLOW,
            id: id
        });
    },

    stop_following(id) {
        AppDispatcher.dispatch({
            actionType: AccountConstants.STOP_FOLLOWING,
            id: id
        });
    },

    removeMessage(id, box) {
        AppDispatcher.dispatch({
            actionType: AccountConstants.REMOVE_MESSAGE,
            box: box,
            id: id
        });
    }

};

module.exports = AccountActions;
