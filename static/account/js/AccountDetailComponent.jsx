var React = require('react');

var AccountDetailComponent = React.createClass({

    render: function() {
        var data = this.props.data;
        return (
            <div>
                <div className="col-md-8">
                    <img className="foreign-photo" src={data.photo} />
                    <button className="btn btn-primary follow">Follow</button>
                </div>
                <div className="col-md-16">
                    <p>Email: {data.email}</p>
                    <hr/>
                    <p>Phone: {data.phone}</p>
                    <hr/>
                    <p>First name: {data.first_name || 'Nonamee'}</p>
                    <hr/>
                    <p>Last name: {data.last_name || 'Noname'}</p>
                    <hr/>
                </div>
                <div className="col-md-24">
                    <p className="about">{data.about || 'Usually we display about test here...'}</p>
                </div>
            </div>
        );
    }

});

module.exports = AccountDetailComponent;
