import Redux, {getRProxy} from './redux';

export {getRProxy}

const separator = Ti.Filesystem.getSeparator();
const LANDSCAPE_RIGHT = Ti.UI.LANDSCAPE_RIGHT;
const LANDSCAPE_LEFT = Ti.UI.LANDSCAPE_LEFT;
const UPSIDE_PORTRAIT = Ti.UI.UPSIDE_PORTRAIT;
const PORTRAIT = Ti.UI.PORTRAIT;

export default class AKTi {
    private _logStartTimes = {};
    redux: Redux;
    constructors: { [key: string]: (args?) => void } = {};
    private callconstructors = {};
    tiUseClass = false;

    constructor(private context, option) {
        if (option && option.hasOwnProperty('tiUseClass')) {
            this.tiUseClass = option.tiUseClass;
        }
        this.context = context;
        this.redux = new Redux(context, option.redux);
    }
    getRProxy(source) {
        return getRProxy(source);
    }
    markTime = (_key: string) => {
        this._logStartTimes[_key] = new Date().getTime();
    };
    logTime = (_key: string) => {
        var end = new Date().getTime();
        var time = end - this._logStartTimes[_key];
        console.debug('[DURATION]', _key, ':', time, 'ms');
        delete this._logStartTimes[_key];
    };

    createFromConstructor = (_constructor: string, _args?: TiDict): any => {
        return new this.context[_constructor](_args);
    };

    setCallConstructor(path: string, id: string): void {
        this.callconstructors[id] = (...args) => {
            if (!this.constructors[id]) {
                (function() {
                    Ti.include(path);
                }.call(this.context));
            }
            return this.constructors[id].apply(this.context, args);
        };
    }
    setRequireCallConstructor = (path: string, id: string) => {
        // console.log('setRequireCallConstructor', path, id);
        this.callconstructors[id] = (...args) => {
            if (!this.constructors[id]) {
                this.constructors[id] = require(path).create;
            }
            // console.log('setRequireCallConstructor2', id, this.constructors[id]);
            return this.constructors[id].apply(this.context, args);
        };
    };
    setRequireClassCallConstructor = (path: string, id: string) => {
        this.callconstructors[id] = (...args) => {
            if (!this.constructors[id]) {
                this.constructors[id] = require(path);
            }
            return new this.constructors[id](args);
        };
    };

    // loadCreators = (_toLoad: string[], _forceUseClass?: boolean, _endsWithJS?: boolean): void => {
    //     let path, filenameWithExt, creatorName, id, i;
    //     for (i = 0; i < _toLoad.length; i++) {
    //         path = _toLoad[i];

    //         if (!_endsWithJS && !path.endsWith('.js')) {
    //             path += '.js';
    //         }
    //         filenameWithExt = path.split('/').slice(-1)[0];
    //         creatorName = filenameWithExt
    //             .split('.')
    //             .slice(0, -1)
    //             .join('.');
    //         // let shouldUseClass = this.tiUseClass;
    //         // if (_forceUseClass !== undefined) {
    //         //     shouldUseClass = _forceUseClass;
    //         // }
    //         // if (shouldUseClass) {
    //         // this.setRequireCallConstructor(path, creatorName);
    //         // } else {
    //         id = 'create' + creatorName;
    //         this.setRequireCallConstructor(path, id);
    //         // this.setCallConstructor(path, id);
    //         // }
    //         this.redux.addNaturalConstructor(this.context, this.callconstructors, creatorName, creatorName);
    //     }
    // };

    // loadCreatorsFromDir = (_dir: string): void => {
    //     var dir = Ti.Filesystem.getFile(_dir);
    //     var dir_files = dir.getDirectoryListing();
    //     if (!dir_files) return;
    //     var toLoad = [];
    //     let dirFile: string;
    //     for (var i = 0; i < dir_files.length; i++) {
    //         dirFile = dir_files[i];
    //         if (!dirFile.endsWith('.js')) continue;
    //         var path = _dir + separator + dirFile;
    //         if (path[0] !== '/') path = '/' + path;
    //         toLoad.push(path);
    //     }
    //     this.loadCreators(toLoad, true);
    // };

    // loadUIModules = (args: string[]): void => {
    //     for (var i = 0, l = args.length; i < l; i++) {
    //         var path = args[i];
    //         if (path[0] !== '/') path = '/' + path;
    //         if (path.endsWith('.js')) path = path.slice(0, -3);
    //         var creatorName = path.split('/').slice(-1)[0];
    //         var id = 'create' + creatorName;

    //         this.setRequireCallConstructor(path, id);
    //         this.redux.addNaturalConstructor(this.context, this.callconstructors, creatorName, creatorName);
    //     }
    // };

