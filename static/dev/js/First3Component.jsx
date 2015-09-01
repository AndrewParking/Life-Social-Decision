var React = require('react'),
    AccountStore = require('./AccountStore');


class First3Component extends React.Component {

    constructor() {
        super();
        console.log('rendered');
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
        console.log(this.state.following);
        this.setState({
            following: AccountStore.First3Following
        });
    }

    render() {
        let accountUrl = AccountStore.BaseUrl + '/people/',
            listToRender = this.state.following.map(account => {
            return (
                <div className="small-fol" key={account.id}>
                    <img src={account.photo} />
                    <a href={accountUrl + account.id + '/'}>{account.short_display_name}</a>
                </div>
            );
        });
        return (
            <div>
                {listToRender}
            </div>
        );
    }

}


module.exports = First3Component;
