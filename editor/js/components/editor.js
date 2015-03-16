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
            if (!selectedCards) {
                var matchingSets = filterFilter($scope.sets, $scope.term);
                var selectedSet = matchingSets[0];
                var matchingCards = filterFilter(selectedSet.cards, $scope.term.cards);
                if (matchingSets.length === 1 && matchingCards.length === 1) {
                    var selectedCard = filterFilter(selectedSet.cards, $scope.term.cards)[0];
                    SetService.addToDeck($scope.mdCards, [selectedCard.multiverseid + ''], [selectedSet.code]);
                }
            }
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
        
        $scope.sumMdCards = function() {
            return $scope.mdCards.reduce(function(pv, cv) { return pv + cv.quantity; }, 0);
        }
        
        $scope.sumSbCards = function() {
            return $scope.sbCards.reduce(function(pv, cv) { return pv + cv.quantity; }, 0);
        }

    }
]).directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter, {'event': event});
                });

                event.preventDefault();
            }
        });
    };
});