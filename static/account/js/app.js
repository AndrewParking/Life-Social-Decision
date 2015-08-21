var React = require('react'),
    AccountListComponent = require('./AccountListComponent');

function getInitialData() {
    var request = new XMLHttpRequest(),
        url = window.location.toString().replace('people', 'accounts');

    console.log(url);

    request.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {

                var initialData = JSON.parse(this.responseText);
                React.render(
                    React.createElement(AccountListComponent, {data: initialData}),
                    document.getElementById('account-container')
                );

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

getInitialData();
