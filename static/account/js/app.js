var React = require('react'),
    FollowButtonComponent = require('./FollowButtonComponent'),
    First3FollowingComponent = require('./First3FollowingComponent'),
    First3FollowersComponent = require('./First3FollowersComponent'),
    AccountStore = require('./AccountStore');

var baseUrl = AccountStore.getBaseUrl();

accountId = AccountStore.getAccountId();
AccountStore.fetchFollowersData();
AccountStore.fetchFollowingData();

try {
    React.render(
        React.createElement(FollowButtonComponent, {accountId: accountId}),
        document.getElementById('follow-button-container')
    );
} catch(e) {
    console.log('no place for follow button');
}


try {
    React.render(
        React.createElement(First3FollowingComponent, {baseUrl: baseUrl}),
        document.getElementById('first-following-container')
    );

    React.render(
        React.createElement(First3FollowersComponent, {baseUrl: baseUrl}),
        document.getElementById('first-followers-container')
    );
} catch(e) {
    console.log('no place for 3-follow-components');
}
