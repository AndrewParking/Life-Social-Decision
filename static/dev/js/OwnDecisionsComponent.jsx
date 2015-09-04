var React = require('react'),
    AccountStore = require('./AccountStore'),
    AccountActions = require('./AccountActions'),
    OwnDecisionItemComponent = require('./OwnDecisionItemComponent');


class OwnDecisionsComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            decisions: AccountStore.OwnDecisions,
            choicesInputCount: 2,
            formShown: false,
        };
        console.log('decisions ==> ', this.state.decisions);
        this._onChange = this._onChange.bind(this);
        this.getChoicesInputs = this.getChoicesInputs.bind(this);
        this.addOneChoice = this.addOneChoice.bind(this);
        this.createDecision = this.createDecision.bind(this);
        this.clearInputs = this.clearInputs.bind(this);
        this.showForm = this.showForm.bind(this);
        this.hideForm = this.hideForm.bind(this);
        this.getDecisionForm = this.getDecisionForm.bind(this);
    }

    componentDidMount() {
        AccountStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        AccountStore.removeChangeListener(this._onChange);
    }

    showForm() {
        this.setState(prevState => {
            return {
                decisions: prevState.decisions,
                choicesInputCount: prevState.choicesInputCount,
                formShown: true,
            }
        });
    }

    hideForm() {
        this.setState(prevState => {
            return {
                decisions: prevState.decisions,
                choicesInputCount: 2,
                formShown: false,
            }
        });
    }

    clearInputs() {
        document.getElementById('decision-heading').value = '';
        document.getElementById('decision-content').value = '';
        let choiceInputs = document.getElementsByClassName('choice-input');
        for (let i=0, len=choiceInputs.length; i<len; i++) {
            choiceInputs[i].value = '';
        }
        this.setState(prevState => {
            return {
                decisions: prevState.decisions,
                choicesInputCount: 2,
                formShown: false,
            }
        });
    }

    _onChange() {
        this.setState(prevState => {
            return {
                decisions: AccountStore.OwnDecisions,
                choicesInputCount: prevState.choicesInputCount,
                formShown: prevState.formShown,
            };
        });
    }

    addOneChoice() {
        console.log('adding one');
        this.setState(prevState => {
            return {
                decisions: prevState.decisions,
                choicesInputCount: prevState.choicesInputCount + 1,
                formShown: prevState.formShown,
            };
        });
    }

    getChoicesInputs() {
        let resultArr = [],
            i = this.state.choicesInputCount;
        console.log(i);
        while (i>0) {
            i--;
            console.log(i);
            resultArr.push(<input className="choice-input" placeholder="Choice text..." />)
        };
        let result = resultArr.map(input => {
            return input;
        });
        return result;
    }

    getDecisionForm() {
        if (this.state.formShown) {
            let choicesList = this.getChoicesInputs();
            return (
                <div className="decision-creation-form">
                    <h4>Add new decision:</h4>
                    <input id="decision-heading" placeholder="Heading..." />
                    <textarea id="decision-content" placeholder="Content..."></textarea>
                    {choicesList}
                    <button className="btn btn-primary add-more-btn" onClick={this.addOneChoice}>Add more</button>
                    <button className="btn btn-success create-btn" onClick={this.createDecision}>Create decision</button>
                    <button className="btn btn-warning" onClick={this.hideForm}>Cancel creation</button>
                </div>
            );
        } else {
            return (
                <div className="decision-creation-form">
                    <button className="show-creation-form" onClick={this.showForm}>Create new decision</button>
                </div>
            );
        }
    }

    createDecision() {
        let heading = document.getElementById('decision-heading').value,
            content = document.getElementById('decision-content').value,
            choicesData = document.getElementsByClassName('choice-input'),
            choices = [];
        for (let i=0, len=choicesData.length; i<len; i++) {
            choices.push({
                content: choicesData[i].value
            });
        }
        AccountActions.createDecision({
            heading: heading,
            content: content,
            choices: choices
        });
        this.clearInputs();
    }

    render() {
        let decisionForm = this.getDecisionForm(),
            decisionsList = this.state.decisions.reverse().map(decision => {
            return <OwnDecisionItemComponent data={decision} key={decision.id} />
        });
        return (
            <div>
                {decisionForm}
                <div>
                    <h4 className="decisions-heading">Your decisions:</h4>
                    {decisionsList}
                </div>
            </div>
        );
    }

}


module.exports = OwnDecisionsComponent;
