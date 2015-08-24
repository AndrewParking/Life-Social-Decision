var React = require('react');


class InMessageComponent extends React.Component {

    render() {
        return (
            <div className='message in-message'>
                <p className='author'>From {this.props.data.from_account.short_display_name}</p>
                <p className='content'>{this.props.data.content}</p>
            </div>
        );
    }

}

module.exports = InMessageComponent;
