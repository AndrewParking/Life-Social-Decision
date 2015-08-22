var AppDispatcher = require('./AppDispatcher'),
    AccountConstants = require('./AccountConstants'),
    EventEmitter = require('events').EventEmitter,
    _ = require('underscore');


_accounts = []
_followers = []
_following = []

// Function to fetch accounts data from server
function _get_accounts_data() {
    var request = new XMLHttpRequest(),
        url = window.location.toString().replace('people', 'accounts');

    request.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {

                _accounts = JSON.parse(this.responseText);

            } else {
                console.log('error')
                // error message here
            }
        } else {
            console.log('loading')
            // loader here
        }
    }

    request.open('GET', url, true);
    request.send(null)
}

// Function to fetch followers data from server
function _get_followers_data() {
    var request = new XMLHttpRequest(),
        url = window.location.toString().replace('people', 'accounts')+'followers/';

    request.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {

                _followers = JSON.parse(this.responseText);

            } else {
                console.log('error')
                // error message here
            }
        } else {
            console.log('loading')
            // loader here
        }
    }

    request.open('GET', url, true);
    request.send(null)
}

//Function to fetch following data from server
function _get_following_data() {
    var request = new XMLHttpRequest(),
        url = window.location.toString().replace('people', 'accounts')+'following/';

    request.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {

                _following = JSON.parse(this.responseText);

            } else {
                console.log('error')
                // error message here
            }
        } else {
            console.log('loading')
            // loader here
        }
    }

    request.open('GET', url, true);
    request.send(null)
}

// Function to send following request
function _send_follow_xhr(id) {
    return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest(),
            url = window.location.toString().replace('people', 'accounts')+id+'/follow/';

        request.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 201) {

                    resolve();
                    //_get_accounts_data();
                    //_get_following_data();

                } else {
                    console.log('error')
                    // error message here
                }
            } else {
                console.log('loading')
                // loader here
            }
        }

        request.open('GET', url, true);
        request.send(null);
    });
}

function _send_stop_following_xhr(id) {
    return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest(),
            url = window.location.toString().replace('people', 'accounts')+id+'/stop_following/';

        request.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 204) {

                    resolve();
                    //_get_accounts_data();
                    //_get_following_data();

                } else {
                    console.log('error')
                    // error message here
                }
            } else {
                console.log('loading')
                // loader here
            }
        }

        request.open('GET', url, true);
        request.send(null);
    });
}

/*
    var request = new XMLHttpRequest(),
        url = window.location.toString().replace('people', 'accounts')+id+'/follow/';

    request.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 201) {

                //_get_following_data();
                _get_accounts_data();
                _get_following_data();

            } else {
                console.log('error')
                // error message here
            }
        } else {
            console.log('loading')
            // loader here
        }
    }

    request.open('GET', url, true);
    request.send(null);
}

function _send_stop_following_xhr(id) {
    var request = new XMLHttpRequest(),
        url = window.location.toString().replace('people', 'accounts')+id+'/stop_following/';

    request.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 204) {

                //_get_following_data();
                _get_accounts_data();
                _get_following_data();

            } else {
                console.log('error')
                // error message here
            }
        } else {
            console.log('loading')
            // loader here
        }
    }

    request.open('GET', url, true);
    request.send(null);
}
*/

var AccountStore = _.extend({}, EventEmitter.prototype, {

    getAccounts: function() {
        console.log(_accounts);
        return _accounts;
    },

    getFollowing: function() {
        return _following;
    },

    getFollowers: function() {
        return _followers;
    },

    emitChange: function() {
        this.emit('change');
    },

    addChangeListener: function(callback) {
        this.on('change', callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener('change', callback);
    },

    fetchData: function() {
        _get_followers_data();
        _get_following_data();
        _get_accounts_data();
        setTimeout(this.emitChange.bind(this), 500);
    },

});

AppDispatcher.register(function(payload) {
    switch(payload.actionType) {
        case AccountConstants.FOLLOW:
            _send_follow_xhr(payload.id)
            .then(_get_accounts_data(), null)
            .then(_get_following_data(), null)
            .then(AccountStore.emitChange(), null);
        case AccountConstants.STOP_FOLLOWING:
            _send_stop_following_xhr(payload.id)
            .then(_get_accounts_data(), null)
            .then(_get_following_data(), null)
            .then(AccountStore.emitChange(), null);
    }
    return true;
});

module.exports = AccountStore;
