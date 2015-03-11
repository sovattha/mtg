angular.module('Editor')
    .controller('EditorCtrl', ['$scope', 'SetService', function ($scope, SetService) {
        'use strict';

        $scope.mdCards = $scope.mdCards || [];
        $scope.sbCards = $scope.sbCards || [];
        $scope.limit = 20;

        SetService.getSets().then(function (data) {
            $scope.sets = data;
        });

        $scope.addToMd = function (selectedCards, setCode) {
            SetService.addToDeck($scope.mdCards, selectedCards, setCode);
        }

        $scope.addToSb = function (selectedCards, setCode) {
            SetService.addToDeck($scope.sbCards, selectedCards, setCode);
        }

        $scope.removeFromMd = function (selectedCards, setCode) {
            SetService.removeFromDeck($scope.mdCards, selectedCards, setCode);
        }

        $scope.addToremoveFromSb = function (selectedCards, setCode) {
            SetService.removeFromDeck($scope.sbCards, selectedCards, setCode);
        }

    }
]);