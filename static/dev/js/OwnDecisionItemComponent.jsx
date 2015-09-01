var React = require('react'),
    AccountActions = require('./AccountActions'),
    AccountStore = require('./AccountStore');


class OwnDecisionItemComponent extends React.Component {

    constructor() {
        super();
        this.getMaxVotes = this.getMaxVotes.bind(this);
    }

    getMaxVotes() {
        let choices = this.props.data.choices,
            maxVotes = 0;
        for (let choice of choices) {
            if (choice.votes > maxVotes) {
                maxVotes = choice.votes;
            }
        }
        return maxVotes;
    }

    render() {
        let maxVotes = this.getMaxVotes(),
            // getting choice list
            choices_list = this.props.data.choices.map(choice => {
                let widthStyle = {
                        width: maxVotes !== 0 ? Math.floor(choice.votes/maxVotes)*450 + 20 : 20
                    };
                return (
                    <div className="choice" key={choice.id}>
                        <p className="vote-link">
                            <a className="not-active">{choice.content}</a>
                            <span>{choice.votes}</span>
                        </p>
                        <div className="indicator" style={widthStyle}></div>
                    </div>
                );
            });

        return (
            <div className="decision">
    			<div className="panel-body">
        		    <h4>{this.props.data.heading}</h4>
                    <div className="decision-content">
                        <p>{this.props.data.content}</p>
                        <div className="choices-list">
                            {choices_list}
                        </div>
                    </div>
    			</div>
			</div>
        );
    }

}


module.exports = OwnDecisionItemComponent;
