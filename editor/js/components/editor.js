angular.module('Editor')
    .controller('EditorCtrl', ['$scope', 'SetService', '$timeout', function ($scope, SetService, $timeout, $firebaseObject) {
        'use strict';

        SetService.getSets().then(function (data) {
            $scope.sets = data;
            setFocus('#searchCardName');
        });
        
//        SetService.getMdCards().then(function (data) {
              var ref = new Firebase(FIREBASE_URL + '/mdCards');
              // download the data into a local object
              var syncObject = $firebaseObject(ref);
              // synchronize the object with a three-way data binding
              // click on `index.html` above to see it used in the DOM!
              syncObject.$bindTo($scope, "mdCards");
            
//        });

        $scope.addToMd = function (selectedCards, setCode) {
            SetService.addToDeck($scope.mdCards, selectedCards, [setCode]);
        }

        $scope.removeFromMd = function (selectedCards, setCode) {
            SetService.removeFromDeck($scope.mdCards, selectedCards);
        }
        
        $scope.addToSb = function (selectedCards, setCode) {
            SetService.addToDeck($scope.sbCards, selectedCards, [setCode]);
        }

        $scope.removeFromSb = function (selectedCards, setCode) {
            SetService.removeFromDeck($scope.sbCards, selectedCards);
        }
        
        function setFocus(fieldId) {
            $timeout(function(){
                angular.element(fieldId).focus();
            }, 0);
        }
        
        $scope.getMaxResults = function() {
            return $scope.noLimit ? 10000 : $scope.maxResults;
        }
        
        $scope.mdCards = $scope.mdCards || [];
        $scope.sbCards = $scope.sbCards || [];
        $scope.maxResults = 20;

    }
]);