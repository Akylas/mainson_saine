import { BaseAnimatedWindow, BaseWindow } from './ui/BaseWindow';
function prepareModalOpeningArgs(_args) {
    _args = _args || {};
    if (!_args.hasOwnProperty('activityEnterAnimation')) _args.activityEnterAnimation = Ti.App.Android.R.anim.push_up_in;
    if (!_args.hasOwnProperty('activityExitAnimation')) _args.activityExitAnimation = Ti.App.Android.R.anim.identity;
    return _args;
}

function prepareModalClosingArgs(_args) {
    _args = _args || {};
    if (!_args.hasOwnProperty('activityEnterAnimation')) _args.activityEnterAnimation = Ti.App.Android.R.anim.identity;
    if (!_args.hasOwnProperty('activityExitAnimation')) _args.activityExitAnimation = Ti.App.Android.R.anim.push_down_out;
    return _args;
}

const TAG = 'WindowManager';
const isAndroid = Ti.Platform.osname === 'android';
export default class AKWindowManager implements AK.IWindowManager {
    rootWindow: TiWindow;
    private _winId = 0;
    private _managers = {};
    // openedWindows: [],
    handlingOpening = false;
    defaultWinOpeningArgs = {};
    shouldDelayOpening = false;
    androidNav = false;
    title = 'WINDOW_MANAGER';
    _onWindowOpenedDelayed: (e: TiEvent) => any;
    constructor(_args) {
        this._onWindowOpenedDelayed = Function.debounce(this._onWindowOpened, 400);
        this.shouldDelayOpening = _args.shouldDelayOpening !== false;
        this.androidNav = isAndroid && _args.androidNav === true;
        if (_args.winOpeningArgs) {
            this.defaultWinOpeningArgs = _args.winOpeningArgs;
        }
    }
    _onBack = (_win, e) => {
        if (_win.handleClose === true && _win.hideMe) {
            _win.hideMe();
        } else {
            this.closeWindow(_win);
        }
    };

    _onWindowOpened = (e: TiEvent) => {
        //if the window handles its open animation let's it set the variable
        //true later as it might be too soon now
        const win = (e.source as TiUIWindowExtended)
        const baseWin = ak.ti.getRProxy(win) as BaseAnimatedWindow;
        if (baseWin.handleOpen !== true) {
            this.windowSignalsOpened(win);
        }
        // e.source.removeEventListener('focus', this._onWindowOpenedDelayed);
        // e.source.removeEventListener('open', this._onWindowOpened);
    };

    _onWindowClosed = (e: TiEvent) => {
        let win = (e.source as TiUIWindowExtended)
        const baseWin = ak.ti.getRProxy(win) as BaseWindow;
        if (baseWin.onClose) {
            baseWin.onClose();
        }

        if (e._closeFromActivityForcedToDestroy == true) {
            return;
        }

        // var winManager = baseWin.winManager || this;
        delete baseWin.winManager;
        delete baseWin.manager;
        delete this._managers[win.winId];
        baseWin.clearProxy();
        // console.debug('_onWindowClosed', win.title, Object.keys(this._managers), baseWin, JSON.stringify(win));
        // win = null;
        // if (win.GC && (!win.manager || !win.manager.canGCWindow || win.manager.canGCWindow(win))) {
        //     win.manager = null;
        //     win.onBack = null;
        //     win.onClose = null;
        //     win.akmanaged = false;
        //     win.removeAllListeners();
        //     console.debug('GC Window:', win.title);

        //     win.GC();
        // }
        // win.removeEventListener('close', this._onWindowClosed);
    };

