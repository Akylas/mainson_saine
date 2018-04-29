import LoadingView from './LoadingView';
import { BaseWindow, BaseNavWindow, BaseAnimatedWindow, ViewConstructor, BaseClass } from 'akylas.commonjs/AkInclude/ui/BaseWindow';

export { BaseWindow, BaseNavWindow };
export interface AppWindowContainer extends titanium.UIView {
    topToolbarHolder?: titanium.UIView;
    bottomToolbarHolder?: titanium.UIView;
    navBar?: titanium.UIView;
    navBarHolder?: titanium.UIView;
}

function CAppWindow<T extends BaseClass<BaseWindow>>(baseClass: T) {
    return class extends baseClass {
        // canManageWindows: boolean;
        // container: AppWindowContainer;
        themeColor?: ContrastColor;

        get titleView() {
            return this.getBind<titanium.UIView>('titleView');
        }
        get container() {
            return this.getBind<AppWindowContainer>('container');
        }
        currentSubtitle?: string;
        static initArgs(_args) {
            if (!_args.constructorNames) {
                _args = ak.ti.redux.prepareClassArgs(_args, AppWindow);
            }
            if (!!_args.modal) {
                _args.customModal = true;
                _args.opacity = 1; // for window to be transparent
                _args.modal = false;
                Object.defaults(_args, {
                    winOpeningArgs: {
                        from: {
                            transform: 'ot0,100%'
                        },
                        to: {
                            transform: null
                        },
                        duration: 300
                    },
                    winClosingArgs: {
                        transform: 'ot0,100%',
                        duration: 200
                    }
                });
            }
            if (_args.subtitle) {
                _args.backButtonTitle = '';
                _args.titleView = {
                    type: 'Ti.UI.Label',
                    touchEnabled: false,
                    // textAlign: 'center',
                    // backgroundColor:'brown',
                    height: 'FILL',
                    width: 'FILL',
                    bindId: 'titleView',
                    multiLineEllipsize: Ti.UI.TEXT_ELLIPSIZE_TAIL,
                    color: $.white,
                    font: { size: 14 },
                    html: '<b>' + _args.title + '</b><br><small><font color="lightgray">' + _args.subtitle + '</small></font>'
                };
                _args.currentSubtitle = _args.subtitle;
            }
            if (_args.rightNavButtons) {
                _args.rightNavButtons = _args.rightNavButtons.reduce(function(memo, value: any, key, list) {
                    if (!value.hasOwnProperty || value.hasOwnProperty('type')) {
                        memo.push(value);
                    } else {
                        memo.push({
                            type: 'Ti.UI.Button',
                            properties: {
                                rclass: 'NavBarRightButton',
                                title: value.icon
                            },
                            events: {
                                click: app.debounce(value.callback)
                            }
                        });
                    }

                    return memo;
                }, []);
            }

            if (__ANDROID__) {
                var buttons = [];
                if (_args.hasOwnProperty('leftNavButton')) {
                    buttons.push(_args.leftNavButton);
                }
                if (_args.hasOwnProperty('rightNavButton')) {
                    buttons.push(_args.rightNavButton);
                }
                if (_args.hasOwnProperty('rightNavButtons')) {
                    buttons = _.union(buttons, _args.rightNavButtons);
                }
                if (buttons.length > 0) {
                    _args.activity = _args.activity || {};
                    _args.activity.onCreateOptionsMenu = function(e) {
                        var menu = e.menu;
                        buttons.forEach(function(view, index, list) {
                            var args = {
                                actionView: view,
                                showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM
                            };
                            menu.add(args);
                        });
                    };
                }
            }
            return _args;
        }
        constructor(...args: any[]) {
            super(AppWindow.initArgs(args[0]));
            const _args = args[0];
            if (_args.showLeftMenuButton === true) {
                if (_args.modal === true) {
                } else {
                    if (__APPLE__) {
                        var button = (this.getTiProxy().leftNavButton = new Button({
                            rid: _args.leftMenuButtonRid || 'menuBtn',
                            callbackId: 'menuBtn'
                        }));
                    } else {
                        this.getTiProxy().applyProperties({
                            homeAsUpIndicator: 'images/menu.png',
                            displayHomeAsUp: true,
                            onHomeIconItemSelected: function() {
                                // app.ui.leftdrawer.showHideMe();
                            }
                        });
                    }
                }
            }

            let realContainer = this.container;
            if (_args.centerContainerView) {
                realContainer = _args.centerContainerView;
                delete _args.centerContainerView;
                ak.ti.add(this.container, realContainer);
            }

            // if (!!_args.withLoadingIndicator) {
            //     applyClassMixins(AppNavWindow, [AppWindow]);

            // }

            if (_args.themeColor) {
                this.setColors(_args.themeColor);
            }
        }
        updateTitle(title, subtitle?) {
            const customNavBar = hasCustomNavBar(this);
            if (this.titleView) {
                this.currentSubtitle = subtitle || this.currentSubtitle;
                (customNavBar ? this.container : this.getTiProxy()).applyProperties({
                    titleView: {
                        html: this.currentSubtitle ? '<b>' + title + '</b><br><small><font color="lightgray">' + this.currentSubtitle + '</small></font>' : title
                    }
                });
            } else {
                if (customNavBar) {
                    this.container.applyProperties({
                        titleView: {
                            html: title
                        }
                    });
                } else {
                    this.getTiProxy().title = title;
                }
            }
        }

        // createManagedWindow = (_constructor, _args2) => {
        //     if (this.navWindow === true || this.canManageWindows === true) {
        //         _args2 = _args2 || {};
        //         _args2.manager = this;
        //         return ak.ti.createFromConstructor(_constructor, _args2);
        //     }
        // };

        showError = (err, silent = true) => {
            console.debug('showError', err, silent);
            app.emit('error', { silent: silent, error: err });
        };
        showErrorNonSilent = err => {
            // console.debug('showErrorNonSilent', err);
            this.showError(err, false);
        };

        prepareSetColorsParams(colors: ContrastColor, params) {
            console.log('prepareSetColorsParams');
            if (__APPLE__) {
                params.statusBarStyle = colors.isLight ? 1 : 0;
            } else if (__ANDROID__) {
                params.navigationBarColor = colors.color;
                params.statusBarColor = colors.darkest;
            }
            params.barColor = colors.color;
            params.barTintColor = colors.contrast;
        }
        setColors = _color => {
            // console.log('setColors', _color);
            this.themeColor = _color;
            var colors = app.getContrastColors(_color);

            var params: any = {};
            // console.log('setColors2');
            this.prepareSetColorsParams(colors, params);
            if (this.isOpened) {
                this.getTiProxy().applyProperties(params);
            } else {
                params.duration = 300;
                this.getTiProxy().animate(params);
            }
            return colors;
        };
    };
}

