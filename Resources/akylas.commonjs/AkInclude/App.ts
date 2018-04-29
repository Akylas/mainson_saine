import { EventEmitter } from 'events';
import WindowManager from './WindowManager';

const toAddForIOS = 'Ti.UI.iOS.TransitionAnimation';

function setPropertyByPlatform(_object, _property) {
    var objToHandle = _object[_property];
    if (!objToHandle) {
        return;
    }
    if (__APPLE__) {
        delete objToHandle.android;
        Object.assign(objToHandle, objToHandle.ios);
        delete objToHandle.ios;
    } else if (__ANDROID__) {
        delete objToHandle.ios;
        Object.assign(objToHandle, objToHandle.android);
        delete objToHandle.android;
    }
}

export interface IconicFont {}

export type AppArgs = {
    mappings?: { [key: string]: string[] };
    ifAndroid?: (AKApp) => void;
    ifApple?: (AKApp) => void;
    utilities?: any;
    forceLanguage?: string;
    defaultLanguage?: string;
    templatesPreRjss?: string[];
    templates?: string[];
} & TiProperties;

export default class AKApp extends EventEmitter {
    utilities: any;
    deviceinfo: TiPlatformInfo;
    info: TiAppInfo;
    ui: AK.IWindowManager;

    views = {};
    modules: { [key: string]: string | any } = {};
    services = {};
    values: { [key: string]: TiDict } = {
        winOpeningArgs: {}
    };
    fonts = {};
    utils = {};
    templates: { [key: string]: TemplateModule } = {};

