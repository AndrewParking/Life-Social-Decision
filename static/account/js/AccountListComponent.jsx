var React = require('react'),
    AccountItemComponent = require('./AccountItemComponent'),
    AccountActions = require('./AccountActions'),
    AccountStore = require('./AccountStore'),
    AccountDetailComponent = require('./AccountDetailComponent');

var AccountListComponent = React.createClass({

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
                <div>
                    <div className="panel-heading">
                        <button className="pull-right btn" onClick={this.makeListed}>Back</button>
                        <h4>{heading}</h4>
                    </div>
                    <div className="panel-body">
                        {accountToDetail.tagline || 'No tagline to show...'}
                        <hr/>
                    </div>
                    <div>
                        <AccountDetailComponent data={accountToDetail} isFollowed={isFollowed} followFunc={followFunc} />
                    </div>
                </div>
            );
        } else {
            console.log(this.state.accounts);
            var accountsList = this.state.accounts.map(function(account) {
                var onClickFunc = this.makeDetailed.bind(this, account.id);
                return <AccountItemComponent data={account} key={account.email} onClickFunc={onClickFunc} />
            }, this);
            return (
                <div>
                    <div className="panel-heading">
                        <h4>Profiles</h4>
                    </div>
                    <div className="panel-body">
                        Check out some of our member profiles..
                        <hr/>
                    </div>
                    <div>{accountsList}</div>
                </div>
            );
        }
    }
});

module.exports = AccountListComponent;
