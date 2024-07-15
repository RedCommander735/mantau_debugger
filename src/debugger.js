document.body.style.border = "5px solid green";
// @ts-ignore
const frame = XPCNativeWrapper.unwrap(window).webframe;
function init() {
    let interval = setInterval(() => {
        if (frame.getMainApp) {
            if (frame.getMainApp().isInitComplete) {
                done();
                clearInterval(interval);
            }
        }
    }, 500);
}
function done() {
    // Implement debugger here
    let appTree = {};
    const mainAppDef = frame.getMainApp().appDef;
    const mainAppName = mainAppDef.appName;
    const mainAppAlias = mainAppDef.appAlias;
    appTree[mainAppName] = {
        appAlias: mainAppAlias,
        subApps: (mainAppDef.subAppsRef) ? {} : null
    };
    const subAppRefs = Object.keys(mainAppDef.subAppsRef);
    getSubTree(appTree[mainAppName].subApps, mainAppDef);
    console.log('Done');
    console.log(appTree);
}
function getSubTree(subAppTree, currentAppDef) {
    // TODO Zweite Ebene
    const subAppRefs = Object.keys(currentAppDef.subAppsRef);
    for (let ref of subAppRefs) {
        try {
            let subAppDef = frame.getMainApp().getSubAppDef(ref);
            subAppTree[subAppDef.appName] = {
                appAlias: subAppDef.appAlias,
                subApps: (subAppDef.subAppsRef) ? {} : null
            };
            if (subAppDef.subAppsRef) {
                getSubTree(subAppTree[subAppDef.appName].subApps, subAppDef);
            }
        }
        catch { }
    }
}
init();
