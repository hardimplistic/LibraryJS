$(function() {
    var url = '/api/json';
    var parameter = {
        key: 'value'
    };
    PJsonCall(url, parameter)
        .then(
            function(response) {
                console.log('fulfillment', response);
                throw new Error('i need catch!');
            },
            function(reason) {
                console.log('rejection', reason);
            }
        )
        .catch(
            function(reason) {
                console.log('[catch]', reason);
            })
        .finally(
            function() {
                console.log('finally');
            });
});