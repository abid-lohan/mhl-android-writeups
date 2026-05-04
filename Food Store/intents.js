Java.perform(function () {
    console.log("[*] Starting intent monitor...");

    var Intent = Java.use("android.content.Intent");
    var Activity = Java.use("android.app.Activity");
    var BroadcastReceiver = Java.use("android.content.BroadcastReceiver");
    var Service = Java.use("android.app.Service");
    var ContextWrapper = Java.use("android.content.ContextWrapper");

    function dumpIntent(intent, direction, methodSource) {
        if (intent === null) return;
        
        try {
            var action = intent.getAction();
            var component = intent.getComponent();
            var data = intent.getDataString();
            var flags = intent.getFlags();
            var extras = intent.getExtras();

            var log = "[" + direction + "] " + methodSource + "\n";
            if (action)    log += "    - Action:    " + action + "\n";
            if (component) log += "    - Component: " + component.flattenToShortString() + "\n";
            if (data)      log += "    - Data/URI:  " + data + "\n";
            if (flags)     log += "    - Flags:     " + flags + "\n";
            if (extras !== null) {
                log += "    - Extras   : " + extras.toString();
            } else {
                log += "    - Extras   : None";
            }
            console.log("--------------------------------------------------");
            console.log(log);
        } catch (e) {
            console.log("[-] Error parsing Intent in " + methodSource + ": " + e);
        }
    }

    Activity.getIntent.implementation = function () {
        var intent = this.getIntent();
        dumpIntent(intent, "🟪 In", "Activity.getIntent()");
        return intent;
    };

    Activity.onNewIntent.implementation = function (intent) {
        dumpIntent(intent, "🟪 In", "Activity.onNewIntent()");
        this.onNewIntent(intent);
    };

    BroadcastReceiver.onReceive.implementation = function (context, intent) {
        dumpIntent(intent, "🟪 In", "BroadcastReceiver.onReceive()");
        this.onReceive(context, intent);
    };

    Service.onStartCommand.implementation = function (intent, flags, startId) {
        dumpIntent(intent, "🟪 In", "Service.onStartCommand()");
        return this.onStartCommand(intent, flags, startId);
    };

    Activity.startActivity.overload('android.content.Intent').implementation = function (intent) {
        dumpIntent(intent, "🟧 Out", "Activity.startActivity()");
        this.startActivity(intent);
    };

    Activity.startActivityForResult.overload('android.content.Intent', 'int').implementation = function (intent, requestCode) {
        dumpIntent(intent, "🟧 Out", "Activity.startActivityForResult() [ReqCode: " + requestCode + "]");
        this.startActivityForResult(intent, requestCode);
    };

    ContextWrapper.sendBroadcast.overload('android.content.Intent').implementation = function (intent) {
        dumpIntent(intent, "🟧 Out", "ContextWrapper.sendBroadcast()");
        this.sendBroadcast(intent);
    };

    ContextWrapper.startService.overload('android.content.Intent').implementation = function (intent) {
        dumpIntent(intent, "🟧 Out", "ContextWrapper.startService()");
        return this.startService(intent);
    };
});