export class AppNavWindow extends CAppWindow(BaseNavWindow) {
    window: titanium.UIWindow;
    static initArgs(_args) {
        if (!_args.constructorNames) {
            _args = ak.ti.redux.prepareClassArgs(_args, AppNavWindow);
        }
        return _args;
    }
    constructor(_args) {
        super(AppNavWindow.initArgs(_args));
        if (this.window instanceof AppWindow && hasCustomNavBar(this.window) === true) {
            this.window.closeMe = this.closeMe;
        }
    }
}
export default class AppWindow extends CAppWindow(BaseWindow) {
    static initArgs(_args) {
        if (!_args.constructorNames) {
            _args = ak.ti.redux.prepareClassArgs(_args, AppWindow);
        }
        return _args;
    }
    constructor(_args) {
        super(AppWindow.initArgs(_args));
    }
}

export function hasCustomNavBar(window: AppWindow) {
    return (window as any).customNavBar === true;
}
export function hasTopToolbar(window: AppWindow) {
    return (window as any).topToolbar === true;
}
export function hasBottomToolbar(window: AppWindow) {
    return (window as any).bottomToolbar === true;
}

export function LoadingIndicator<T extends { new (...args: any[]): AppWindow; initArgs(args) }>(Base: T) {
    return class extends Base {
        loadingView: LoadingView;
        constructor(...args: any[]) {
            super(args[0]);
            this.loadingView = new LoadingView(args[0].loadingViewArgs);
        }
        loadingShowing = false;
        listView?: (titanium.UIListView) & {
            doneLoading?();
        };
        showLoading = (_args?) => {
            if (this.loadingShowing) {
                return;
            }
            this.loadingShowing = true;
            sdebug('app showlaoding');
            if (typeof _args === 'string') {
                _args = {
                    label: { text: _args }
                };
            }
            this.loadingView.startLoading(_args);
            this.getTiProxy().add(this.loadingView.getTiProxy());
            this.loadingView.getTiProxy().animate({
                from: {
                    opacity: 0
                },
                to: {
                    opacity: 1
                },
                duration: 150
            });
        };

        updateLoading = _args => {
            if (this.loadingView && this.loadingShowing) {
                this.loadingView.updateLoading(_args);
            }
        };

        hideLoading = () => {
            if (!this.loadingView || !this.loadingShowing) {
                return;
            }
            this.loadingShowing = false;
            // sdebug('app hideLoading');
            if (this.listView && this.listView.doneLoading) {
                this.listView.doneLoading();
            }
            this.loadingView.getTiProxy().animate(
                {
                    opacity: 0,
                    duration: 200
                },
                function(e) {
                    // if (this.isClosed) return;
                    // sdebug('app hideLoading done');
                    this.loadingView.stopLoading();
                    this.remove(this.loadingView);
                }
            );
        };

        runLoadingPromise = promise => {
            this.showLoading();
            return promise.then(
                function(result) {
                    this.hideLoading();
                    return result;
                },
                err => {
                    this.hideLoading();
                    throw err;
                }
            );
        };
    };
}

