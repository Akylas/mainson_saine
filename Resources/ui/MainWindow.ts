import AppWindow, { AppNavWindow } from './AppWindow';
import HomeWindow from './HomeWindow';

const FIRST_WINDOW = 'home';

const windowsMap: { [k: string]: typeof AppWindow } = {
    home: HomeWindow
};

const windows: { [k: string]: AppWindow } = {};

export default class MainWindow extends AppNavWindow {
   
    static initArgs(_args) {
        if (!_args.constructorNames) {
            _args = ak.ti.redux.prepareClassArgs(_args, MainWindow);
        }
        _args.window = new HomeWindow({
            showLeftMenuButton: true
            // winGCId: FIRST_WINDOW
        }).tiProxy;
        return _args;
    }
    constructor(_args) {
        super(MainWindow.initArgs(_args));
        windows[FIRST_WINDOW] = ak.ti.getRProxy(this.tiProxy.window) as AppWindow;
    }

    handleOpenWindow = (type, _args?, _key?) => {
        _key = _key || type;
        if (!windows.hasOwnProperty(_key)) {
            var win: AppWindow;
            if (windowsMap[type]) {
                win = new windowsMap[type](
                    Object.assign(
                        {
                            showLeftMenuButton: true
                        },
                        _args
                    )
                );
            }
            if (win) {
                // win.winGCId = _key;
                windows[_key] = win;
            }
        }
        if (!windows.hasOwnProperty(type)) return;

        sdebug('opening existing window');
        // app.ui.leftmenu.update(type, _args);
        // app.ui.leftdrawer.hideMe();
        // app.ui.slidemenu.closeViews();
        this.navOpenWindow(windows[type], {
            transition: {
                style: Ti.UI.TransitionStyle.FADE
            }
        });
    };
    // app.onDebounce(app.ui.leftmenu, 'cmd', function (_event) {
    //     var cmd = _event.subtype;
    //     console.log('cmd', cmd);
    //     if (cmd === 'settings') {
    //         self.createAndOpenWindow('SettingsWindow');
    //         setTimeout(function () {
    //             app.ui.leftdrawer.hideMe();
    //         }, 500);
    //         // app.ui.slidemenu.closeViews();
    //         return;
    //     } else if (cmd === 'history') {
    //         self.createAndOpenWindow('HistoryDevicesWindow');
    //         setTimeout(function () {
    //             app.ui.leftdrawer.hideMe();
    //         }, 500);
    //         // app.ui.slidemenu.closeViews();
    //         return;
    //     } else {
    //         self.handleOpenWindow(cmd);
    //     }
    // });

    // canGCWindow = _win => {
    //     sdebug('canGCWindow', _win.title, _win.winGCId);
    //     var canGC = !_win.winGCId || !this.windows.hasOwnProperty(_win.winGCId);
    //     return canGC;
    // };
}
