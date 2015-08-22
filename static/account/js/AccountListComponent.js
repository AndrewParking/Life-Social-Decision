var React = require('react'),
    AccountItemComponent = require('./AccountItemComponent'),
    AccountActions = require('./AccountActions'),
    AccountStore = require('./AccountStore'),
    AccountDetailComponent = require('./AccountDetailComponent');

var AccountListComponent = React.createClass({displayName: "AccountListComponent",

    getInitialState: function() {
        return {
            detailedId: undefined,
            accounts: AccountStore.getAccounts(),
            following: AccountStore.getFollowing(),
            followers: AccountStore.getFollowers()
        }
    },

    componentDidMount: function() {
        AccountStore.addChangeListener(this._onChange);
    },

    componentWillUnmout: function() {
        AccountStore.removeChangeListener(this._onChange);
    },

    follow: function() {
        AccountActions.follow(this.state.detailedId);
    },

    stop_following: function() {
        AccountActions.stop_following(this.state.detailedId);
    },

    _onChange: function() {
        this.setState(function(previousState) {
            return {
                detailedId: previousState.detailedId,
                accounts: AccountStore.getAccounts(),
                following: AccountStore.getFollowing(),
                followers: AccountStore.getFollowers()
            }
        });
    },

    makeDetailed: function(id) {
        this.setState({detailedId: id});
    },

    makeListed: function() {
        this.setState({detailedId: undefined});
    },

    render: function() {
        if (this.state.detailedId) {
            var accountToDetail,
                heading,
                isFollowed = false,
                list = this.state.accounts,
                following = this.state.following;

            for(var i=0, len=list.length; i<len; i++) {
                if (list[i].id == this.state.detailedId) {
                    accountToDetail = list[i];
                }
            }

            for(var i=0, len=following.length; i<len; i++) {
                if (following[i].id == this.state.detailedId) {
                    isFollowed = true
                }
            }

            console.log(isFollowed);

            var followFunc = isFollowed ? this.stop_following : this.follow;

            if (accountToDetail.first_name && accountToDetail.last_name) {
                heading = accountToDetail.first_name + ' ' + accountToDetail.last_name;
            } else {
                heading = 'Nonamee Noname (' + accountToDetail.email + ')';
            }

            return (
                React.createElement("div", null, 
                    React.createElement("div", {className: "panel-heading"}, 
                        React.createElement("button", {className: "pull-right btn", onClick: this.makeListed}, "Back"), 
                        React.createElement("h4", null, heading)
                    ), 
                    React.createElement("div", {className: "panel-body"}, 
                        accountToDetail.tagline || 'No tagline to show...', 
                        React.createElement("hr", null)
                    ), 
                    React.createElement("div", null, 
                        React.createElement(AccountDetailComponent, {data: accountToDetail, isFollowed: isFollowed, followFunc: followFunc})
                    )
                )
            );
        } else {
            console.log(this.state.accounts);
            var accountsList = this.state.accounts.map(function(account) {
                var onClickFunc = this.makeDetailed.bind(this, account.id);
                return React.createElement(AccountItemComponent, {data: account, key: account.email, onClickFunc: onClickFunc})
            }, this);
            return (
                React.createElement("div", null, 
                    React.createElement("div", {className: "panel-heading"}, 
                        React.createElement("h4", null, "Profiles")
                    ), 
                    React.createElement("div", {className: "panel-body"}, 
                        "Check out some of our member profiles..", 
                        React.createElement("hr", null)
                    ), 
                    React.createElement("div", null, accountsList)
                )
            );
        }
    }
});

module.exports = AccountListComponent;
