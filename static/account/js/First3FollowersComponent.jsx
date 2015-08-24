var React = require('react'),
    AccountStore = require('./AccountStore'),
    AccountActions = require('./AccountActions');


class First3FollowersComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            followers: AccountStore.First3Followers
        };
        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        AccountStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        AccountStore.removeChangeListener(this._onChange);
    }

    _onChange() {
        this.setState({
            followers: AccountStore.First3Followers
        });
    }

    render() {
        let followers_list = this.state.followers.map(account => {
            let url = this.props.baseUrl + '/people/' + account.id + '/';
            return (
                <div className="small-fol" key={account.id}>
                    <img src={account.photo} />
                    <a href={url}>{account.short_display_name}</a>
                </div>
            );
        });
        return (
            <div>
                {followers_list}
            </div>
        );
    }

}


module.exports = First3FollowersComponent;
