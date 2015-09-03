'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react'),
    AccountStore = require('./AccountStore'),
    AccountActions = require('./AccountActions'),
    OwnDecisionItemComponent = require('./OwnDecisionItemComponent');

var OwnDecisionsComponent = (function (_React$Component) {
    _inherits(OwnDecisionsComponent, _React$Component);

    function OwnDecisionsComponent() {
        _classCallCheck(this, OwnDecisionsComponent);

        _get(Object.getPrototypeOf(OwnDecisionsComponent.prototype), 'constructor', this).call(this);
        this.state = {
            decisions: AccountStore.OwnDecisions,
            choicesInputCount: 2
        };
        console.log('decisions ==> ', this.state.decisions);
        this._onChange = this._onChange.bind(this);
        this.getChoicesInputs = this.getChoicesInputs.bind(this);
        this.addOneChoice = this.addOneChoice.bind(this);
        this.createDecision = this.createDecision.bind(this);
        this.clearInputs = this.clearInputs.bind(this);
    }

    _createClass(OwnDecisionsComponent, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            AccountStore.addChangeListener(this._onChange);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            AccountStore.removeChangeListener(this._onChange);
        }
    }, {
        key: 'clearInputs',
        value: function clearInputs() {
            document.getElementById('decision-heading').value = '';
            document.getElementById('decision-content').value = '';
            var choiceInputs = document.getElementsByClassName('choice-input');
            for (var i = 0, len = choiceInputs.length; i < len; i++) {
                choiceInputs[i].value = '';
            }
            this.setState(function (prevState) {
                return {
                    decisions: prevState.decisions,
                    choicesInputCount: 2
                };
            });
        }
    }, {
        key: '_onChange',
        value: function _onChange() {
            this.setState(function (prevState) {
                return {
                    decisions: AccountStore.OwnDecisions,
                    choicesInputCount: prevState.choicesInputCount
                };
            });
        }
    }, {
        key: 'addOneChoice',
        value: function addOneChoice() {
            console.log('adding one');
            this.setState(function (prevState) {
                return {
                    decisions: prevState.decisions,
                    choicesInputCount: prevState.choicesInputCount + 1
                };
            });
        }
    }, {
        key: 'getChoicesInputs',
        value: function getChoicesInputs() {
            var resultArr = [],
                i = this.state.choicesInputCount;
            console.log(i);
            while (i > 0) {
                i--;
                console.log(i);
                resultArr.push(React.createElement("input", { className: "choice-input", placeholder: "Choice text..." }));
            };
            var result = resultArr.map(function (input) {
                return input;
            });
            return result;
        }
    }, {
        key: 'createDecision',
        value: function createDecision() {
            var heading = document.getElementById('decision-heading').value,
                content = document.getElementById('decision-content').value,
                choicesData = document.getElementsByClassName('choice-input'),
                choices = [];
            for (var i = 0, len = choicesData.length; i < len; i++) {
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
    }, {
        key: 'render',
        value: function render() {
            var choicesList = this.getChoicesInputs(),
                decisionsList = this.state.decisions.reverse().map(function (decision) {
                return React.createElement(OwnDecisionItemComponent, { data: decision, key: decision.id });
            });
            return React.createElement("div", null, React.createElement("div", { className: "decision-creation-form" }, React.createElement("h4", null, "Add new decision:"), React.createElement("input", { id: "decision-heading", placeholder: "Heading..." }), React.createElement("textarea", { id: "decision-content", placeholder: "Content..." }), choicesList, React.createElement("button", { className: "btn btn-primary add-more-btn", onClick: this.addOneChoice }, "Add more"), React.createElement("button", { className: "btn btn-success", onClick: this.createDecision }, "Create decision")), React.createElement("div", null, React.createElement("h4", { className: "decisions-heading" }, "Your decisions:"), decisionsList));
        }
    }]);

    return OwnDecisionsComponent;
})(React.Component);

module.exports = OwnDecisionsComponent;