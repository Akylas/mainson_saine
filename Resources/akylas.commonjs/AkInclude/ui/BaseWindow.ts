import AnimatedWindow from './AnimatedWindow';

export type ViewConstructor<T extends View> = new (...args: any[]) => T;

export type BaseClass<T> = { new (...args: any[]): T };

function CBaseWindow<T extends BaseClass<TiWindow>>(baseClass: T) {
    return class extends baseClass {
        // showLeftMenuButton?: boolean;
        // androidDontUseNavWindow?: boolean;
        // customModal?: boolean;
        navWindow?: boolean;
        // exitOnBack?: boolean;
        manager?: BaseNavWindow;
        winManager?: AK.IWindowManager;
        isOpened = false;
        onOpen?(args?);
        static initArgs(_args) {
            if (!_args.constructorNames) {
                _args = ak.ti.redux.prepareClassArgs(_args, BaseWindow);
            }
            Object.defaults(_args, {
                showBackButton: true,
                ownBackButtonTitle: $.sClose,
                homeAsUpIndicator: _args.modal === true ? 'images/close.png' : null
            });
            return _args;
        }
        constructor(...args: any[]) {
            super(BaseWindow.initArgs(args[0]));
            const _args = args[0];
            let children = [];
            if (_args.underContainerView) {
                children = children.concat(_args.underContainerView);
                delete _args.underContainerView;
            }

            if (_args.containerView) {
                var object = _args.containerView;
                delete _args.containerView;
                object.bindId = 'container';
                children.push(object);
            } else {
                children.push({
                    type: _args.containerType || 'Ti.UI.View',
                    bindId: 'container',
                    properties: _args.containerProps || {
                        rclass: _args.containerClass,
                        height: 'FILL',
                        width: 'FILL',
                        touchPassThrough: true,
                        layout: _args.verticalContainer === false ? 'absolute' : 'vertical'
                    }
                });
            }
            ak.ti.add(this, children);
            // if (!!_args.withLoadingIndicator) {
            //     applyObjectMixins(this, [WithLoading]);
            // }

            if (_args.showBackButton === true) {
                this.shouldShowBackButton(_args.ownBackButtonTitle);
            }
            this.tiProxy.on('open', () => {
                if (!this.isOpened) {
                    this.isOpened = true;
                    if (this.onOpen) {
                        // setTimeout(() => {
                        this.onOpen(!this.isOpened);
                        // }, 5); //slight delay because on android open is sent to soon
                    }
                }
            });
        }
        shouldShowBackButton = _backTitle => {
            const proxy = this.tiProxy;
            if (!proxy.leftNavButton) {
                if (__APPLE__) {
                    proxy.leftNavButton = ak.ti.style({
                        type: 'Ti.UI.Button',
                        properties: {
                            rclass: 'NBBackButton',
                            title: _backTitle || trc('close')
                        },
                        events: {
                            click: app.debounce(() => {
                                this.closeMe();
                            })
                        }
                    });
                } else {
                    Object.defaults(proxy, {
                        homeAsUpIndicator: proxy.modal === true ? 'images/close.png' : null,
                        displayHomeAsUp: true,
                        onHomeIconItemSelected: app.debounce(() => {
                            this.closeMe();
                        })
                    });
                }
            }
        };
        closeMe = (_args?) => {
            app.ui.closeWindow(this, _args);
        };
        openMe = (_args?) => {
            app.ui.openWindow(this, _args);
        };
        onBack = e => {
            if (__ANDROID__) {
                if (this.tiProxy.exitOnBack === true) {
                    app.closeApp();
                } else {
                    this.closeMe();
                }
            }
        };
        onClose() {
            console.log('onClose', 'onClose');
            this.isOpened = false;
        }
    };
}

