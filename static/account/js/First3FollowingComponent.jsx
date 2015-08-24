var React = require('react'),
    AccountStore = require('./AccountStore'),
    AccountActions = require('./AccountActions');


class First3FollowingComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            following: AccountStore.First3Following
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
            following: AccountStore.First3Following
        });
    }

    render() {
        let following_list = this.state.following.map(account => {
            let url = this.props.baseUrl + '/people/' + account.id + '/';
            return (
                <div className="small-fol" key={account.id}>
                    <img src={account.photo}  />
                    <a href={url} >{account.short_display_name}</a>
                </div>
            );
        });
        return (
            <div>
                {following_list}
            </div>
        );
    }

}


module.exports = First3FollowingComponent;
