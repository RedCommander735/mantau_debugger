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
    // Implement debugger her
    let appTree = {};
    const mainAppDef = frame.getMainApp().appDef;
    const mainAppName = mainAppDef.appName;
    const mainAppAlias = mainAppDef.appAlias;
    appTree[mainAppName] = {
        appAlias: mainAppAlias,
        subApps: (mainAppDef.subAppsRef) ? {} : null
    };
    appTree[mainAppName].subApps = getSubTree(mainAppDef);
    console.log('Done');
    console.log(appTree);
}
function getSubTree(currentAppDef) {
    // TODO Zweite Ebene
    const subAppRefs = Object.keys(currentAppDef.subAppsRef);
    let subAppTree = {};
    for (let ref of subAppRefs) {
        try {
            const subAppDef = frame.getMainApp().getSubAppDef(ref);
            const subAppName = subAppDef.appName;
            subAppTree[subAppName] = {
                appAlias: subAppDef.appAlias,
                subApps: (subAppDef.subAppsRef) ? getSubTree(subAppDef) : null
            };
            return subAppTree;
        }
        catch { }
    }
}
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete')
        init();
});
