angular.module('Editor')
    .service('SetService', ['$q', '$http', 'filterFilter', function ($q, $http, filterFilter) {
        'use strict';
        var cache = cache || {};
        var dev = true;
        
        /**
         * Return a list of set of cards corresponding to the given codes.
         * If codes is null, return the full list.
         */
        function getSets(codes) {
            var dfr = $q.defer();
            if (cache.sets) {
                var results = filterSetsByCode(cache.sets, codes);
                dfr.resolve(results);
            } else {
                if (dev) {
                    $http.get('data/AllSets.json').success(function (data) {
                        dfr.resolve(processResults(data, codes));
                    });
                } else {
                    var myDataRef = new Firebase(FIREBASE_URL);
                    myDataRef.once('value', function (dataSnapshot) {
                        var data = dataSnapshot.val();
                        console.log('Ready', data);
                        dfr.resolve(processResults(data, codes));
                    });
                }
            }
            return dfr.promise;
        }
        
        function processResults(data, codes) {
            var sets = convertToArray(data);
            var results = filterSetsByCode(sets, codes);
            cache.sets = results;
            return results;
        }
        
        function convertToArray(data) {
            return _.toArray(data);
        }
        
        function filterSetsByCode(sets, codes) {
            return codes ? _.filter(sets, function(set) {
                return codes.indexOf(set.code) >= 0;
            }) : sets;
        }

        /**
         * Return a list of cards corresponding to the given multiverse IDs in selectedCards.
         */
        function getCards(selectedCards, setCode) {
            var filteredCards = [],
                dfr = $q.defer();
            getSets(setCode).then(function(filteredSets) {
                filteredCards = _.flatten(filteredSets.map(function(s) {
                    return s.cards;
                })).filter(function(c) {
                    return _.indexOf(selectedCards, c.multiverseid + '') >= 0;
                });
                dfr.resolve(filteredCards);
            });
            return dfr.promise;
        }
        
        /**
         * Add the given selectedCards to the given deckList
         */
        function addToDeck(deckList, selectedCards, setCode) {
            getCards(selectedCards, setCode).then(function(filteredCards) {
                filteredCards.forEach(function (card) {
                    var qty = 0;
                    var index = deckList.indexOf(card);
                    if (index < 0) {
                        deckList.push(card);
                        card.quantity = ++qty;
                    } else {
                        ++deckList[index].quantity;
                    }
                });
            });
        }

        function removeFromDeck(deckList, selectedCards) {
            getCards(selectedCards).then(function(filteredCards) {
                filteredCards.forEach(function(card) {
                    var index = indexOfCardInDeck(deckList, card);
                    --deckList[index].quantity;
                    if (deckList[index].quantity == 0) {
                        deckList.splice(indexOfCardInDeck(deckList, card), 1);
                    }
                });
            });
        }
        
        function indexOfCardInDeck(deckList, card) {
            return deckList.map(function (o) {
                return o.multiverseid;
            }).indexOf(card.multiverseid);
        }

        return {
            getSets: getSets,
            getCards: getCards,
            addToDeck: addToDeck,
            removeFromDeck: removeFromDeck
        }

    }]);