var React = require('react');

var AccountDetailComponent = React.createClass({displayName: "AccountDetailComponent",

    render: function() {
        var data = this.props.data;
        return (
            React.createElement("div", null, 
                React.createElement("div", {className: "col-md-8"}, 
                    React.createElement("img", {className: "foreign-photo", src: data.photo}), 
                    React.createElement("button", {className: "btn btn-primary follow"}, "Follow")
                ), 
                React.createElement("div", {className: "col-md-16"}, 
                    React.createElement("p", null, "Email: ", data.email), 
                    React.createElement("hr", null), 
                    React.createElement("p", null, "Phone: ", data.phone), 
                    React.createElement("hr", null), 
                    React.createElement("p", null, "First name: ", data.first_name || 'Nonamee'), 
                    React.createElement("hr", null), 
                    React.createElement("p", null, "Last name: ", data.last_name || 'Noname'), 
                    React.createElement("hr", null)
                ), 
                React.createElement("div", {className: "col-md-24"}, 
                    React.createElement("p", {className: "about"}, data.about || 'Usually we display about test here...')
                )
            )
        );
    }

});

module.exports = AccountDetailComponent;
