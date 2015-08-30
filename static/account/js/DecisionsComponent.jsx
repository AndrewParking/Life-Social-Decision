var React = require('react'),
    DecisionItemComponent = require('./DecisionItemComponent'),
    AccountStore = require('./AccountStore');


class DecisionsComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            decisions: AccountStore.Decisions
        };
        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        AccountStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        AccountStore.removeChangeListener(this._onChange);
    }

    _onChange() {
        this.setState({
            decisions: AccountStore.Decisions
        });
    }

    render() {
        let decisions_list = this.state.decisions.map(decision => {
            return <DecisionItemComponent data={decision} key={decision.id} />
        });
        return (
            <div>
                {decisions_list}
            </div>
        );
    }

}


module.exports = DecisionsComponent;
