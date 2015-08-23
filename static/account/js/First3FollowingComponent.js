var React = require('react'),
    AccountStore = require('./AccountStore'),
    AccountActions = require('./AccountActions');


var First3FollowingComponent = React.createClass({displayName: "First3FollowingComponent",

    getInitialState: function() {
        return {
            following: AccountStore.getFirst3Following()
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
            following: AccountStore.getFirst3Following()
        });
    },

    render: function() {
        var following_list = this.state.following.map(function(account) {
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
                following_list
            )
        );
    }

});


module.exports = First3FollowingComponent;
