var React = require('react'),
    FollowButtonComponent = require('./FollowButtonComponent'),
    First3Component = require('./First3Component'),
    MessagesComponent = require('./MessagesComponent'),
    MessageFormComponent = require('./MessageFormComponent'),
    MessageCounterComponent = require('./MessageCounterComponent'),
    DecisionsComponent = require('./DecisionsComponent'),
    AccountStore = require('./AccountStore');


var follow_container = document.getElementById('follow-button-container'),
    fol_list_container = document.getElementById('fol-list-container'),
    message_sending_container = document.getElementById('message-sending-container'),
    message_counter_container = document.getElementById('message-counter-container'),
    decisions_container = document.getElementById('decisions-container'),
    message_container = document.getElementById('messages-container');

var accountId = AccountStore.AccountId;


if (follow_container !== null) {
    let fetchFollowingPromise = AccountStore.fetchFollowing(),
        fetchForeignDecisionsPromise = AccountStore.fetchForeignDecisions();
    Promise.all([
        fetchFollowingPromise(),
        fetchForeignDecisionsPromise()
    ]).then(result => {
            React.render(
                <FollowButtonComponent accountId={accountId} />,
                follow_container
            );
            React.render(
                <First3Component />,
                fol_list_container
            );
            React.render(
                <DecisionsComponent />,
                decisions_container
            );
        }, null)
} else {
    console.log('no place for follow button');
}


if (message_container !== null) {
    let fetchIncomingMessages = AccountStore.fetchIncomingMessages(),
        fetchOutcomingMessages = AccountStore.fetchOutcomingMessages();
    fetchIncomingMessages()
        .then(result => {
            return fetchOutcomingMessages();
        }, error => {
            console.log('incoming messages loading failed');
        })
        .then(result => {
            React.render(
                <MessagesComponent />,
                message_container
            );
            React.render(
                <MessageCounterComponent />,
                message_counter_container
            );
        }, error => {
            console.log('outcoming messages loading failed');
        });
} else {
    console.log('no place for messages');
}

if (message_sending_container !== null) {
    React.render(
        <MessageFormComponent />,
        message_sending_container
    );
} else {
    console.log('No place for message form');
}
