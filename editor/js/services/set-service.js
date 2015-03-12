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
                dfr.resolve(filterSetsByCode(cache.sets, codes));
            } else {
                if (dev) {
                    $http.get('data/AllSets.json').success(function (data) {
                        dfr.resolve(processResults(data, codes));
                    });
                } else {
                    var myDataRef = new Firebase(FIREBASE_URL + '/sets');
                    myDataRef.once('value', function (dataSnapshot) {
                        var data = dataSnapshot.val();
                        console.log('Ready', data);
                        dfr.resolve(processResults(data, codes));
                    });
                }
            }
            return dfr.promise;
        }
        
        function getMdCards() {
            var dfr = $q.defer();
           
            var myDataRef = new Firebase(FIREBASE_URL + '/mdCards');
            myDataRef.on('value', function (dataSnapshot) {
                var data = dataSnapshot.val();
                console.log('Main deck', data);
                data = data || [];
                dfr.resolve(data);
            });
                
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
                    var cardInDeck = _.where(deckList, {
                        card: card
                    });
                    if (cardInDeck.length) {
                        cardInDeck[0].quantity++;
                    } else {
                        deckList.push({
                            card: card,
                            quantity: 1
                        });
                    }
                });
                var myDataRef = new Firebase(FIREBASE_URL + '/mdCards/');
                var d = deckList.map(function (d) {
                        return {
                            card: {
                                name: d.card.name,
                                multiverseid: d.card.multiverseid
                            },
                            quantity: d.quantity
                        };
                    });
                myDataRef.set(
                    d
                );
            });
        }

        /**
         * Remove the given selectedCards to the given deckList
         */
        function removeFromDeck(deckList, selectedCards) {
            getCards(selectedCards).then(function(filteredCards) {
                filteredCards.forEach(function(card) {
                    var cardInDeck = _.where(deckList, {
                        card: card
                    });
                    if (cardInDeck.length) {
                        if (--cardInDeck[0].quantity === 0) {
                            deckList.pop(cardInDeck[0]);
                        }
                    }
                });
                var myDataRef = new Firebase(FIREBASE_URL + '/mdCards/');
                myDataRef.push(deckList);
            });
        }
        
        function indexOfCardInDeck(deckList, card) {
            return _.indexOf(deckList.map(function (o) {
                return o.multiverseid;
            }), card.multiverseid);
        }

        return {
            getSets: getSets,
            getMdCards: getMdCards,
            getCards: getCards,
            addToDeck: addToDeck,
            removeFromDeck: removeFromDeck
        }

    }]);