export function TopToolbar<T extends { new (...args: any[]): AppWindow; initArgs(args) }>(Base: T) {
    return class extends Base {
        static initArgs(args) {
            // console.debug('initArgs topToolbar')
            return Base.initArgs(args);
        }
        constructor(...args: any[]) {
            super(args[0]);
            const _args = args[0];
            // console.debug('topToolbar', _args)
            if (_args.topToolbar) {
                ak.ti.add(
                    this.container,
                    {
                        type: 'Ti.UI.View',
                        bindId: 'topToolbarHolder',
                        properties: {
                            rclass: 'TopToolbar',
                            visible: _args.topToolbarVisible === true,
                            height: _args.topToolbarVisible === true ? 'SIZE' : 0
                        },
                        childTemplates: [_args.topToolbar]
                    },
                    0
                );
                delete _args.topToolbarVisible;
                delete _args.topToolbar;
            }
        }
        showTopToolbar() {
            if (this.container.topToolbarHolder.visible) return;
            this.container.topToolbarHolder.visible = true;
            this.container.topToolbarHolder.animate({
                height: 'SIZE',
                duration: 150
            });
        }
        showHideTopToolbar() {
            if (this.container.topToolbarHolder.visible === false) this.showTopToolbar();
            else this.hideTopToolbar();
        }
        hideTopToolbar() {
            if (this.container.topToolbarHolder.visible === false) return;
            this.container.topToolbarHolder.animate(
                {
                    height: 0,
                    duration: 100
                },
                () => {
                    this.container.topToolbarHolder.visible = false;
                }
            );
        }
        prepareSetColorsParams(colors, params) {
            super.prepareSetColorsParams(colors, params);
            params.container = params.container || {};
            params.topToolbarHolder = {
                backgroundColor: colors.color
            };
            return params;
        }
    };
}