    // loadUIModulesFromDir = (_dir: string): void => {
    //     var dir = Ti.Filesystem.getFile(_dir);
    //     var dir_files = dir.getDirectoryListing();
    //     if (!dir_files || dir_files === null) return;
    //     var toLoad: string[] = [];
    //     for (var i = 0; i < dir_files.length; i++) {
    //         var dirFile = dir_files[i];
    //         if (dirFile.match(/.js$/)) {
    //             toLoad.push(_dir + separator + dirFile.slice(0, -3));
    //         }
    //     }
    //     this.loadUIModules(toLoad);
    // };

    internalLoadRjssFromDir = (_callback: (dir: string) => void, _dir: string): void => {
        var dir = Ti.Filesystem.getFile(_dir);
        var dir_files = dir.getDirectoryListing();
        if (!dir_files) return;
        // console.log('internalLoadRjssFromDir1', dir);
        dir_files.forEach(function(dirFile) {
            console.log('internalLoadRjssFromDir', dirFile);
            // dirFile = dirFile.replace('.rjss.compiled.js', '.rjss');
            if (dirFile.endsWith('rjss') || dirFile.endsWith('rjss.compiled.js')) {
                _callback(_dir + separator + dirFile);
            }
        });
    };

    internalLoadRjss = (_callback: (...dirs: string[]) => void, files: string[]): void => {
        _callback.apply(
            this.context,
            files.map(function(n: string) {
                if (!n.endsWith('.rjss')) n += '.rjss';
                return n;
            })
        );
    };

    getOrientation(o: number): string {
        switch (o) {
            case PORTRAIT: {
                return 'portrait';
            }
            case UPSIDE_PORTRAIT: {
                return 'portrait';
            }
            case LANDSCAPE_LEFT: {
                return 'landscape';
            }
            case LANDSCAPE_RIGHT: {
                return 'landscape';
            }
            default:
                return 'unknown';
        }
    }

    isPortrait(o: number): Boolean {
        return o === PORTRAIT || o === UPSIDE_PORTRAIT;
    }

    isLandscape(o: number): Boolean {
        return o === LANDSCAPE_LEFT || o === LANDSCAPE_RIGHT;
    }

    add = (_view: View | titanium.UIView, _children: View | titanium.Proxy | TiDict | Array<View | TiDict | titanium.Proxy>, _index?: number): void => {
        // if (_view instanceof TiWrapper) {
        //     _view = _view.get() as View;
        // }
        const tiView:titanium.UIView = _view['tiProxy'] || _view;
        if (!Array.isArray(_children)) {
            _children = [_children];
        }
        // if (_index !== undefined) {
            tiView.add(this.style(_children).map(t=>t.tiProxy || t), _index);
        // } else {
        //     tiView.add(this.style(_children).map(t=>t.tiProxy || t));
        // }
    };

    create = (_type: string, _args: TiDict, _defaults: TiDict): any => {
        var args = this.style(_args, _type, _defaults);
        if (_defaults) {
            Object.defaults(_args, _defaults);
        }
        return this.createFromConstructor(_type, _args);
    };

    style = (_template: View | TiDict | titanium.Proxy | Array<View | TiDict | titanium.Proxy>, _type?: string, _defaults?: TiDict) => {
        var result = this.redux.style(_type, _template);
        if (_defaults) {
            Object.defaults(result, _defaults);
        }
        return result;
    };

    applyClass = (_view: View |titanium.Proxy, _class: string) => {
        var props = this.style({
            rclass: _class
        });
        if (_view.hasOwnProperty('tiProxy')) {
            (_view['tiProxy'] as titanium.Proxy).applyProperties(props);
        } else {
            Object.assignDeep(_view, props);
        }
    };

    prepareTemplate = (_template: TiDict): {} => {
        this.style(_template);
        return _template;
    };

    prepareListViewTemplate = (_template: TiDict): {} => {
        return this.style(_template, 'ListItem');
    };

    includeOverloadRJSS = (...args: string[]) => {
        this.redux.includeOverloadRJSS.apply(this.redux, args);
    };
    includeRJSS = (...args: string[]) => {
        this.redux.includeRJSS.apply(this.redux, args);
    };
    loadRjssFromDir = (dir: string) => {
        this.internalLoadRjssFromDir(this.includeRJSS, dir);
    };
    loadOverloadRjssFromDir = (dir: string) => {
        this.internalLoadRjssFromDir(this.includeOverloadRJSS, dir);
    };
    loadOverloadRjss = (...args: string[]) => {
        this.internalLoadRjss(this.includeOverloadRJSS, args);
    };
    loadRjss = (...args: string[]) => {
        this.internalLoadRjss(this.includeRJSS, args);
    };
    addTiNaturalConstructors = (addedTypes?) => {
        this.redux.addTiNaturalConstructors(this.context, addedTypes);
    };
}

// declare global {
//     namespace AK { class Ti extends AKTi {} }
// }

// export function init(context, option) {
//     return new AKTi(context, option);
// }

declare global {
    namespace AK { class Ti extends AKTi {} }
}
