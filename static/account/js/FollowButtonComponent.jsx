var React = require('react'),
    AccountStore = require('./AccountStore'),
    AccountActions = require('./AccountActions');

var FollowButtonComponent = React.createClass({

    getInitialState: function() {
        return {
            followings: AccountStore.getFollowingData()
        }
    },

    componentDidMount: function() {
        AccountStore.addChangeListener(this._onChange);
    },

    componentWillUnmout: function() {
        AccountStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState({
            followings: AccountStore.getFollowingData()
        });
    },

    follow: function() {
        AccountActions.follow(this.props.accountId);
    },

    stop_following: function() {
        AccountActions.stop_following(this.props.accountId);
    },

    getIsFollowed: function() {
        var isFollowed = false,
            followings = this.state.followings;
        for (i=0, len=followings.length; i<len; i++) {
            if (followings[i].id == this.props.accountId) {
                isFollowed = true;
                break;
            }
        }
        return isFollowed;
    },

    render: function() {
        var isFollowed = this.getIsFollowed(),
            buttonText = isFollowed ? 'Stop following' : 'Follow',
            buttonClass = isFollowed ? 'stop-following' : 'follow',
            folFunc = isFollowed ? this.stop_following : this.follow;
        buttonClass = "btn " + buttonClass;
        return (
            <button className={buttonClass} onClick={folFunc}>{buttonText}</button>
        );
    },

});


module.exports = FollowButtonComponent;
