angular.module('Editor')
    .controller('EditorCtrl', ['$scope', 'SetService', '$timeout', '$firebaseArray', 'filterFilter', function ($scope, SetService, $timeout, $firebaseArray, filterFilter) {
        'use strict';
        
        $scope.standardSets = ['JOU', 'BNG', 'THS', 'M15', 'KTK', 'FRF', 'DTK'];

        SetService.getSets().then(function (data) {
            $scope.sets = data;
            setFocus('#searchCardName');
        });
            
        function syncScopeWithFirebase(objectName) {
            var ref = new Firebase(FIREBASE_URL + '/' + objectName);
            $scope[objectName] = $firebaseArray(ref);
        }
        
        syncScopeWithFirebase('mdCards');
        syncScopeWithFirebase('sbCards');
        
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
        $scope.noLimit = true;
        $scope.standardFormat = true;
        
        $scope.filterSets = function(set) {
            return $scope.standardFormat ? $scope.standardSets.indexOf(set.code) >= 0 : true;
        }

    }
]);