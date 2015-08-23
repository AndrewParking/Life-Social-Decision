var React = require('react'),
    AccountStore = require('./AccountStore'),
    AccountActions = require('./AccountActions');


var First3FollowersComponent = React.createClass({displayName: "First3FollowersComponent",

    getInitialState: function() {
        return {
            followers: AccountStore.getFirst3Followers()
        };
    },

    componentDidMount: function() {
        AccountStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        AccountStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState({
            followers: AccountStore.getFirst3Followers()
        });
    },

    render: function() {
        var followers_list = this.state.followers.map(function(account) {
            var url = this.props.baseUrl + '/people/' + account.id + '/';
            return (
                React.createElement("div", {className: "small-fol", key: account.id}, 
                    React.createElement("img", {src: account.photo}), 
                    React.createElement("a", {href: url}, account.short_display_name)
                )
            );
        }, this);
        return (
            React.createElement("div", null, 
                followers_list
            )
        );
    }

});

module.exports = First3FollowersComponent;