export function BottomToolbar<T extends { new (...args: any[]): AppWindow; initArgs(args) }>(Base: T) {
    return class extends Base {
        //Toolbar
        bottomToolbarHolder?: titanium.UIView;
        bottomToolbarVisible = false;
        static initArgs(args) {
            // console.debug('initArgs BottomToolbar')
            return Base.initArgs(args);
        }
        constructor(...args: any[]) {
            super(args[0]);
            const _args = args[0];
            if (_args.bottomToolbar) {
                let bottomToolbarHolder = {
                    rclass: _args.bottomToolbarRclass || 'BottomToolbarThemed',
                    bindId: 'bottomToolbarHolder',
                    childTemplates: [_args.bottomToolbar]
                } as TiDict;
                let height = bottomToolbarHolder.height;
                if (_args.bottomToolbarVisible !== true) {
                    _args.bottomToolbarVisible = false;
                    bottomToolbarHolder.visible = false;
                    bottomToolbarHolder.height = 0;
                }
                console.log('adding bottomToolbar', bottomToolbarHolder);
                ak.ti.add(this.container, bottomToolbarHolder);
                delete _args.bottomToolbar;
                // this.container.add(this.bottomToolbarHolder);
            }
        }

        showBottomToolbar = () => {
            if (!this.bottomToolbarHolder || this.bottomToolbarVisible) return;
            // sdebug("showBottomToolbar", this.bottomToolbarVisible);
            this.bottomToolbarHolder.cancelAllAnimations();
            this.bottomToolbarVisible = true;
            this.bottomToolbarHolder.visible = true;
            this.bottomToolbarHolder.animate({
                height: $.toolbarHeight,
                duration: 150
            });
        };
        showHideBottomToolbar = () => {
            if (!this.bottomToolbarHolder) return;
            if (this.bottomToolbarHolder.visible === false) this.showBottomToolbar();
            else this.hideBottomToolbar();
        };
        hideBottomToolbar = () => {
            if (!this.bottomToolbarHolder || !this.bottomToolbarVisible) return;
            this.bottomToolbarVisible = false;
            // sdebug("hideBottomToolbar", this.bottomToolbarVisible);
            this.bottomToolbarHolder.cancelAllAnimations();
            this.bottomToolbarHolder.animate(
                {
                    height: 0,
                    duration: 100
                },
                function() {
                    if (!this.bottomToolbarVisible) {
                        this.bottomToolbarHolder.visible = false;
                    }
                }
            );
        };
        prepareSetColorsParams(colors, params) {
            params = super.prepareSetColorsParams(colors, params);
            params.container = params.container || {};
            params.bottomToolbarHolder = {
                backgroundColor: colors.color
            };
            return params;
        }
    };
}