    constructor(private context, private _args?: AppArgs) {
        super();
        if (_args.modules) {
            this.modules = _args.modules as any;
        }
        if (_args.fonts) {
            this.fonts = _args.fonts;
        }

        _args = _args || {};
        delete _args.modules;
        delete _args.fonts;
        this.context = context;

        var i, template;

        // !APP INFO
        ak.prepareAppObject(this);

        setPropertyByPlatform(this, 'fonts');
        setPropertyByPlatform(this, 'modules');
        setPropertyByPlatform(this, 'templates');
        setPropertyByPlatform(this, 'iconicfonts');

        //load modules if not loaded yet
        for (var key in this.modules) {
            if (typeof this.modules[key] === 'string') {
                console.time('module ' + key);
                this.modules[key] = require(this.modules[key] as string);
                console.timeEnd('module ' + key);
                // console.debug('loaded module', key);
            }
        }
        delete _args.modules;

        if (_args.mappings) {
            // console.debug('adding mappings', _args.mappings);
            var value, source;
            for (var key in _args.mappings) {
                value = _args.mappings[key];
                source = value[0];
                if (typeof source === 'string' && this.modules.hasOwnProperty(source)) {
                    source = this.modules[source];
                }
                ak.ti.redux.addNaturalConstructor(context, source, value[1], key);
            }
            delete _args.mappings;
        }

        this.values.events = {
            click: __APPLE__ ? 'singletap' : 'click',
            longclick: __APPLE__ ? 'longpress' : 'longclick'
        };

        if (__ANDROID__) {
            // console.debug('adding android animations');
            Object.defaults(this.values.winOpeningArgs, {
                activityEnterAnimation: Ti.Android.R.anim.fade_in,
                activityExitAnimation: Ti.Android.R.anim.fade_out
            });
            if (_args.ifAndroid) {
                _args.ifAndroid(this);
                delete _args.ifAndroid;
            }
        } else if (__APPLE__) {
            Object.defaults(this.values.winOpeningArgs, {
                transition: Ti.UI.iOS.MODAL_TRANSITION_STYLE_CROSS_DISSOLVE,
                duration: 400
            });
            if (_args.ifApple) {
                _args.ifApple(this);
                delete _args.ifApple;
            }
        }
    }
    loadVariables() {
        ak.ti.loadRjss('$variables'); //load variables
        console.debug('loadVariables', $);
    }
    main = () => {
        const _app = this;
        let _args = this._args;

        // if (_args.utilities === true) {
        //     this.utilities = require('lib/utilities');
        //     delete _args.utilities;
        // }
        ak.ti.addTiNaturalConstructors();

        // var map: string[] = [
        //     // 'NavigationBar',
        //     'AnimatedWindow',
        //     // 'AppTabController',
        //     // 'AppTabView',
        //     'BaseWindow'
        // ].map(function(name: string) {
        //     return akPath(name, 'ui/');
        // });
        // console.time('creators');
        // !loading creators
        // ak.ti.loadCreators(map, false);

        // ak.ti.loadCreatorsFromDir('ui');
        // console.timeEnd('creators');

        // console.debug('App', 'loading language', _args.forceLanguage _args.defaultLanguage);

        console.time('lang');
        if (_args.defaultLanguage) {
            ak.locale.defaultLanguage = _args.defaultLanguage;
            console.debug('App', 'defaultLanguage', ak.locale.defaultLanguage);
            delete _args.defaultLanguage;
        }
        if (_args.forceLanguage) {
            ak.locale.loadLanguage(_app.context, _args.forceLanguage);
            console.debug('App', 'forceLanguage', _args.forceLanguage);
            delete _args.forceLanguage;
        } else {
            ak.locale.loadLanguage(_app.context);
        }
        console.debug('App', 'currentLanguage', ak.locale.currentLanguage);
        console.timeEnd('lang');

        _app.loadVariables.call(this);
        // akInclude('TemplateModule');

        console.time('templates');
        var template, module;
        if (_args.templatesPreRjss) {
            for (let i = 0; i < _args.templatesPreRjss.length; i++) {
                template = _args.templatesPreRjss[i];
                module = require('templates/' + template);
                if (module) {
                    _app.templates[template] = module;
                    if (module.load) {
                        _app.templates[template] = module.load(_app.context);
                    }
                }
            }
            delete _args.templatesPreRjss;
        }
        console.timeEnd('templates');

        //first look for rjss
        console.time('rjss');
        const production = !__DEVELOPMENT__;
        // const production = false;
        if (production) {
            require('overloads/joined.rjss.compiled.js');
            require('rjss/joined.rjss.compiled.js');
        } else {
            var dir_files: any = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory).getDirectoryListing();
            if (dir_files) {
                var vRegex = /\.v([0-9]+)/;
                var SDKVersion = _app.deviceinfo.SDKVersion;
                var deviceModel = _app.deviceinfo.model;
                var mRegex = /~(\w+)/i;
                // console.debug(SDKVersion, deviceModel, dir_files);
                let groups = {
                    others: [],
                    overloads: [],
                    rjss: []
                };
                dir_files = dir_files
                    .filter(function(item, pos, self) {
                        return self.indexOf(item) == pos;
                    })
                    .map(function(n: string) {
                        let name = 'others';
                        if (/^rjss/.test(n)) {
                            name = 'rjss';
                        }
                        if (/^overloads/.test(n)) {
                            name = 'overloads';
                        }
                        groups[name].push(n);
                    });

                function loadRjssFromDirPlatDep(paths, callback) {
                    var i = paths.length;
                    let version, model, n;
                    while (i--) {
                        n = paths[i];
                        version = n.match(vRegex);
                        model = n.match(mRegex);
                        if ((version && SDKVersion < version[1]) || (model && !new RegExp(model[1], 'i').test(deviceModel))) {
                            paths.slice(i, 1);
                        }
                    }
                    paths.forEach(callback);
                }
                console.debug('loadRjssFromDirPlatDep', groups);
                if (groups.overloads) {
                    loadRjssFromDirPlatDep(groups.overloads, ak.ti.loadOverloadRjssFromDir);
                }
                if (groups.rjss) {
                    loadRjssFromDirPlatDep(groups.rjss, ak.ti.loadRjssFromDir);
                }
            }
        }

        console.timeEnd('rjss');

