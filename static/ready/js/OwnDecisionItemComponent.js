'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react'),
    AccountActions = require('./AccountActions'),
    AccountStore = require('./AccountStore');

var OwnDecisionItemComponent = (function (_React$Component) {
    _inherits(OwnDecisionItemComponent, _React$Component);

    function OwnDecisionItemComponent() {
        _classCallCheck(this, OwnDecisionItemComponent);

        _get(Object.getPrototypeOf(OwnDecisionItemComponent.prototype), 'constructor', this).call(this);
        this.getMaxVotes = this.getMaxVotes.bind(this);
        this.deleteDecision = this.deleteDecision.bind(this);
    }

    _createClass(OwnDecisionItemComponent, [{
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
        key: 'deleteDecision',
        value: function deleteDecision() {
            AccountActions.deleteDecision(this.props.data.id);
        }
    }, {
        key: 'render',
        value: function render() {
            var maxVotes = this.getMaxVotes(),

            // getting choice list
            choices_list = this.props.data.choices.map(function (choice) {
                var widthStyle = {
                    width: maxVotes !== 0 ? Math.floor(choice.votes / maxVotes) * 450 + 20 : 20
                };
                return React.createElement("div", { className: "choice", key: choice.id }, React.createElement("p", { className: "vote-link" }, React.createElement("a", { className: "not-active" }, choice.content), React.createElement("span", null, choice.votes)), React.createElement("div", { className: "indicator", style: widthStyle }));
            });

            return React.createElement("div", { className: "decision" }, React.createElement("div", { className: "panel-body" }, React.createElement("h4", null, this.props.data.heading, React.createElement("button", { className: "btn btn-primary", onClick: this.deleteDecision }, "Delete")), React.createElement("div", { className: "decision-content" }, React.createElement("p", null, this.props.data.content), React.createElement("div", { className: "choices-list" }, choices_list))));
        }
    }]);

    return OwnDecisionItemComponent;
})(React.Component);

module.exports = OwnDecisionItemComponent;