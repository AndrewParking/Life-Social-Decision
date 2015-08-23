'use strict';

var React = require('react'),
    AccountStore = require('./AccountStore'),
    AccountActions = require('./AccountActions');

var FollowButtonComponent = React.createClass({ displayName: "FollowButtonComponent",

    getInitialState: function getInitialState() {
        return {
            followings: AccountStore.getFollowingData()
        };
    },

    componentDidMount: function componentDidMount() {
        AccountStore.addChangeListener(this._onChange);
    },

    componentWillUnmout: function componentWillUnmout() {
        AccountStore.removeChangeListener(this._onChange);
    },

    _onChange: function _onChange() {
        this.setState({
            followings: AccountStore.getFollowingData()
        });
    },

    follow: function follow() {
        console.log('Now executes follow.');
        AccountActions.follow(this.props.accountId);
    },

    stop_following: function stop_following() {
        console.log('Now executes stop_following.');
        AccountActions.stop_following(this.props.accountId);
    },

    getIsFollowed: function getIsFollowed() {
        var isFollowed = false,
            followings = this.state.followings;
        console.log(followings);
        for (var i = 0, len = followings.length; i < len; i++) {
            if (followings[i].id == this.props.accountId) {
                isFollowed = true;
                break;
            }
        }
        return isFollowed;
    },

    render: function render() {
        var isFollowed = this.getIsFollowed(),
            buttonText = isFollowed ? 'Stop following' : 'Follow',
            buttonClass = isFollowed ? 'stop-following' : 'follow',
            folFunc = isFollowed ? this.stop_following : this.follow;
        buttonClass = "btn " + buttonClass;
        return React.createElement("button", { className: buttonClass, onClick: folFunc }, buttonText);
    }

});

module.exports = FollowButtonComponent;