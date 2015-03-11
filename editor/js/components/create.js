angular.module('Editor')
    .controller('CreateCtrl', ['$http', '$scope', function ($http, $scope) {
        'use strict';

        function createSets() {
            $http.get('/editor/data/AllSets.json')
                .success(function (data) {
                    var sets = [],
                        prop,
                        myDataRef = new Firebase(FIREBASE_URL);
                    for (prop in data) {
                        if (data.hasOwnProperty(prop)) {
                            sets.push(data[prop]);
                        }
                    }
                    data = myDataRef.push(data);
                    console.log(data);
                    $scope.data = 'OK';
                })
                .error(function () {
                    console.error(arguments);
                });
        }
        createSets();
    }
]);