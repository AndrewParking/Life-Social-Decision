'use strict';

var React = require('react'),
    AccountStore = require('./AccountStore'),
    AccountActions = require('./AccountActions');

var First3FollowersComponent = React.createClass({ displayName: "First3FollowersComponent",

    getInitialState: function getInitialState() {
        return {
            followers: AccountStore.getFirst3Followers()
        };
    },

    componentDidMount: function componentDidMount() {
        AccountStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function componentWillUnmount() {
        AccountStore.removeChangeListener(this._onChange);
    },

    _onChange: function _onChange() {
        this.setState({
            followers: AccountStore.getFirst3Followers()
        });
    },

    render: function render() {
        var followers_list = this.state.followers.map(function (account) {
            var url = this.props.baseUrl + '/people/' + account.id + '/';
            return React.createElement("div", { className: "small-fol", key: account.id }, React.createElement("img", { src: account.photo }), React.createElement("a", { href: url }, account.short_display_name));
        }, this);
        return React.createElement("div", null, followers_list);
    }

});

module.exports = First3FollowersComponent;