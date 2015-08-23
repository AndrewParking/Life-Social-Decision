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

//Function to fetch following data from server
function _get_following_data() {
    var request = new XMLHttpRequest(),
        url = _get_base_url() + '/accounts/following/';

    request.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {

                _following = JSON.parse(this.responseText);
                AccountStore.emitChange();

            } else {}
        } else {}
    }

    request.open('GET', url, true);
    request.send(null)
}

function _get_first_3_followers() {
    var request = new XMLHttpRequest(),
        url = _get_base_url() + '/accounts/first_3_followers/';

    request.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {

                _first_3_followers = JSON.parse(this.responseText);
                AccountStore.emitChange();

            } else {}
        } else {}
    }

    request.open('GET', url, true);
    request.send(null)
}

// Function to send following request
function _send_follow_xhr(id) {
    var request = new XMLHttpRequest(),
        url = window.location.toString().replace('people', 'accounts')+'follow/';

    request.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 201) {
                /*
                _following.push({
                    id: id,
                })
                */
                _get_following_data();

            } else {}
        } else {}
    }

    request.open('GET', url, true);
    request.send(null);
}

function _send_stop_following_xhr(id) {
    var request = new XMLHttpRequest(),
        url = window.location.toString().replace('people', 'accounts')+'stop_following/';

    console.log(url);
    request.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 204) {
                /*
                var delIndex = 0;

                for(var i=0, len=_following.length; i<len; i++) {
                    if (_following.id == id) {
                        delIndex = i;
                        break;
                    }
                }
                _following.splice(delIndex, 1);
                AccountStore.emitChange();
                */
                _get_following_data();

            } else {}
        } else {}
    }

    request.open('GET', url, true);
    request.send(null);
}



// ========== Account Store definition ============

var AccountStore = _.extend({}, EventEmitter.prototype, {

    fetchFollowingData: function() {
        _get_following_data();
    },

    fetchFollowersData: function() {
        _get_first_3_followers();
    },

    getBaseUrl: function() {
        return _get_base_url();
    },

    getAccountId: function() {
        return window.location.toString().substr(-2, 1);
    },

    getFollowingData: function() {
        return _following;
    },

    getFirst3Following: function() {
        return _following.splice(0, 3);
    },

    getFirst3Followers: function() {
        return _first_3_followers;
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

});

AppDispatcher.register(function(payload) {
    switch(payload.actionType) {
        case AccountConstants.FOLLOW:
            _send_follow_xhr(payload.id);
            break;
        case AccountConstants.STOP_FOLLOWING:
            _send_stop_following_xhr(payload.id);
            break;
    }
    return true;
});

module.exports = AccountStore;
