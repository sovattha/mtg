angular.module('Editor')
    .controller('EditorCtrl', ['$scope', 'SetService', '$timeout', function ($scope, SetService, $timeout) {
        'use strict';

        SetService.getSets().then(function (data) {
            $scope.sets = data;
            setFocus('#searchCardName');
        });

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