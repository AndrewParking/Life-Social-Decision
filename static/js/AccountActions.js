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
    }

};

module.exports = AccountActions;