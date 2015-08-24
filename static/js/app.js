'use strict';

var React = require('react'),
    FollowButtonComponent = require('./FollowButtonComponent'),
    MessagesComponent = require('./MessagesComponent'),
    AccountStore = require('./AccountStore');

var follow_container = document.getElementById('follow-button-container'),
    message_container = document.getElementById('messages-container');

var accountId = AccountStore.AccountId;

if (follow_container !== null) {
    var fetchPromise = AccountStore.fetchFollowing();
    fetchPromise().then(function (result) {
        React.render(React.createElement(FollowButtonComponent, { accountId: accountId }), follow_container);
    }, null);
} else {
    console.log('no place for follow button');
}

if (message_container !== null) {
    (function () {
        var fetchIncomingMessages = AccountStore.fetchIncomingMessages(),
            fetchOutcomingMessages = AccountStore.fetchOutcomingMessages();
        fetchIncomingMessages().then(function (result) {
            return fetchOutcomingMessages();
        }, function (error) {
            console.log('incoming messages loading failed');
        }).then(function (result) {
            React.render(React.createElement(MessagesComponent, null), message_container);
        }, function (error) {
            console.log('outcoming messages loading failed');
        });
    })();
} else {
    console.log('no place for messages');
}