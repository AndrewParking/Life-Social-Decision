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


var _get_foreign_decisions = require('./XHRequest')._get_foreign_decisions,
    _get_votes = require('./XHRequest')._get_votes,
    _get_own_decisions = require('./XHRequest')._get_own_decisions,
    _get_following_data = require('./XHRequest')._get_following_data,
    _get_incoming_messages = require('./XHRequest')._get_incoming_messages,
    _get_outcoming_messages = require('./XHRequest')._get_outcoming_messages;


var accountId = require('./utils').accountId;

// if own certain dom element exists, we can assume we are at certain page.
// that's why we fetch in promise required data and then render components.


// PROFILE PAGE
if (own_decisions_container !== null) {
    _get_own_decisions()
        .then(result => {
            AccountStore.OwnDecisions = result;
            React.render(
                <OwnDecisionsComponent />,
                own_decisions_container
            );
        }, null);
} else {
    console.log('No place for own decisions');
}


// FOREIGN PROFILE PAGE
if (follow_container !== null) {
    Promise.all([
        _get_following_data(),
        _get_foreign_decisions(),
        _get_votes()
    ]).then(results => {
            AccountStore.FollowingData = results[0];
            AccountStore.Decisions = results[1];
            AccountStore.Votes = results[2];
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


// MESSAGES PAGE
if (message_container !== null) {
    _get_incoming_messages()
        .then(result => {
            AccountStore.IncomingMessages = result;
            return _get_outcoming_messages();
        }, error => {
            console.log('incoming messages loading failed');
        })
        .then(result => {
            AccountStore.OutcomingMessages = result;
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
