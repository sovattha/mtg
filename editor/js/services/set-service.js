angular.module('Editor')
    .service('SetService', ['$q', '$http', 'filterFilter', function ($q, $http, filterFilter, $firebaseObject) {
        'use strict';
        var cache = cache || {};
        
        /**
         * Return a list of set of cards corresponding to the given codes.
         * If codes is null, return the full list.
         */
        function getSets(codes) {
            var dfr = $q.defer();
            if (cache.sets) {
                dfr.resolve(filterSetsByCode(cache.sets, codes));
            } else {
                $http.get('data/AllSets.json').success(function (data) {
                    dfr.resolve(processResults(data, codes));
                });
            }
            return dfr.promise;
        }
        
        function processResults(data, codes) {
            cache.sets = _.toArray(data);
            cache.sets = filterSetsByCode(cache.sets, codes);
            return cache.sets;
        }
        
        function filterSetsByCode(sets, codes) {
            return codes ? _.filter(sets, function(set) {
                return _.indexOf(codes, set.code) >= 0;
            }) : sets;
        }

        /**
         * Return a list of cards corresponding to the given multiverse IDs in selectedCards, 
         * among the given sets corresponding to the given setCodes.
         */
        function getCards(selectedCards, setCodes) {
            var filteredCards = [],
                dfr = $q.defer();
            getSets(setCodes).then(function(filteredSets) {
                dfr.resolve(_.filter(_.flatten(filteredSets.map(function(s) {
                    return s.cards;
                })), function(c) {
                    return _.indexOf(selectedCards, c.multiverseid + '') >= 0;
                }));
            });
            return dfr.promise;
        }
        
        /**
         * Add the given selectedCards to the given deckList
         */
        function addToDeck(deckList, selectedCards, setCodes) {
            getCards(selectedCards, setCodes).then(function(filteredCards) {
                filteredCards.forEach(function(card) {
                    var cardInDeck = getCardInDeck(card.name, deckList);
                    if (cardInDeck.length) {
                        cardInDeck[0].quantity++;
                        deckList.$save(cardInDeck[0]);
                    } else {
                        deckList.$add({
                            card: {
                                multiverseid: card.multiverseid,
                                name: card.name
                            },
                            quantity: 1
                        });
                    }
                });
            });
        }
        
        function getCardInDeck(cardName, deckList) {
            return _.filter(deckList, function (d) {
                return d.card.name === cardName
            });
        }

        /**
         * Remove the given selectedCards to the given deckList
         */
        function removeFromDeck(deckList, selectedCards) {
            getCards(selectedCards).then(function(filteredCards) {
                filteredCards.forEach(function(card) {
                    var cardInDeck = getCardInDeck(card.name, deckList);
                    if (cardInDeck.length) {
                        if (--cardInDeck[0].quantity === 0) {
                            deckList.$remove(cardInDeck[0]);
                        } else {
                            deckList.$save(cardInDeck[0]);
                        }
                    }
                });
            });
        }
        
        function indexOfCardInDeck(deckList, card) {
            return _.indexOf(deckList.map(function (o) {
                return o.multiverseid;
            }), card.multiverseid);
        }

        return {
            getSets: getSets,
            getCards: getCards,
            addToDeck: addToDeck,
            removeFromDeck: removeFromDeck
        }

    }]);