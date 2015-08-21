var React = require('react');


var AccountItemComponent = React.createClass({

    render: function() {
        if (this.props.data.first_name && this.props.data.last_name) {
            var nameToDisplay = this.props.data.first_name + ' ' + this.props.data.last_name;
        } else {
            var nameToDisplay = 'Nonamee Noname (' + this.props.data.email + ')';
        }
        var tagline = this.props.data.tagline || 'I\'m so lazy to provide a tagline...'
        return (
            <div className="well well-sm" onClick={this.props.onClickFunc}>
                <div className="media">
                    <a className="thumbnail pull-left" href="#">
                        <img className="media-object" src={this.props.data.photo} />
                    </a>
                    <div className="media-body">
                        <h4 className="media-heading">{nameToDisplay}</h4>
                        <p>{tagline}</p>
                        <p>
                            <span className="label label-info">11 decisions</span>
                            <span className="label label-success">98 followers</span>
                            <span className="label label-primary">63 following</span>
                        </p>
                    </div>
                </div>
            </div>
        )
    }

});

module.exports = AccountItemComponent;
