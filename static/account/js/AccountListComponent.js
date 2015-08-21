var React = require('react'),
    AccountItemComponent = require('./AccountItemComponent'),
    AccountDetailComponent = require('./AccountDetailComponent');

var AccountListComponent = React.createClass({displayName: "AccountListComponent",

    getInitialState: function() {
        return {detailedId: undefined}
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
                list = this.props.data;
            for(var i=0, len=list.length; i<len; i++) {
                if (list[i].id == this.state.detailedId) {
                    accountToDetail = list[i];
                }
            }
            if (accountToDetail.first_name && accountToDetail.last_name) {
                heading = accountToDetail.first_name + ' ' + accountToDetail.last_name;
            } else {
                heading = 'Nonamee Noname (' + accountToDetail.email + ')';
            }
            var onClickFunc = this.makeListed.bind(this);
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
                        React.createElement(AccountDetailComponent, {data: accountToDetail, onClickFunc: onClickFunc})
                    )
                )
            );
        } else {
            var accountsList = this.props.data.map(function(account) {
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
