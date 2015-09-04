var React = require('react'),
    AccountActions = require('./AccountActions'),
    AccountStore = require('./AccountStore');


class DecisionItemComponent extends React.Component {

    constructor() {
        super();
        this.getMaxVotes = this.getMaxVotes.bind(this);
        this.vote = this.vote.bind(this);
        this.getIndicatorClass = this.getIndicatorClass.bind(this);
        this.cancelVote = this.cancelVote.bind(this);
        this.getCancelVoteButton = this.getCancelVoteButton.bind(this);
    }

    vote(choiceId) {
        AccountActions.vote(choiceId);
    }

    cancelVote() {
        AccountActions.cancelVote(this.props.data.id);
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

    getIndicatorClass(id) {
        let votes = AccountStore.Votes,
            found = false;
        for (let vote of votes) {
            if (vote.choice === id) {
                found = true;
                break;
            }
        }
        return found;
    }

    getCancelVoteButton() {
        if (this.props.data.already_voted) {
            return (
                <button className="btn btn-success cancel-vote" onClick={this.cancelVote}>Cancel vote</button>
            );
        } else {
            return "";
        }
    }

    render() {
        let maxVotes = this.getMaxVotes(),
            cancelVoteButton = this.getCancelVoteButton(),
            // getting choice list
            choices_list = this.props.data.choices.map(choice => {
                let indClass = this.getIndicatorClass(choice.id) ? 'indicator indicator-chosen' : 'indicator',
                    widthStyle = {
                        width: maxVotes !== 0 ? Math.floor(choice.votes/maxVotes)*450 + 20 : 20
                    }, voteLink;

                // deciding whether the vote links should be active or not
                if (this.props.data.already_voted) {
                    voteLink = (
                        <p className="vote-link">
                            <a className="not-active">{choice.content}</a>
                            <span>{choice.votes}</span>
                        </p>
                    );
                } else {
                    voteLink = (
                        <p className="vote-link">
                            <a onClick={this.vote.bind(this, choice.id)}>{choice.content}</a>
                            <span>{choice.votes}</span>
                        </p>
                    );
                }

                return (
                    <div className="choice" key={choice.id}>
                        {voteLink}
                        <div className={indClass} style={widthStyle}></div>
                    </div>
                );
            });

        return (
            <div className="decision">
    			<div className="panel-body">
        		    <h4>{this.props.data.heading}</h4>
                    <div className="decision-content">
                        {cancelVoteButton}
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


module.exports = DecisionItemComponent;
