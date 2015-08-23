var React = require('react'),
    AccountStore = require('./AccountStore'),
    AccountActions = require('./AccountActions');


var First3FollowersComponent = React.createClass({

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
                <div className="small-fol" key={account.id}>
                    <img src={account.photo} />
                    <a href={url}>{account.short_display_name}</a>
                </div>
            );
        }, this);
        return (
            <div>
                {followers_list}
            </div>
        );
    }

});

module.exports = First3FollowersComponent;
