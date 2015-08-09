(function () {
    "use strict";
    //Remote notification schema URL
    //This is my own server, and it may subject to change. Set up your own if possible.
    var REMOTE_URL = 'http://d3elem.youmu.moe/bilibili/notification.php?id=';

	var app = WinJS.Application;
	var activation = Windows.ApplicationModel.Activation;
	var activationKinds = Windows.ApplicationModel.Activation.ActivationKind;
	var notifications = Windows.UI.Notifications;

	app.onactivated = function (args) {
	    var activationKind = args.detail.kind;
	    var activatedEventArgs = args.detail.detail;

	    switch (activationKind) {
	        case activationKinds.launch:
	            var p = WinJS.UI.processAll().
                    then(function () {
                        //Do things and quit
                        startPolling();
                        launchURI();
                    });

	            // Calling done on a promise chain allows unhandled exceptions to propagate.
	            p.done();

	            // Use setPromise to indicate to the system that the splash screen must not be torn down
	            // until after processAll and navigate complete asynchronously.
	            args.setPromise(p);
	            break;

	        default:
	            break;
	    }

	}

	function startPolling() {
	    var urisToPoll = [];

        //Construct polling uris
	    for (var i = 1; i <= 5; i++) {
	        urisToPoll.push(new Windows.Foundation.Uri(REMOTE_URL + i));
	    }

	    var recurrence = notifications.PeriodicUpdateRecurrence.halfHour;
	    var notifier = notifications.TileUpdateManager.createTileUpdaterForApplication();
        //Enable notification queue to store up to 5 tiles
	    notifier.enableNotificationQueue(true);
	    //First stop previous polling
	    notifier.stopPeriodicUpdate();
        //Re-enable it
	    notifier.startPeriodicUpdateBatch(urisToPoll, recurrence);
	}

	function launchURI() {
	    var bilibili_url = 'http://www.bilibili.com/video/bangumi.html';
	    var uri = new Windows.Foundation.Uri(bilibili_url);
        //Let Windows open the URL, then terminate
	    Windows.System.Launcher.launchUriAsync(uri).then(function (success) {
	        close();
        });
	}

	app.start();
})();