export class BaseWindow extends CBaseWindow(TiWindow) {}
export declare class AppWindow extends BaseWindow {}
export class BaseNavWindow extends CBaseWindow(NavigationWindow) {
    static initArgs(_args) {
        if (!_args.constructorNames) {
            _args = ak.ti.redux.prepareClassArgs(_args, BaseNavWindow);
        }
        _args.navBarHidden = true;
        if (_args.window.navBarHidden !== true) {
            var showBackButton = _args.window.showBackButton !== false;
            var ownBackButtonTitle = _args.window.ownBackButtonTitle || $.sClose;
            Object.defaults(_args.window, {
                homeAsUpIndicator: _args.modal === true ? 'images/close.png' : null
            });
            if (showBackButton === true) {
                const appWin = ak.ti.getRProxy(_args.window) as BaseWindow;
                if (appWin && appWin.shouldShowBackButton) {
                    appWin.shouldShowBackButton(ownBackButtonTitle);
                }
                delete _args.showBackButton;
            }
        }
        return _args;
    }
    constructor(_args) {
        super(BaseNavWindow.initArgs(_args));
        const appWin = ak.ti.getRProxy(_args.window) as BaseWindow;
        // console.log('test', _args.window, appWin);
        if (appWin) {
            appWin.manager = this;
        }
        // console.log('test', appWin, Object.keys(appWin), Object.getOwnPropertyNames(appWin), this);
    }
    navOpenWindow = (_win: AppWindow | TiDict, _args?: TiDict) => {
        if (_.isPlainObject(_win)) {
            _win = new AppWindow(_win as TiDict);
        }
        const theWin = _win as AppWindow;
        const winProxy = theWin.tiProxy;
        _args = _args || {};
        var manager: BaseNavWindow = (_args.manager || this) as BaseNavWindow;
        delete _args.manager;
        // console.debug('navOpenWindow', app.ui.androidNav, theWin, _args);

        if (
            !!winProxy.modal ||
            !!winProxy.customModal ||
            (!!app.ui.androidNav && winProxy.showLeftMenuButton !== true) ||
            (__ANDROID__ && (!!winProxy.androidDontUseNavWindow || !!_args.androidDontUseNavWindow))
        ) {
            if (manager) {
                var currentWindow = Ti.UI.topWindow;
                if (theWin.shouldShowBackButton && !(winProxy.modal && !!theWin.navWindow)) {
                    theWin.shouldShowBackButton(currentWindow ? currentWindow.backButtonTitle || currentWindow.title : undefined);
                }
                delete _args.winManager;
                delete theWin.winManager;
            }
        } else {
            _args.winManager = this;
        }
        app.ui.openWindow(_win as AppWindow, _args);
        theWin.manager = manager;
    };
    openWindow(win, params?) {
        this.tiProxy.openWindow(win.tiProxy, params);
    }
    closeWindow(win, params?) {
        this.tiProxy.closeWindow(win.tiProxy, params);
    }
    // createManagedWindow(_constructor: string, _args2?: TiDict) {
    //     _args2 = _args2 || {};
    //     _args2.manager = this;
    //     return ak.ti.createFromConstructor(_constructor, _args2);
    // }
    // createAndOpenWindow = (_constructor: string, _args?: TiDict, _winArgs?: TiDict) => {
    //     var win = this.createManagedWindow(_constructor, _args);
    //     this.navOpenWindow(win, _winArgs);
    //     return win;
    // };
}

function prepareBaseAnimatedWindowArgs(_args) {}

export class BaseAnimatedWindow extends CBaseWindow(AnimatedWindow) {
    static initArgs(_args) {
        if (!_args.constructorNames) {
            _args = ak.ti.redux.prepareClassArgs(_args, BaseAnimatedWindow);
        }
        return _args;
    }
    constructor(_args) {
        super(BaseAnimatedWindow.initArgs(_args));
    }
}

export function WithLoading<T extends ViewConstructor<View>>(Base: T) {
    return class extends Base {
        indicator = new View({
            properties: {},
            childTemplates: [
                {
                    type: 'Ti.UI.ActivityIndicator',
                    properties: {
                        rid: 'loadingIndicator'
                    }
                }
            ]
        });
        showLoading = () => {
            this.tiProxy.add(this.indicator.tiProxy);
        };

        hideLoading = () => {
            this.tiProxy.remove(this.indicator.tiProxy);
        };
    };
}
