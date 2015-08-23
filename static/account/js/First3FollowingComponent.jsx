var React = require('react'),
    AccountStore = require('./AccountStore'),
    AccountActions = require('./AccountActions');


var First3FollowingComponent = React.createClass({

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
                <div className="small-fol" key={account.id}>
                    <img src={account.photo}  />
                    <a href={url} >{account.short_display_name}</a>
                </div>
            );
        }, this);
        return (
            <div>
                {following_list}
            </div>
        );
    }

});


module.exports = First3FollowingComponent;
