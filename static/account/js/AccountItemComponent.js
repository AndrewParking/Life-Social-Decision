var React = require('react');


var AccountItemComponent = React.createClass({displayName: "AccountItemComponent",

    render: function() {
        if (this.props.data.first_name && this.props.data.last_name) {
            var nameToDisplay = this.props.data.first_name + ' ' + this.props.data.last_name;
        } else {
            var nameToDisplay = 'Nonamee Noname (' + this.props.data.email + ')';
        }
        var tagline = this.props.data.tagline || 'I\'m so lazy to provide a tagline...'
        return (
            React.createElement("div", {className: "well well-sm", onClick: this.props.onClickFunc}, 
                React.createElement("div", {className: "media"}, 
                    React.createElement("a", {className: "thumbnail pull-left", href: "#"}, 
                        React.createElement("img", {className: "media-object", src: this.props.data.photo})
                    ), 
                    React.createElement("div", {className: "media-body"}, 
                        React.createElement("h4", {className: "media-heading"}, nameToDisplay), 
                        React.createElement("p", null, tagline), 
                        React.createElement("p", null, 
                            React.createElement("span", {className: "label label-info"}, "11 decisions"), 
                            React.createElement("span", {className: "label label-success"}, "98 followers"), 
                            React.createElement("span", {className: "label label-primary"}, "63 following")
                        )
                    )
                )
            )
        )
    }

});

module.exports = AccountItemComponent;
