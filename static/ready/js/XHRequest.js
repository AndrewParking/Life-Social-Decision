'use strict';

var csrftoken = require('./utils').csrftoken,
    baseUrl = require('./utils').baseUrl,
    accountId = require('./utils').accountId;

module.exports = {

    _get_foreign_decisions: function _get_foreign_decisions() {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest(),
                url = baseUrl + '/accounts/' + accountId + '/decisions/';

            request.onload = function () {
                if (this.status == 200) {
                    resolve(JSON.parse(this.responseText));
                } else {
                    reject(this.responseText);
                }
            };

            request.open('GET', url, true);
            request.send(null);
        });
    },

    _get_own_decisions: function _get_own_decisions() {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest(),
                url = baseUrl + '/decisions-api/decisions/own_decisions/';

            request.onload = function () {
                if (this.status == 200) {
                    resolve(JSON.parse(this.responseText));
                } else {
                    reject(this.responseText);
                }
            };

            request.open('GET', url, true);
            request.send(null);
        });
    },

    _create_decision_xhr: function _create_decision_xhr(data) {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest(),
                url = baseUrl + '/decisions-api/decisions/';

            request.onload = function () {
                if (this.status == 201) {
                    resolve(this.responseText);
                } else {
                    reject(this.responseText);
                }
            };

            request.open('POST', url, true);
            request.setRequestHeader('Content-Type', 'application/json');
            request.setRequestHeader("X-CSRFToken", csrftoken);
            request.send(JSON.stringify(data));
        });
    },

    _delete_decision_xhr: function _delete_decision_xhr(id) {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest(),
                url = baseUrl + '/decisions-api/decisions/' + id + '/';

            request.onload = function () {
                if (this.status == 204) {
                    resolve(this.responseText);
                } else {
                    reject(this.responseText);
                }
            };

            request.open('DELETE', url, true);
            request.setRequestHeader("X-CSRFToken", csrftoken);
            request.send(null);
        });
    },

    _vote_xhr: function _vote_xhr(choiceId) {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest(),
                url = baseUrl + '/decisions-api/votes/';

            request.onload = function () {
                if (this.status == 201) {
                    resolve(this.responseText);
                } else {
                    reject(this.responseText);
                }
            };

            request.open('POST', url, true);
            request.setRequestHeader('Content-Type', 'application/json');
            request.setRequestHeader("X-CSRFToken", csrftoken);
            request.send(JSON.stringify({ choice: choiceId }));
        });
    },

    _cancel_vote_xhr: function _cancel_vote_xhr(decisionId) {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest(),
                url = baseUrl + '/decisions-api/decisions/' + decisionId + '/cancel_vote/';

            request.onload = function () {
                if (this.status == 204) {
                    resolve(this.responseText);
                } else {
                    reject(this.responseText);
                }
            };

            request.open('DELETE', url, true);
            request.setRequestHeader("X-CSRFToken", csrftoken);
            request.send(null);
        });
    },

    _get_following_data: function _get_following_data() {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest(),
                url = baseUrl + '/accounts/following/';

            request.onload = function () {
                if (this.status == 200) {
                    resolve(JSON.parse(this.responseText));
                } else {
                    reject(this.responseText);
                }
            };

            request.open('GET', url, true);
            request.send(null);
        });
    },

    _get_incoming_messages: function _get_incoming_messages() {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest(),
                url = baseUrl + '/communication/messages/incoming/';

            request.onload = function () {
                if (this.status == 200) {
                    resolve(JSON.parse(this.responseText).reverse());
                } else {
                    console.log(this.responseText);
                }
            };

            request.open('GET', url, true);
            request.send(null);
        });
    },

    _get_outcoming_messages: function _get_outcoming_messages() {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest(),
                url = baseUrl + '/communication/messages/outcoming/';

            request.onload = function () {
                if (this.status == 200) {
                    console.log('outmes -> ', JSON.parse(this.responseText));
                    resolve(JSON.parse(this.responseText).reverse());
                } else {
                    console.log(this.responseText);
                }
            };

            request.open('GET', url, true);
            request.send(null);
        });
    },

    _send_remove_message_xhr: function _send_remove_message_xhr(id) {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest(),
                url = baseUrl + ('/communication/messages/' + id + '/remove/');

            request.onload = function () {
                if (this.status == 200) {
                    resolve(id);
                } else {
                    reject(this.responseText);
                }
            };

            request.open('PATCH', url, true);
            request.setRequestHeader("X-CSRFToken", csrftoken);
            request.send(null);
        });
    },

    _send_read_message_xhr: function _send_read_message_xhr(id) {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest(),
                url = baseUrl + ('/communication/messages/' + id + '/read/');

            request.onload = function () {
                if (this.status == 200) {
                    resolve(id);
                } else {
                    reject(this.responseText);
                }
            };

            request.open('PATCH', url, true);
            request.setRequestHeader("X-CSRFToken", csrftoken);
            request.send(null);
        });
    },

    _send_message_xhr: function _send_message_xhr(toAccountId, content) {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest(),
                url = baseUrl + '/communication/messages/',
                data = {
                to_account: toAccountId,
                content: content
            };

            request.onload = function () {
                if (this.status == 201) {
                    resolve(this.responseText);
                } else {
                    reject(this.responseText);
                }
            };

            request.open('POST', url, true);
            request.setRequestHeader('X-CSRFToken', csrftoken);
            request.setRequestHeader('Content-Type', 'application/json');
            request.send(JSON.stringify(data));
        });
    },

    _send_follow_xhr: function _send_follow_xhr() {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest(),
                url = window.location.toString().replace('people', 'accounts') + 'follow/';

            request.onload = function () {
                if (this.status == 201) {
                    var result = JSON.parse(this.responseText);
                    resolve(result);
                } else {
                    reject(this.status);
                }
            };

            request.open('GET', url, true);
            request.send(null);
        });
    },

    _send_stop_following_xhr: function _send_stop_following_xhr() {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest(),
                url = window.location.toString().replace('people', 'accounts') + 'stop_following/';

            request.onload = function () {
                if (this.status == 204) {
                    resolve(accountId);
                } else {
                    reject(this.status);
                }
            };

            request.open('GET', url, true);
            request.send(null);
        });
    }

};