    _openWindow = (_win: BaseAnimatedWindow, _args?: TiDict) => {
        var winManager = _win.winManager || this;
        const winTi = _win.getTiProxy();

        if (winTi.akmanaged !== true) {
            winTi.winId = this._winId++;
        }
        this._managers[winTi.winId] = winManager;

        if (isAndroid) {
            if (winTi.modal === true) {
                winTi.winOpeningArgs = prepareModalOpeningArgs(winTi.winOpeningArgs);
                winTi.winClosingArgs = prepareModalClosingArgs(winTi.winClosingArgs);
            }
            if (winTi.akmanaged !== true) {
                if (!_win.onBack) {
                    _win.onBack = e => {
                        this._onBack(_win, e);
                    };
                }
                winTi.addEventListener('androidback', _win.onBack);
            }
        }
        var realArgs = Object.assign(
            winTi.winOpeningArgs
                ? winTi.winOpeningArgs
                : _win.handleOpen === true
                    ? {
                          animated: false
                      }
                    : {},
            _args
        ) as titanium.openWindowParams;

        console.debug('_openWindow', winTi.title, winTi.akmanaged);
        winTi.akmanaged = true;
        // console.debug('_openWindow', realArgs);
        if (_win.winManager) {
            _win.winManager.openWindow(_win, realArgs as TiDict);
        } else {
            // console.debug(TAG, '_openWindow', realArgs);
            winTi.open(realArgs as titanium.openWindowParams);
        }
        if (_win.toDoAfterOpening) {
            _win.toDoAfterOpening();
        }
    };

    // createAndOpenWindow = (_constructor: string, _args?: TiDict, _openingArgs?: TiDict, _dontCheckOpening?: boolean) => {
    //     _args = _args || {};
    //     var winManager: AK.IWindowManager = (_args.winManager as AK.IWindowManager) || this;
    //     _dontCheckOpening = _dontCheckOpening || this.shouldDelayOpening === false;
    //     if (_dontCheckOpening !== true) {
    //         if (winManager.handlingOpening === true) {
    //             serror("Can't open window " + _args.title);
    //             return;
    //         }
    //         winManager.handlingOpening = true;
    //     }

    //     var win = ak.ti.createFromConstructor(_constructor, _args);
    //     if (win.showMe && !win._opened) {
    //         win.showMe();
    //     } else {
    //         this.openWindow(
    //             win,
    //             Object.assign(
    //                 {
    //                     winManager: _args.winManager
    //                 },
    //                 _openingArgs
    //             ),
    //             _dontCheckOpening
    //         );
    //     }
    // };

    openWindow = (_win: BaseAnimatedWindow, _args?: TiDict, _dontCheckOpening?: boolean) => {
        _args = _args || {};
        _dontCheckOpening = _dontCheckOpening || this.shouldDelayOpening === false;
        if (_args.hasOwnProperty('winManager')) {
            _win.winManager = _args.winManager as AK.IWindowManager;
            delete _args.winManager;
        }

        var winManager = _win.winManager || this;
        console.debug('openWindow_args.winManager', _args.title, _win.getTiProxy().title, _args);
        var callback = _args.callback as Function;
        delete _args.callback;
        const winTi = _win.getTiProxy();

        if (_dontCheckOpening !== true) {
            winManager.handlingOpening = true;
            winTi.once('open', this._onWindowOpenedDelayed);
        }
        winTi.once('close', this._onWindowClosed);

        if (callback) {
            callback(_win);
        }
        this._openWindow(_win, _args);
    };

    closeWindow = (_win: BaseAnimatedWindow, _args?: TiDict, _callGC?: boolean) => {
        if (!_win) return;
        // console.debug(_win.title, 'closeWindow1', _args, _win.hideMe, _win._closing);
        _args = _args || {};
        if (_win.hideMe && !_win._closing) {
            _win.hideMe();
        } else {
            const winTi = _win.getTiProxy();
            if (!winTi) {
                return;
            }
            var realArgs =
                Object.keys(_args).length > 0
                    ? _args
                    : winTi.winClosingArgs ||
                    winTi.winOpeningArgs ||
                      (_win.handleClose === true
                          ? {
                                animated: false
                            }
                          : this.defaultWinOpeningArgs);
            // console.debug(_win.title, 'closeWindow', realArgs);
            winTi.close(realArgs);
        }
    };

    windowSignalsOpened = _win => {
        var manager = this.getWindowManager(_win);
        if (manager) manager.handlingOpening = false;
    };
    getWindowManager = _win => {
        return this._managers[_win.winId];
    };
}
declare global {
    namespace AK { class WindowManager extends AKWindowManager {} }
}
