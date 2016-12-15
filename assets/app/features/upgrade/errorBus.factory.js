(function() {

    angular
        .module('suseData.crowbar')
        .factory('errorBusFactory', errorBusFactory);

    function errorBusFactory() {
        var factory = {
            printError: printError,
        };

        return factory;

        function printError(error) {
            console.log(error);
        }
    }
})();