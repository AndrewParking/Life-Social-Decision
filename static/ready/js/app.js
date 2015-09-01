'use strict';

var React = require('react'),
    FollowButtonComponent = require('./FollowButtonComponent'),
    First3Component = require('./First3Component'),
    MessagesComponent = require('./MessagesComponent'),
    MessageFormComponent = require('./MessageFormComponent'),
    MessageCounterComponent = require('./MessageCounterComponent'),
    DecisionsComponent = require('./DecisionsComponent'),
    OwnDecisionsComponent = require('./OwnDecisionsComponent'),
    AccountStore = require('./AccountStore');

var follow_container = document.getElementById('follow-button-container'),
    fol_list_container = document.getElementById('fol-list-container'),
    message_sending_container = document.getElementById('message-sending-container'),
    message_counter_container = document.getElementById('message-counter-container'),
    decisions_container = document.getElementById('decisions-container'),
    own_decisions_container = document.getElementById('own-decisions-container'),
    message_container = document.getElementById('messages-container');

var accountId = AccountStore.AccountId;

// if own certain dom element exists, we can assume we are at certain page.
// that's why we fetch in promise required data and then render components.

// PROFILE PAGE
if (own_decisions_container !== null) {
    var fetchOwnDecisions = AccountStore.fetchOwnDecisions();
    fetchOwnDecisions().then(function (result) {
        React.render(React.createElement(OwnDecisionsComponent, null), own_decisions_container);
    }, null);
} else {
    console.log('No place for own decisions');
}

// FOREIGN PROFILE PAGE
if (follow_container !== null) {
    var fetchFollowingPromise = AccountStore.fetchFollowing(),
        fetchForeignDecisionsPromise = AccountStore.fetchForeignDecisions();
    Promise.all([fetchFollowingPromise(), fetchForeignDecisionsPromise()]).then(function (result) {
        React.render(React.createElement(FollowButtonComponent, { accountId: accountId }), follow_container);
        React.render(React.createElement(First3Component, null), fol_list_container);
        React.render(React.createElement(DecisionsComponent, null), decisions_container);
    }, null);
} else {
    console.log('no place for follow button');
}

// MESSAGES PAGE
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
            React.render(React.createElement(MessageCounterComponent, null), message_counter_container);
        }, function (error) {
            console.log('outcoming messages loading failed');
        });
    })();
} else {
    console.log('no place for messages');
}

if (message_sending_container !== null) {
    React.render(React.createElement(MessageFormComponent, null), message_sending_container);
} else {
    console.log('No place for message form');
}