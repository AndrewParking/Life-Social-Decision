var React = require('react'),
    AccountStore = require('./AccountStore'),
    AccountActions = require('./AccountActions');


class FollowButtonComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            followings: AccountStore.FollowingData
        };
        this._onChange = this._onChange.bind(this);
        this.follow = this.follow.bind(this);
        this.stop_following = this.stop_following.bind(this);
        this.getIsFollowed = this.getIsFollowed.bind(this);
    }

    componentDidMount() {
        AccountStore.addChangeListener(this._onChange);
    }

    componentWillUnmout() {
        AccountStore.removeChangeListener(this._onChange);
    }

    _onChange() {
        this.setState({
            followings: AccountStore.FollowingData
        });
    }

    follow() {
        console.log('Now executes follow.');
        AccountActions.follow(this.props.accountId);
    }

    stop_following() {
        console.log('Now executes stop_following.');
        AccountActions.stop_following(this.props.accountId);
    }

    getIsFollowed() {
        var isFollowed = false,
            followings = this.state.followings;
        for (let elem of followings) {
            if (elem.id == this.props.accountId) {
                isFollowed = true;
                break;
            }
        }
        return isFollowed;
    }

    render() {
        let isFollowed = this.getIsFollowed(),
            buttonText = isFollowed ? 'Stop following' : 'Follow',
            buttonClass = isFollowed ? 'stop-following' : 'follow',
            folFunc = isFollowed ? this.stop_following : this.follow;
        buttonClass = "btn " + buttonClass;
        return (
            <button className={buttonClass} onClick={folFunc}>{buttonText}</button>
        );
    }

}


module.exports = FollowButtonComponent;
