import AKTi from './akylas.ti';
declare global {
    type TiPlatformInfo = TiDict & {
        ostype: string;
        name: string;
        id: string;
        locale: string;
        model: string;
        SDKVersion: number;
        isAndroid: boolean;
        isApple: boolean;
        densityFactor: number;
        density: string;
        pixelWidth: number;
        pixelHeight: number;
        width: number;
        height: number;
        isSimulator: boolean;
        isIpad: boolean;
        // isIPhone5: boolean
        isIPhoneX: boolean;
        // isOldiPhone: boolean
        isRetina: boolean;
        isTablet: boolean;
        dpi: number;
        xdpi: number;
        ydpi: number;
    };
    type TiAppInfo = TiDict & {
        deployType: string;
        version: string;
        versionName: string;
        buildDate: number;
        description: string;
        copyright: string;
        publisher: string;
        id: string;
        name: string;
        installId: string;
        buildNumber: number;
        tiBuildHash: string;
        tiBuildDate: number;
        tiVersion: string;
        production: boolean;
        adhoc: boolean;
    };
    type TiLocalInfo = TiDict & {
        currentCountry: string;
    };
}
export default class AKClass {
    osname: string;
    ti: AK.Ti;
    locale: AK.Lang;
    constructor(context, _config) {
        let module: AK.AK = this;
        this.osname = Ti.Platform.osname;
        (function() {
            // akInclude('MicroEvent');
            this['__APPLE__'] = module.osname === 'ipad' || module.osname === 'iphone';
            this['__ANDROID__'] = module.osname === 'android';
            this['__PRODUCTION__'] = Ti.App.deployType === 'production';
            this['__DEVELOPMENT__'] = Ti.App.deployType === 'development';
            this['__SIMULATOR__'] = /simulator|sdk/i.test(Ti.Platform.model);

            console.debug('__APPLE__', __APPLE__);
            console.debug('__ANDROID__', __ANDROID__);
            console.debug('__PRODUCTION__', __PRODUCTION__);
            console.debug('__DEVELOPMENT__', __DEVELOPMENT__);
            console.debug('__SIMULATOR__', __SIMULATOR__);
            this.stringify =
                this.stringify ||
                function(value: any, space: string | number) {
                    var cache = [];
                    var result = JSON.stringify(
                        value,
                        function(key, value) {
                            if (typeof value === 'object' && value !== null) {
                                if (cache.indexOf(value) !== -1) {
                                    // Circular reference found, discard key
                                    return;
                                }
                                // Store value in our collection
                                cache.push(value);
                            }
                            return value;
                        },
                        space
                    );
                    cache = null; // Enable garbage collection
                    return result;
                };
            if (__PRODUCTION__ === true) {
                Ti.API.info = Ti.API.debug = this.sdebug = this.sinfo = this.psdebug = this.psinfo = this.debug = this.info = this.error = console.debug = console.info = console.warn = console.trace = function() {};
            } else {
                var stringifyArray = function(array, space?) {
                    var message = '';
                    for (var i = 0; i < array.length; i++) {
                        var msg = array[i];
                        message += (typeof msg === 'string' ? msg : stringify(msg, space)) + ' ';
                    }
                    return message;
                };
                this.debug =
                    this.debug ||
                    function(...strings: any[]) {
                        Ti.API.debug(strings);
                    };
                this.info =
                    this.info ||
                    function(...strings: any[]) {
                        Ti.API.info(strings);
                    };
                this.error =
                    this.error ||
                    function(...strings: any[]) {
                        Ti.API.error(strings);
                    };

                this.sdebug =
                    this.sdebug ||
                    function(...strings: any[]) {
                        Ti.API.debug(stringifyArray(strings));
                    };
                this.sinfo =
                    this.sinfo ||
                    function(...strings: any[]) {
                        Ti.API.debug(stringifyArray(strings));
                    };
                this.psdebug =
                    this.psdebug ||
                    function() {
                        var args = Array.prototype.slice.call(arguments);
                        Ti.API.info(stringifyArray(args, '\t'));
                    };
                this.psinfo =
                    this.psinfo ||
                    function() {
                        var args = Array.prototype.slice.call(arguments);
                        Ti.API.info(stringifyArray(args, '\t'));
                    };
            }

            var modules = _config.modules || ['ti', 'moment', 'lang'];

            for (var i = 0, j = modules.length; i < j; i++) {
                var moduleStr = modules[i];
                if (moduleStr === 'ti') {
                    module.ti = new AKTi(context, _config);
                } else if (moduleStr === 'moment') {
                    if (context.moment) continue;
                    var path = _config.modulesDir ? _config.modulesDir + 'moment/' : '';
                    _config.momentPath = path;
                    context.moment = require(path + 'moment');
                    // module.moment = context.moment;
                } else if (moduleStr === 'numeral') {
                    if (context.numeral) continue;
                    var path = _config.modulesDir ? _config.modulesDir + 'numeral/' : '';
                    _config.numeralPath = path;
                    context.numeral = require(path + 'numeral');
                    // module.numeral = context.numeral;
                } else if (moduleStr === 'lang') {
                    if (module.locale) continue;
                    module.locale = require('akylas.commonjs/AkInclude/akylas.lang').init(context, _config);
                } else {
                    var name = moduleStr.toLowerCase();
                    if (module[name]) continue;
                    module[name] = akRequire('akylas.commonjs/AkInclude/akylas.' + name).init(context);
                }
            }

            // var additions = _config.additions || [];

            // for (var i = 0, j = additions.length; i < j; i++) {
            //     var addition = additions[i];
            //     if (addition.indexOf('.') === -1)
            //         addition = 'akylas.additions.' + additions[i].toLowerCase();
            //     akInclude(addition);
            // }
        }.call(context));
    }
    getPlatformInfo() {
        const self = Ti.Platform.fullInfo as TiPlatformInfo;

        Object.assign(self, {
            isAndroid: __ANDROID__,
            isApple: __APPLE__,
            width: self.pixelWidth / self.densityFactor,
            height: self.pixelHeight / self.densityFactor,
            isSimulator: /simulator/i.test(self.model)
        });

        if (__APPLE__) {
            Object.assign(self, {
                isIpad: self.isTablet,
                // isIPhone5: (self.height === 1136),
                // isOldiPhone: !self.isSimulator && /iphone\s*[1-4].*/i.test(
                // self.model),
                isIPhoneX: self.width === 375 && self.height === 812 && self.densityFactor === 3,
                isRetina: self.densityFactor >= 2,
                isTablet: /ipad/.test(this.osname)
            });
        } else if (__ANDROID__) {
            const x = Math.pow(self.pixelWidth / self.xdpi, 2);
            const y = Math.pow(self.pixelHeight / self.ydpi, 2);
            const screenInches = Math.sqrt(x + y);
            sdebug('Screen inches', screenInches);
            self.isTablet = screenInches >= 6;
        }
        return self;
    }

    getAppInfo() {
        const self = Ti.App.fullInfo as TiAppInfo,
            tiInfo: any = Ti.tiSDKInfo;
        Object.assign(self, {
            production: self.deployType === 'production',
            adhoc: self.deployType === 'test',

            tiVersion: tiInfo.version,
            tiBuildDate: tiInfo.buildDate,
            tiBuildHash: tiInfo.buildHash
        });
        return self;
    }

    getLocaleInfo() {
        return Ti.Locale.fullInfo as TiLocalInfo;
    }

    prepareAppObject(_app: Object) {
        Object.assign(_app, {
            deviceinfo: this.getPlatformInfo(),
            info: this.getAppInfo()
        });
    }
}

declare global {
    namespace AK { class AK extends AKClass {} }
}
// export function init(context, config): AKClass {
//     return new AKClass(context, config);
// }
