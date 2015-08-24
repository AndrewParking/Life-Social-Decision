var React = require('react'),
    FollowButtonComponent = require('./FollowButtonComponent'),
    MessagesComponent = require('./MessagesComponent'),
    AccountStore = require('./AccountStore');


var follow_container = document.getElementById('follow-button-container'),
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
        }, error => {
            console.log('outcoming messages loading failed');
        });
} else {
    console.log('no place for messages');
}
