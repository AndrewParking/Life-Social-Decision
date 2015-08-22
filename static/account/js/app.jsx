var React = require('react'),
    AccountStore = require('./AccountStore'),
    AccountListComponent = require('./AccountListComponent');


AccountStore.fetchData();

React.render(
    <AccountListComponent />,
    document.getElementById('account-container')
);
