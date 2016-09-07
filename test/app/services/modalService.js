// INITILIZE SERVICE
// ============================================================
angular.module("app")
	.service("modalService", function($http, ModalService, $q) {

		// GAME MODALS
		// ============================================================
		this.roundStart = function(player, user) {
			var defered = $q.defer();
			ModalService.showModal({
					templateUrl: './app/modals/roundStart/roundStartModalTmpl.html',
					controller: 'roundStartModalCtrl',
					inputs: {
						player: player,
						user: user
					}
				})
				.then(function(modal) {
					modal.close.then(function(target) {
						defered.resolve(target);
					});
				});
			return defered.promise;
		};

		this.selectTarget = function(players, user) {
			var defered = $q.defer();
			ModalService.showModal({
					templateUrl: './app/modals/selectTarget/selectTargetTmpl.html',
					controller: 'selectTargetCtrl',
					inputs: {
						players: players,
						user: user
					}
				})
				.then(function(modal) {
					modal.close.then(function(target) {
						defered.resolve(target);
					});
				});
			return defered.promise;
		};

		this.guessCard = function(cards) {
			var defered = $q.defer();
			ModalService.showModal({
					templateUrl: './app/modals/guessCard/guessCardTmpl.html',
					controller: 'guessCardCtrl',
					inputs: {
						cards: cards
					}
				})
				.then(function(modal) {
					modal.close.then(function(card) {
						defered.resolve(card);
					});
				});
			return defered.promise;
		};

		// ALERT AND CONFIRM MODALS
		// ============================================================
		this.alert = function(input) {
			var defered = $q.defer();
			ModalService.showModal({
					templateUrl: './app/modals/alert/alertTmpl.html',
					controller: 'alertCtrl',
					inputs: {
						text: input
					}
				})
				.then(function(modal) {
					modal.close.then(function(closed) {
						defered.resolve(closed);
					});
				});
			return defered.promise;
		};

		this.confirm = function(input) {
			var defered = $q.defer();
			ModalService.showModal({
					templateUrl: './app/modals/confirm/confirmTmpl.html',
					controller: 'confirmCtrl',
					inputs: {
						text: input
					}
				})
				.then(function(modal) {
					modal.close.then(function(response) {
						defered.resolve(response);
					});
				});
			return defered.promise;
		};

	});
