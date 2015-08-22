var React = require('react'),
    AccountStore = require('./AccountStore'),
    AccountListComponent = require('./AccountListComponent');


AccountStore.fetchData();

React.render(
    React.createElement(AccountListComponent, null),
    document.getElementById('account-container')
);
