var React = require('react'),
    AccountItemComponent = require('./AccountItemComponent'),
    AccountDetailComponent = require('./AccountDetailComponent');

var AccountListComponent = React.createClass({

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
                        <AccountDetailComponent data={accountToDetail} onClickFunc={onClickFunc} />
                    </div>
                </div>
            );
        } else {
            var accountsList = this.props.data.map(function(account) {
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