export interface IAppWindowConstructor<T extends AppWindow> {
    new (...args: any[]): T;
    initArgs(args);
}
export function CustomNavBar<T extends { new (...args: any[]): AppWindow; initArgs(args) }>(Base: T) {
    function initNavBarArgs(args: any[]) {
        let _args = Base.initArgs(args[0]);
        // console.debug('customNavBar', args)
        var children = [];
        var maxCount = 0;
        var toAdd;
        if (_args.showBackButton && !_args.showLeftMenuButton) {
            _args.hasBackButton = true;
            children.push({
                type: 'Ti.UI.Button',
                bindId: 'closeBtn',
                properties: {
                    rclass: 'NBBackButton',
                    title: _args.ownBackButtonTitle || (_args.modal || _args.customModal ? $.sClose : $.sLeft)
                }
                // events: {
                //     click: app.debounce(() => {
                //         this.closeMe();
                //     })
                // }
            });
            delete _args.showBackButton;
        }
        _args.navBarHidden = true;
        if (_args.hasOwnProperty('leftNavButton')) {
            const button = _args.leftNavButton;
            delete _args.leftNavButton;
            children.push(button);
        } else if (!!_args.showLeftMenuButton) {
            let leftNavButton = new Button({
                rid: _args.leftMenuButtonRid || 'menuBtn'
            });
            // app.onDebounce(leftNavButton, 'click', function() {
            // app.ui.leftdrawer.showHideMe();
            // });
            delete _args.showLeftMenuButton;
            children.push(leftNavButton);
        }
        var customTitleView = !!_args.titleView;
        var titleView =
            _args.titleView ||
            (_args.title && _args.title.length > 0
                ? {
                      type: 'Ti.UI.Label',
                      bindId: 'titleView',
                      properties: {
                          rclass: 'NBTitle',
                          width: 'FILL',
                          html: _args.title
                      }
                  }
                : undefined);
        // children.push(titleView);
        maxCount = children.length;
        if (titleView) {
            children.push(titleView);
        } else {
            children.push({
                type: 'Ti.UI.View',
                touchEnabled: false
            });
        }

        if (_args.hasOwnProperty('rightNavButton')) {
            const button = _args.rightNavButton;
            delete _args.rightNavButton;
            children.push(button);
        }
        if (_args.hasOwnProperty('rightNavButtons')) {
            const buttons = _args.rightNavButtons;
            delete _args.rightNavButtons;
            children = children.concat(buttons);
        }
        maxCount = Math.max(maxCount, children.length - maxCount - 1);
        _args.topToolbarVisible = true;
        const view = {
            type: 'Ti.UI.View',
            bindId: 'navBar',
            properties: {
                rclass: 'NavBar',
                backgroundColor: _args.barColor,
                // layout:'vertical',
                height: 'SIZE',
                touchPassThrough: !(_args.barColor && _args.barColor !== 'transparent')
            },
            childTemplates: [
                {
                    type: 'Ti.UI.View',
                    properties: {
                        rclass: 'NavBarHolder',
                        height: _args.barHeight,
                        touchPassThrough: true
                    },
                    childTemplates: [
                        {
                            type: 'Ti.UI.View',
                            bindId: 'navBarHolder',
                            properties: {
                                layout: 'horizontal',
                                // backgroundColor:'yellow',
                                touchPassThrough: true
                            },
                            childTemplates: children
                        }
                    ]
                }
            ]
        };
        if (_args.topToolbar) {
            _args.topToolbar = {
                type: 'Ti.UI.View',
                layout: 'vertical',
                height: 'SIZE',
                childTemplates: [view, _args.topToolbar]
            };
        } else {
            _args.topToolbar = view;
        }
        if (_args.topToolbarVisible === undefined) {
            _args.topToolbarVisible = true;
        }
        // console.log('creating customNavBar', view);
        delete _args.titleView;
        delete _args.leftNavButton;
        delete _args.leftNavButtons;
        delete _args.rightNavButton;
        delete _args.rightNavButtons;
        return _args;
    }
    // console.log('test', Base.name, Base.prototype.name, Object.getOwnPropertyNames(Base.prototype));
    return class extends Base {
        //Title
        customNavBar?: boolean;

        constructor(...args: any[]) {
            super(initNavBarArgs(args));
            this.shouldShowBackButton = null;
            if (!!args[0].hasBackButton) {
                app.onDebounce(this, 'click', e => {
                    if (e.callbackId === 'closeBtn') {
                        this.closeMe();
                    }
                });
            }
        }

        prepareSetColorsParams(colors, params) {
            params = super.prepareSetColorsParams(colors, params);
            params.container = params.container || {};
            params.container.titleView = {
                color: colors.contrast
            };
            params.container.navBar = {
                backgroundColor: colors.color
            };
            _.forEach(this.container.navBarHolder.children, function(child: titanium.UILabel) {
                child.color = colors.contrast;
            });
            return params;
        }
    };
    // if (!resultClass.prototype.showTopToolbar) {
    //     return TopToolbar(resultClass);
    // }
    // return resultClass;
}
