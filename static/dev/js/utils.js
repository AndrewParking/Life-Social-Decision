var jQuery = require('jquery');

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function _get_base_url() {
    var prev = window.location.hostname;
    if (prev == '127.0.0.1') {
        return 'http://' + prev + ':8000';
    } else {
        return prev;
    }
}

function getAccountId() {
    let startIndex = _get_base_url().length + '/people/'.length,
        charsCount = window.location.toString().length - startIndex - 1;
    console.log(charsCount);
    return window.location.toString().substr(startIndex, charsCount);
}

module.exports = {

    csrftoken: getCookie('csrftoken'),
    baseUrl: _get_base_url(),
    accountId: getAccountId(),

}
