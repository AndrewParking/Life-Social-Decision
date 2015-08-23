var AppDispatcher = require('./AppDispatcher'),
    AccountConstants = require('./AccountConstants'),
    EventEmitter = require('events').EventEmitter,
    _ = require('underscore');

var _following = [];

var _first_3_followers = [];

function _get_base_url() {
    var prev = window.location.hostname;
    if (prev == '127.0.0.1') {
        return 'http://' + prev + ':8000';
    } else {
        return prev;
    }
}

function _get_following_data() {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest(),
            url = _get_base_url() + '/accounts/following/';

        request.onload = function () {
            if (this.status == 200) {
                _following = JSON.parse(this.responseText);
                console.log('Array got from response text ->> ', _following);
                resolve(this.responseText);
            } else {
                reject(this.responseText);
            }
        };

        request.open('GET', url, true);
        request.send(null);
    });
}

function _get_first_3_followers() {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest(),
            url = _get_base_url() + '/accounts/first_3_followers/';

        request.onload = function () {
            if (this.status == 200) {
                _first_3_followers = JSON.parse(this.responseText);
                resolve(this.responseText);
            } else {
                console.log(this.responseText);
            }
        };

        request.open('GET', url, true);
        request.send(null);
    });
}

// Function to send following request
function _send_follow_xhr() {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest(),
            url = window.location.toString().replace('people', 'accounts') + 'follow/';

        request.onload = function () {
            if (this.status == 201) {
                console.log(url);
                resolve(this.status);
            } else {
                reject(this.status);
            }
        };

        request.open('GET', url, true);
        request.send(null);
    });
}


function _send_stop_following_xhr() {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest(),
            url = window.location.toString().replace('people', 'accounts') + 'stop_following/';

        request.onload = function () {
            if (this.status == 204) {
                console.log(url);
                resolve(this.status);
            } else {
                reject(this.status);
            }
        };

        request.open('GET', url, true);
        request.send(null);
    });
}

// ========== Account Store Class definition ============

class AccountStoreClass extends EventEmitter {

    fetchData() {
        _get_following_data()
            .then(result => {
                console.log('Response ->>', result);
                return _get_first_3_followers();
            }, error => {
                console.log('following data got with the error')
            })
            .then(result => {
                this.emitChange();
            }, error => {
                console.log('followers data got with error');
            });
    }

    getBaseUrl() {
        return _get_base_url();
    }

    getAccountId() {
        return window.location.toString().substr(-2, 1);
    }

    getFollowingData() {
        return _following;
    }

    getFirst3Following() {
        return _following.splice(0, 3);
    }

    getFirst3Followers() {
        return _first_3_followers;
    }

    emitChange() {
        this.emit('change');
    }

    addChangeListener(callback) {
        this.on('change', callback);
    }

    removeChangeListener(callback) {
        this.removeChangeListener('change', callback);
    }

}

var AccountStore = new AccountStoreClass();
//console.log(AccountStore);

AppDispatcher.register(function(payload) {
    switch (payload.actionType) {
        case AccountConstants.FOLLOW:
            _send_follow_xhr().then(result => {
                AccountStore.fetchData();
            }, error => {
                console.log(error);
            });
            break;
        case AccountConstants.STOP_FOLLOWING:
            _send_stop_following_xhr().then(result => {
                AccountStore.fetchData();
            }, error => {
                console.log(error);
            });
            break;
    }
    return true;
});

module.exports = AccountStore;
