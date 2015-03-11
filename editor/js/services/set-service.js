angular.module('Editor')
    .service('SetService', ['$q', '$http', 'filterFilter', function ($q, $http, filterFilter) {
        'use strict';
        var cache = cache || {};
        
        /**
         * Return a list of set of cards corresponding to the given codes.
         * If codes is null, return the full list.
         */
        function getSets(codes) {
            // var myDataRef = new Firebase(FIREBASE_URL);
            // myDataRef.once('value', function(dataSnapshot) {
            //     var val = dataSnapshot.val();
            //     $scope.sets = val[Object.keys(val)[0]]; //returns the 1st property
            //     console.log('Ready', $scope.sets);
            // });
            var dfr = $q.defer();
            if (cache.sets) {
                dfr.resolve(cache.sets);
            } else {
                $http.get('/editor/data/AllSets.json').success(function (data) {
                    var sets = convertToArray(data);
                    var results = filterSetsByCode(sets, codes);
                    cache.sets = results;
                    dfr.resolve(results);
                }).error(function () {
                    dfr.reject(arguments);
                });
            }
            return dfr.promise;
        }
        
        function convertToArray(data) {
            var sets = [], prop;
            for (prop in data) {
                if (data.hasOwnProperty(prop)) {
                    sets.push(data[prop]);
                }
            }
            return sets;
        }
        
        function filterSetsByCode(sets, codes) {
            return codes ? sets.filter(function(set) {
                return codes.indexOf(set.code);
            }) : sets;
        }

        /**
         * Return a list of cards corresponding to the given multiverse IDs in selectedCards.
         */
        function getCards(selectedCards) {
            var ids = [],
                filteredCards = [],
                dfr = $q.defer();
            selectedCards.forEach(function (elem) {
                ids.push(parseInt(elem, 10));
            });
            getSets().then(function(filteredSets) {
                filteredSets.forEach(function (set) {
                    var results = filterFilter(set.cards, function (card) {
                        return ids.indexOf(card.multiverseid) >= 0;
                    });
                    results.forEach(function(result) {                    
                        filteredCards.push(result);
                    }); 
                });
                dfr.resolve(filteredCards);
            });
            return dfr.promise;
        }
        
        function addToDeck(deckList, selectedCards, setCode) {
            getCards(selectedCards).then(function(filteredCards) {
                filteredCards.forEach(function (card) {
                    if (deckList.indexOf(card) < 0) {
                        deckList.push(card);
                    }
                });
            });
        }

        function removeFromDeck(deckList, selectedCards) {
            getCards(selectedCards).then(function(filteredCards) {
                filteredCards.forEach(function(card) {
                    deckList.splice(indexOfCardInDeck(deckList, card), 1);
                });
            });
        }
        
        function indexOfCardInDeck(deckList, card) {
            for (var i = deckList.length - 1; i >= 0; i--) {
                if (deckList[i].multiverseid === card.multiverseid) {
                    return i;
                }
            }
        }

        return {
            getSets: getSets,
            getCards: getCards,
            addToDeck: addToDeck,
            removeFromDeck: removeFromDeck
        }

    }]);