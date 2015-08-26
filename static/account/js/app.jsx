var React = require('react'),
    FollowButtonComponent = require('./FollowButtonComponent'),
    First3Component = require('./First3Component'),
    MessagesComponent = require('./MessagesComponent'),
    MessageFormComponent = require('./MessageFormComponent'),
    MessageCounterComponent = require('./MessageCounterComponent'),
    AccountStore = require('./AccountStore');


var follow_container = document.getElementById('follow-button-container'),
    fol_list_container = document.getElementById('fol-list-container'),
    message_sending_container = document.getElementById('message-sending-container'),
    message_counter_container = document.getElementById('message-counter-container'),
    message_container = document.getElementById('messages-container');

var accountId = AccountStore.AccountId;


if (follow_container !== null) {
    let fetchPromise = AccountStore.fetchFollowing();
    fetchPromise()
        .then(result => {
            React.render(
                <FollowButtonComponent accountId={accountId} />,
                follow_container
            );
            React.render(
                <First3Component />,
                fol_list_container
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
