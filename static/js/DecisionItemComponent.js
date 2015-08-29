'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react'),
    AccountActions = require('./AccountActions'),
    AccountStore = require('./AccountStore');

var DecisionItemComponent = (function (_React$Component) {
    _inherits(DecisionItemComponent, _React$Component);

    function DecisionItemComponent() {
        _classCallCheck(this, DecisionItemComponent);

        _get(Object.getPrototypeOf(DecisionItemComponent.prototype), 'constructor', this).call(this);
        this.getMaxVotes = this.getMaxVotes.bind(this);
        this.vote = this.vote.bind(this);
        this.cancelVote = this.cancelVote.bind(this);
        this.getCancelVoteButton = this.getCancelVoteButton.bind(this);
    }

    _createClass(DecisionItemComponent, [{
        key: 'vote',
        value: function vote(choiceId) {
            AccountActions.vote(choiceId);
        }
    }, {
        key: 'cancelVote',
        value: function cancelVote() {
            AccountActions.cancelVote(this.props.data.id);
        }
    }, {
        key: 'getMaxVotes',
        value: function getMaxVotes() {
            var choices = this.props.data.choices,
                maxVotes = 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = choices[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var choice = _step.value;

                    if (choice.votes > maxVotes) {
                        maxVotes = choice.votes;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator['return']) {
                        _iterator['return']();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return maxVotes;
        }
    }, {
        key: 'getCancelVoteButton',
        value: function getCancelVoteButton() {
            if (this.props.data.already_voted) {
                return React.createElement("button", { className: "cancel-vote", onClick: this.cancelVote }, "Cancel vote");
            } else {
                return "";
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this = this;

            var maxVotes = this.getMaxVotes(),
                cancelVoteButton = this.getCancelVoteButton(),

            // getting choice list
            choices_list = this.props.data.choices.map(function (choice) {
                var widthStyle = {
                    width: Math.floor(choice.votes / maxVotes) * 450 + 40
                },
                    voteLink = undefined;

                // deciding whether the vote links should be active or not
                if (_this.props.data.already_voted) {
                    voteLink = React.createElement("p", null, choice.content, " ", React.createElement("span", null, choice.votes));
                } else {
                    voteLink = React.createElement("p", null, React.createElement("a", { onClick: _this.vote.bind(_this, choice.id) }, choice.content), React.createElement("span", null, choice.votes));
                }

                return React.createElement("div", { className: "choice", key: choice.id }, voteLink, React.createElement("div", { className: "indicator", style: widthStyle }));
            });

            return React.createElement("div", { className: "decision" }, React.createElement("div", { className: "panel-body" }, React.createElement("h4", null, this.props.data.heading), React.createElement("div", { className: "decision-content" }, cancelVoteButton, React.createElement("p", null, this.props.data.content), React.createElement("div", { className: "choices-list" }, choices_list))));
        }
    }]);

    return DecisionItemComponent;
})(React.Component);

module.exports = DecisionItemComponent;