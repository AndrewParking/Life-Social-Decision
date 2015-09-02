'use strict';

var AccountStore = require('./AccountStore');

module.exports = {

    _get_foreign_decisions: function _get_foreign_decisions() {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest(),
                url = AccountStore.BaseUrl + '/accounts/' + AccountStore.AccountId + '/decisions/';

            console.log(AccountStore);

            request.onload = function () {
                if (this.status == 200) {
                    AccountStore.Decisions = JSON.parse(this.responseText);
                    resolve(this.responseText);
                } else {
                    reject(this.responseText);
                }
            };

            request.open('GET', url, true);
            request.send(null);
        });
    }

};