        if (_args.templates) {
            for (let i = 0; i < _args.templates.length; i++) {
                template = _args.templates[i];
                _app.templates[template] = require('templates/' + template);
                if (_app.templates[template].load) {
                    _app.templates[template] = _app.templates[template].load(_app.context);
                }
            }
            delete _args.templates;
        }
        // !WINDOW MANAGER
        if (_args.windowManager) {
            this['NavigationWindow'] &&
                this['NavigationWindow'].setDefault({
                    openedWindows: [],
                    handlingOpening: false
                });

            _app.ui = new WindowManager(
                Object.assign(
                    {
                        shouldDelayOpening: false
                    },
                    _args.windowManager
                )
            );
            delete _args.windowManager;
        }
        for (var key in _args) {
            this[key] = _args[key];
        }
        delete this._args;
    };
    debounce(_callback: Function, _time?: number) {
        return Function.debounce(_callback, _time !== undefined ? _time : 500, true);
    }

    onDebounce = (_object: {on(type:string,callback:Function)}, _type: string, _callback: Function) => {
        _object.on(_type, this.debounce(_callback));
    };
    private pendingAlerts = [];
    private runningAlert = false;
    private onAlertFinished = () => {
        this.runningAlert = false;
        if (this.pendingAlerts.length > 0) {
            this.showAlert(this.pendingAlerts.shift());
        }
    };
    showAlert = (_args: TiProperties | string, onClick?: Function) => {
        // (function() {
        if (!this.runningAlert) {
            if (typeof _args === 'string') {
                _args = {
                    title: trc('info'),
                    message: _args
                };
            }
            var alert;
            if (_args.showMe) {
                alert = _args;
            } else {
                const constructorName = (_args.constructorName as string) || 'AlertDialog';
                delete _args.constructorName;
                alert = ak.ti.createFromConstructor(constructorName, _args);
            }
            alert.once('close', this.onAlertFinished);
            if (onClick) {
                alert.once('click', onClick);
            }
            alert.showMe ? alert.showMe(true) : alert.show();
        } else {
            this.pendingAlerts.push(_args);
        }
        // }).call(context);
    };

    confirmAction(_args: TiProperties, _callback?: Function, _callbackCancel?: Function) {
        console.log('confirmAction', _args, _callback, _callbackCancel);
        const alert = ak.ti
            .create((_args.constructorName as string) || 'AlertDialog', _args, {
                cancel: 0,
                buttonNames: [trc('cancel'), trc('ok')],
                message: trc('are_you_sure') + '?',
                title: trc('confirmation')
            })
            .on('click', function(e) {
                if (!!!e.cancel) {
                    _callback && _callback(e);
                } else if (_callbackCancel) {
                    _callbackCancel && _callbackCancel(e);
                }
            });
        alert.showMe ? alert.showMe(true) : alert.show();
        return alert;
    }

    confirm(_args: TiProperties) {
        return new Promise<{ cancel: boolean; index: number; source: titanium.Proxy }>(function(resolve, reject) {
            app.confirmAction(_args, resolve, resolve);
        });
    }

    composeFunc(...funcs: Function[]) {
        return function(...args) {
            for (var i = funcs.length - 1; i >= 0; i--) {
                if (funcs[i]) args = [funcs[i].apply(this, args)];
            }
            return args[0];
        };
    }

    closeApp() {
        app.ui.rootWindow && app.ui.rootWindow.getTiProxy().close();
    }

    getImage?(path: string): Promise<any> {
        return Promise.reject(undefined);
    }

    imageToTempFile = image => {
        return new Promise(function(resolve, reject) {
            console.log('imageToTempFile', image);
            if (typeof image === 'string') {
                if (/https?:/.test(image)) {
                    return this.getImage(image).then(data => {
                        var filenameBase = 'sharedImage',
                            tmpFile = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, filenameBase + '.jpeg');
                        tmpFile.write(data);
                        return tmpFile.nativePath;
                    });
                    // Titanium.Network.createHTTPClient({
                    //     timeout: 10000,
                    //     onload: function() {
                    //         var filenameBase = 'sharedImage',
                    //             tmpFile = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, filenameBase + '.jpeg');
                    //         tmpFile.write(this.responseData);
                    //         resolve(tmpFile.nativePath);
                    //     },
                    //     onerror: () => {
                    //         resolve(null);
                    //     }
                    // })
                    //     .open('GET', image)
                    //     .send();
                } else {
                    resolve(image);
                }
            } else {
                var filenameBase = 'sharedImage',
                    tmpFile = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, filenameBase + '.jpeg');
                tmpFile.write(image);
                resolve(tmpFile.nativePath);
            }
        });
    };

    share(_args, _externalImage?, type?: string) {
        var image = _externalImage || _args.image;
        _args.onstart && _args.onstart();
        console.log('share', _args, _externalImage, type);
        if (typeof image === 'string') {
            if (/https?:/.test(image)) {
                return this.getImage(image).then(
                    data => {
                        this.share(_args, data);
                    },
                    err => {
                        this.share(_args, null);
                    }
                );
                // Titanium.Network.createHTTPClient({
                //     timeout: 10000,
                //     onload: function() {
                //         this.share(_args, this.responseData);
                //     },
                //     onerror: () => {
                //         this.share(_args, null);
                //     }
                // })
                //     .open('GET', image)
                //     .send();
                // return;
            }
        }
        var hasImage = image && image !== null,
            hasDataForActivity = typeof _args.dataForActivityType === 'function',
            hasSubjectForActivity = typeof _args.subjectForActivityType === 'function',
            orderedKeys = ['html', 'text', 'image'];
        if (__APPLE__) {
            var items = [];
            // if (!hasDataForActivity) {
            orderedKeys.forEach(function(value) {
                if (value === 'image') {
                    items.push(image);
                } else if (_args[value]) {
                    items.push(_args[value]);
                }
            });
            // }
            Ti.UI.iOS
                .createActivityView({
                    subject: _args.subject,
                    thumbnail: image,
                    excluded: _args.excluded,
                    items: items,
                    subjectForActivityType: hasSubjectForActivity
                        ? function(_type, _items) {
                              return _args.subjectForActivityType(_type) || _args.subject;
                          }
                        : undefined,
                    itemForActivityType: hasDataForActivity
                        ? function(_type, _items) {
                              var keys: any = _args.dataForActivityType(_type) || orderedKeys;
                              // if (keys.hasOwnProperty) {
                              //     var result = [];
                              //     if (keys['html']) {
                              //         result.push(keys['html']);
                              //     } else if (keys['text']) {
                              //         result.push(keys['text']);
                              //     }
                              //     if (hasImage) {
                              //         result.push(image);
                              //     }
                              //     return result;
                              // }
                              var result = [];
                              orderedKeys.forEach(function(value, key) {
                                  if (keys.indexOf(value) !== -1) {
                                      if (value === 'image' && hasImage) {
                                          result.push(image);
                                      } else {
                                          result.push(_args[value]);
                                      }
                                  }
                              });
                              // console.log('itemForActivityType', orderedKeys, result);
                              return result;
                          }
                        : undefined
                })
                .show();
        } else if (__ANDROID__) {
            if (hasImage && !(typeof image === 'string')) {
                var filenameBase = 'sharedImage',
                    tmpFile = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, filenameBase + '.jpeg');
                tmpFile.write(image);
                image = tmpFile.nativePath;
            }
            type = type || (hasImage ? 'image/jpeg' : 'text/plain');
            let packages = Ti.Android.queryIntentActivities(Ti.Android.ACTION_SEND, type),
                labelIntents = [],
                mainIntent;
            if (Array.isArray(_args.excluded)) {
                var i = packages.length;
                while (i--) {
                    if (_args.excluded.indexOf(packages[i].packageName)) {
                        packages.slice(i, 1);
                    }
                }
            }
            packages.forEach(function(pkg, key, list) {
                var orderedKeys = ['subject', 'html', 'text', 'image'];
                var params: any = Object.assign(
                    {
                        action: Ti.Android.ACTION_SEND,
                        // type: hasImage && /messaging/.test(pkg.packageName) ? 'text/x-vcard': type
                        type: type
                    },
                    pkg
                );
                console.debug(pkg.packageName, keys, params);
                if (hasSubjectForActivity) {
                    params.subject = _args.subjectForActivityType(pkg.packageName) || _args.subject;
                } else {
                    params.subject = _args.subject;
                }
                if (hasDataForActivity) {
                    var keys = _args.dataForActivityType(pkg.packageName) || orderedKeys;
                    if (!keys) return;
                    if (keys.hasOwnProperty) {
                        Object.assign(params, keys);
                        // if (keys['html']) {
                        //     params.html = keys['html'];
                        // } else if (keys['text']) {
                        //     params.text = keys['text'];
                        // }
                        if (keys['image'] && hasImage) {
                            params.stream = image;
                        }
                    } else {
                        var array = keys;
                        if (keys.indexOf('subject') !== -1) {
                            params.subject = _args['subject'];
                        }
                        if (keys.indexOf('html') !== -1) {
                            params.html = _args['html'];
                        } else if (keys.indexOf('text') !== -1) {
                            params.text = _args['text'];
                        }
                        if (keys.indexOf('image') !== -1 && hasImage) {
                            params.stream = image;
                        }
                    }
                } else {
                    if (/\.gm$|mail/.test(pkg.packageName) && _args.html) {
                        params.html = _args.html;
                    } else {
                        params.text = _args.text;
                    }
                    params.stream = image;
                }
                labelIntents.push(params);
            });
            if (labelIntents.length > 0) {
                console.debug(labelIntents);
                var intent = labelIntents.shift();
                Ti.Android.currentActivity.startActivity(Ti.Android.createIntentChooser(intent, (_args.title as string) || null).putExtraInitialIntents(labelIntents));
            }
        }
        if (_args.ondone) _args.ondone();
    }
}

declare global {
    namespace AK { class App extends AKApp {} }
}
export function init(context, option) {
    return new AKApp(context, option);
}
