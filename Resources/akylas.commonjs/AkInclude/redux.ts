const LANDSCAPE_RIGHT = Ti.UI.LANDSCAPE_RIGHT,
    LANDSCAPE_LEFT = Ti.UI.LANDSCAPE_LEFT,
    UPSIDE_PORTRAIT = Ti.UI.UPSIDE_PORTRAIT,
    PORTRAIT = Ti.UI.PORTRAIT;
const data = {
    propertiesToStyle: ['leftNavButton', 'rightNavButton', 'leftNavButtons', 'rightNavButtons', 'leftButton', 'rightButton', 'titleView', 'pullView', 'headerView', 'footerView', 'views'],
    types: ['Ti.UI.View', ['Ti.UI.Window', 'TiWindow'], 'Ti.UI.NavigationWindow'],
    defaults: {
        byID: {},
        byRclass: {},
        byType: {}
    },
    overloads: {
        byID: {},
        byRclass: {},
        byType: {}
    }
};

declare global {
    class TiWrapper<T extends titanium.Proxy> {
        constructor(args);
        tiProxy: T & { [k: string]: any };
        clearProxy()
        getBind<T>(bindID:string):T
        static setDefault(args);
        on(name: string, callback: Function): this;
        off(name: string, callback: Function): this;
        emit(name: string, arg?: any): this;
    }
}


const weakMap = new WeakMap();

export function getRProxy(source) {
    return weakMap.get(source);
}

function createTiClass(redux, namespace, type, constructorName) {
    return class {
        // __tiProxy;
        // __initArgs;
        // static setDefault(args) {
        //     redux.setDefault(constructorName, args);
        // }
        constructor(args) {
            if (!args || !args.constructorNames) {
                args = redux.style([constructorName], args || {});
            }
            // let results = args.constructorNames || theClass.prepareArgs(this);
            // theClass.prepareArgs(args);
            // results.push(constructorName);
            // console.log('testTi', args.constructorNames, results, namespace, constructorName, type);

            // if (args) args.constructorNames = results;
            // console.log('testTi',namespace, type, constructorName,  args, this);
            // return new Proxy(Ti[namespace]['create' + type](args), {});
            // this.__initArgs = args;
            let tiObject = Ti[namespace]['create' + type](args);
            // tiObject.getRProxy = this.getThis
            weakMap.set(this,tiObject);
            weakMap.set(tiObject,this);
            // this.tiProxy = Ti[namespace]['create' + type](args);
        }
        get tiProxy() {
            // if (!weakMap.has(this)) {
            //     // let tiObject = Ti[namespace]['create' + type](this.__initArgs);
            //     weakMap.set(this,tiObject);
            //     weakMap.set(tiObject,this);
            // }
            return weakMap.get(this);
        }
        // getThis = ()=>{this}
        clearProxy=()=> {
            let tiProxy = weakMap.get(this);
            console.log('clearProxy', tiProxy)
            if (tiProxy) {
                weakMap.delete(tiProxy);
                weakMap.delete(this);
            }

            // if (this.__tiProxy) {
            //     this.__tiProxy.getRProxy = null;
            //     this.__tiProxy = null;
            //     this.__initArgs = null;
            // }
        }
        on(name: string, callback: Function) {
            this.tiProxy && this.tiProxy.on(name, callback);
            return this;
        }
        off(name: string, callback: Function) {
            this.tiProxy && this.tiProxy.off(name, callback);
            return this;
        }
        emit(name: string, callback: Function) {
            this.tiProxy && this.tiProxy.emit(name, callback);
            return this;
        }

        getBind<T>(bindId:string) {
            return this.tiProxy && this.tiProxy[bindId] as T;
        }
        static tiname = constructorName;
    };
}

function mergeObjects(target, source, newObjOverridesDefault) {
    let key, val;
    if (target) {
        for (key in source) {
            if (!source.hasOwnProperty(key)) continue;
            val = source[key];
            // Deep merging.
            if (Array.isArray(val) && (typeof target[key] === 'undefined' || newObjOverridesDefault === true)) {
                target[key] = val.slice(0);
            } else if (Object.isObject(val)) {
                if (!target[key]) target[key] = {};
                mergeObjects(target[key], val, newObjOverridesDefault);
            } else if (typeof target[key] === 'undefined' || newObjOverridesDefault === true) {
                target[key] = val;
            }
        }
    }
    return target;
}

function stylePropFromObj(args, orientation, override, shouldDelete = false) {
    let keys, i;
    if (args.rid) {
        keys = args.rid.split(/\s+/);
        for (i = keys.length - 1; i >= 0; i--) {
            mergeObjects(args, Object.get(data.defaults.byID, [keys[i], orientation]), override);
        }
        // args.rid.split(/[^ ]+/g).forEachRight(function(value) {
        //     mergeObjects(args, Object.get(defaults, [value, orientation]), override);
        // });
        if (shouldDelete) delete args.rid;
    }

    if (args.rclass) {
        keys = args.rclass.split(/\s+/);
        for (i = keys.length - 1; i >= 0; i--) {
            // console.debug('stylePropFromObj', args.rclass, keys[i], Object.get(redux.data.defaults.byRclass, [keys[i], orientation]));
            mergeObjects(args, Object.get(data.defaults.byRclass, [keys[i], orientation]), override);
            // console.debug('stylePropFromObj done', keys[i], args);
        }
        // args.rclass.split(/[^ ]+/g).forEachRight(function(value) {
        //     mergeObjects(args, Object.get(defaults, [value, orientation]), override);
        // });
        if (shouldDelete) delete args.rclass;
    }
    return args;
}

function getClassTree(obj) {
    const isConstructor = typeof obj === 'function';
    let prototype = isConstructor ? obj : obj.constructor;
    let results = [], constructorName, lastConstructorName;
    let i = 0;
    // console.log('getClassTree', obj, obj.prototype, isConstructor);

    while (prototype) {
        i++;
        // console.log('test', i);
        // console.log('prototype.tiname', prototype.tiname);
        // console.log('prototype.name', prototype.name);
        // console.log('prototype.constructor.name', prototype.constructor.name);
        // console.log('prototype.constructor.tiname', prototype.constructor.tiname);
        // console.log('prototype.__proto__', prototype.__proto__);
        let parentProto = isConstructor ? prototype.__proto__ : prototype.__proto__.prototype;
        // console.log('parentProto', parentProto);
        lastConstructorName = constructorName;
        constructorName = prototype.name || prototype.constructor.name;
        if (!parentProto || !prototype.name || lastConstructorName === constructorName) {
            constructorName = prototype.tiname;
        }
        if (constructorName) {
            prototype = parentProto;
            if (constructorName !== 'Function' && constructorName[0] !== '_') {
                results.push(constructorName);
            }
        } else {
            prototype = undefined;
        }
    }
    return results;
}
export default class Redux {
    // call(functionName, args) {
    //     for (var i = 0, l = this.length; i < l; i++) {
    //         this.context[i][functionName](args);
    //     }
    //     return this;
    // };

    // /**
    //  * Expose the applyStyle function to selector based redux usages -- $(view).applyStyle() etc.
    //  * @param type
    //  * @param args
    //  */
    // applyStyle(type, args) {
    //     for (var i = 0, l = this.length; i < l; i++) {
    //         this.applyStyle(this.context[i], type, args);
    //     }
    //     return this;
    // };

    // /**
    //  * Expose the applyOrientation function to selector based redux usages --
    //  * $(view).applyOrientation() etc.
    //  * @param type
    //  * @param args
    //  * @param override
    //  */
    // applyOrientation(orientation, args, override) {
    //     for (var i = 0, l = this.length; i < l; i++) {
    //         this.applyOrientation(this.context[i], orientation, args, override);
    //     }
    //     return this;
    // };

    // /**
    //  * Expose the applyClass function to selector based redux usages --
    //  * $(view).applyOrientation() etc.
    //  * @param type
    //  * @param args
    //  * @param override
    //  */
    // applyClass(rclass, args, orientation, override) {
    //     args = args || {};
    //     args.rclass = rclass;
    //     for (var i = 0, l = this.length; i < l; i++) {
    //         this.applyStyle(this.context[i], undefined, args, orientation, override);
    //     }
    //     return this;
    // };

    // /**
    //  * Expose the applyId function to selector based redux usages --
    //  * $(view).applyOrientation() etc.
    //  * @param type
    //  * @param args
    //  * @param override
    //  */
    // applyId(rid, args, orientation, override) {
    //     args = args || {};
    //     args.rid = rid;
    //     for (var i = 0, l = this.length; i < l; i++) {
    //         this.applyStyle(this.context[i], undefined, args, orientation, override);
    //     }
    //     return this;
    // };
    merge = mergeObjects;
    debug = false;
    constructor(private context, _options) {
        console.log('creating redux', _options);
        // !this.Titanium && context.Titanium && (Titanium = context.Titanium);
        // !this.Ti && context.Ti && (Ti = context.Ti);
        // context['$'] = this;
        if (_options) {
            if (_options.propertiesToStyle) {
                data.propertiesToStyle = data.propertiesToStyle.concat(_options.propertiesToStyle);
            }
            if (_options.types) {
                data.types = data.types.concat(_options.types);
            }
        }
    }
    /**
     * Returns the objects that match your selector, or the root redux object if you did not provide a selector. Note that only
     * objects created by redux constructors can be selected (ex use new Label() instead of Ti.UI.createLabel()).
     * @param {Object} selector
     */
    // init(selector) {
    //     if (!selector) {
    //         return this;
    //     }
    //     this.selector = selector;
    //     // object
    //     if (Object.isObject(selector)) {
    //         this.context = [this[0] = selector];
    //         this.length = 1;
    //         return this;
    //     }
    //     throw 'Non-object selectors have been turned off in this version of redux for memory reasons.';
    // }

    parseOrientationString(o) {
        if (o === undefined) return 'none';
        if (o === LANDSCAPE_RIGHT) return LANDSCAPE_LEFT;
        if (o === UPSIDE_PORTRAIT) return PORTRAIT;
        return o;
    }

    /**
     * Turns a string of RJSS into JavaScript that can be safely evaluated. RJSS is a way to customize JavaScript
     * objects quickly, and is primarily used to style your UI elements.
     *
     * @param {String} rjss The raw RJSS contents to parse into executable JavaScript
     * @returns {String} Executable JavaScript
     */
    parseRJSS(file, _overloads) {
        const theFile = Ti.Filesystem.getFile(file);
        if (file.endsWith('.compiled.js')) {
            return {
                data: theFile.read().text,
                path: theFile.nativePath
            };
        }
        const rjss = theFile.read().text.replace(/[\r\t\n]/g, ' ');
        // if (this.debug) {
        //     console.debug('parseRJSS ', file, rjss);
        // }
        let result = '',
            braceDepth = 0,
            inComment = false,
            inSelector = false,
            inAttributeBrace = false,
            inVariable = false,
            inCode = false,
            inIfStatement = false,
            inOrientation = false,
            canStartSelector = true,
            overloads = _overloads === true,
            methodName = overloads === true ? 'ak.ti.redux.setOverload' : 'ak.ti.redux.setDefault',
            canBeAttributeBrace = false,
            i,
            currentChar,
            l;
        for (i = 0, l = rjss.length; i < l; i++) {
            currentChar = rjss[i];
            if (inComment) {
                if (currentChar == '/' && rjss[i - 1] == '*') {
                    inComment = false;
                }
                continue;
            }
            if (inCode && currentChar !== '@') {
                result += currentChar;
                continue;
            }
            switch (currentChar) {
                case '$':
                case '_':
                    if (braceDepth == 0 && canStartSelector) {
                        canStartSelector = false;
                        inVariable = true;
                        result += 'this.' + currentChar;
                    } else {
                        result += currentChar;
                    }
                    break;
                case '@':
                    if (braceDepth === 0) {
                        if (inCode) {
                            inCode = false;
                        } else if (canStartSelector) {
                            canStartSelector = false;
                            inCode = true;
                        }
                    } else {
                        result += currentChar;
                    }
                    break;
                case ';':
                    if (inVariable) {
                        canStartSelector = true;
                        inVariable = false;
                    }
                    result += currentChar;
                    break;
                case ' ':
                    result += currentChar;
                    break;
                case '/':
                    inComment = rjss[i + 1] == '*';
                    result += inComment ? '' : '/';
                    break;
                case '[':
                    if (braceDepth > 0 || inVariable === true) {
                        result += currentChar;
                    } else {
                        canStartSelector = false;
                        inIfStatement = true;
                        result += 'if (';
                    }
                    break;
                case '=':
                    // if (inIfStatement === true) {
                    //     result += (rjss[i - 1] != '!' && rjss[i - 1] != '<' && rjss[i - 1] != '>') ? '==' : '=';
                    // } else {
                    result += currentChar;
                    // }
                    break;
                case ']':
                    if (braceDepth > 0 || inVariable === true) {
                        result += ']';
                    } else {
                        canStartSelector = true;
                        result += ')';
                        inIfStatement = false;
                        canBeAttributeBrace = true;
                    }
                    break;
                case '{':
                    if (inVariable === true) {
                        braceDepth += 1;
                    } else if (canBeAttributeBrace) {
                        canBeAttributeBrace = false;
                        inAttributeBrace = true;
                    } else {
                        if (inSelector) {
                            inSelector = false;
                            result += '",';
                        }
                        braceDepth += 1;
                    }
                    result += currentChar;
                    break;
                case '}':
                    if (inVariable) {
                        braceDepth -= 1;
                        if (braceDepth === 0) {
                            inVariable = false;
                            canStartSelector = true;
                        }

                        result += currentChar;
                        break;
                    }
                    result += currentChar;
                    braceDepth -= 1;
                    switch (braceDepth) {
                        case 0:
                            if (rjss[i + 1] !== '(') {
                                result += ');';
                                canStartSelector = true;
                            } else {
                                inOrientation = true;
                                result += ',';
                            }
                            break;
                        case -1:
                            inAttributeBrace = false;
                            braceDepth = 0;
                            break;
                    }
                    break;
                case ')':
                    if (inOrientation === true) {
                        result += ');';
                        inOrientation = false;
                        canStartSelector = true;
                    } else {
                        result += currentChar;
                    }
                    break;
                case '(':
                    if (inOrientation === true) break;
                default:
                    canBeAttributeBrace = false;
                    if (braceDepth === 0 && canStartSelector) {
                        canStartSelector = false;
                        inSelector = true;
                        result += (inAttributeBrace ? '' : '\n') + methodName + '("';
                    }
                    result += currentChar;
                    break;
            }
        }
        return {
            data: result,
            path: file.nativePath
        };
    }

    internalIncludeRJSS = (fileName, overloads) => {
        // console.log('internalIncludeRJSS', fileName, overloads);
        if (fileName.endsWith('.compiled.js')) {
            require(fileName);
            return;
        }
        const data = this.parseRJSS(fileName, overloads);
        const parsedRJSS = data.data;
        // console.log('parsedRJSS', fileName, parsedRJSS);
        try {
            new Function(parsedRJSS).call(this.context);
        } catch (e) {
            console.log('error parsing', e);
            // var error = ' in:';
            // Check each line for errors
            const lines = parsedRJSS.split('\n');
            parsedRJSS.split('\n').forEach(function(line, index) {
                try {
                    new Function(line).call(this.context);
                } catch (e2) {
                    // e.message = e.message + ' in:' + line;
                    // e.line = index;
                    // e.sourceURL = data.path;
                    // e.column = e2.column;
                    // throw e;
                    throw {
                        message: e.message + 'in:' + line,
                        line: index,
                        callstack: e.callstack || e.stack,
                        sourceURL: data.path,
                        column: e2.column
                    };
                }
            });
        }
    };

    /**
     * Includes and parses one or more RJSS files. Styles will be applied to any elements you create after calling this.
     * @param {Array} arguments One or more RJSS files to include and parse
     */
    includeRJSS(...args) {
        args.forEach(this.internalIncludeRJSS);
    }
    includeOverloadRJSS(...args) {
        args.forEach(arg => {
            this.internalIncludeRJSS(arg, true);
        });
    }
    /**
     * Adds an event binder that can bind listen events or fire events, similar to how jQuery's events stack works.
     * @param {Object} event
     */
    // addEventBinder: function(event) {
    //     this.init.prototype[event] = function() {
    //         var action;
    //         if (arguments.length === 0 || !(arguments[0] instanceof Function)) {
    //             action = 'fireEvent';
    //         } else {
    //             action = 'addEventListener';
    //         }
    //         for (var i = 0, l = this.context.length; i < l; i++) {
    //             this.context[i][action](event, arguments[0]);
    //         }
    //         return this;
    //     };
    // },

    setDefault(selector: string, defaults: Object, orientation?: string) {
        orientation = this.parseOrientationString(orientation);
        let cleanSelector, target, overloads;

        selector.split(',').forEach(function(value) {
            cleanSelector = value.trim();
            switch (cleanSelector.charAt(0)) {
                case '#':
                    // set by ID
                    target = data.defaults.byID;
                    overloads = data.overloads.byID;
                    cleanSelector = cleanSelector.substring(1);
                    // remove the '#'
                    break;
                case '.':
                    // set by rclass
                    target = data.defaults.byRclass;
                    overloads = data.overloads.byRclass;
                    cleanSelector = cleanSelector.substring(1);
                    // remove the '.'
                    break;
                default:
                    // set by element type
                    target = data.defaults.byType;
                    overloads = data.overloads.byType;
                    break;
            }
            !target[cleanSelector] && (target[cleanSelector] = {});

            var selector = target[cleanSelector];
            var theOverloads = Object.get(overloads, [cleanSelector, orientation]);
            stylePropFromObj(defaults, orientation, false, true);
            !selector[orientation] && (selector[orientation] = {});
            // console.debug('setDefault', cleanSelector, defaults);
            mergeObjects(selector[orientation], defaults, true);
            // console.debug('setDefaultDone', cleanSelector, target[cleanSelector][orientation]);
            if (theOverloads) {
                mergeObjects(selector[orientation], theOverloads, true);
            }
        });
        return this;
    }

    setOverload(selector: string, defaults: Object, orientation: string) {
        orientation = this.parseOrientationString(orientation);
        var cleanSelector, target, overloads;

        selector.split(',').forEach(function(value) {
            cleanSelector = value.trim();
            switch (cleanSelector.charAt(0)) {
                case '#':
                    // set by ID
                    target = data.defaults.byID;
                    overloads = data.overloads.byID;
                    cleanSelector = cleanSelector.substring(1);
                    // remove the '#'
                    break;
                case '.':
                    // set by rclass
                    target = data.defaults.byRclass;
                    overloads = data.overloads.byRclass;
                    cleanSelector = cleanSelector.substring(1);
                    // remove the '.'
                    break;
                default:
                    // set by element type
                    target = data.defaults.byType;
                    overloads = data.overloads.byType;
                    break;
            }
            if (!overloads[cleanSelector]) overloads[cleanSelector] = {};
            var selector = overloads[cleanSelector];
            if (!selector[orientation]) {
                //first default
                selector[orientation] = {};
            }
            var styled = stylePropFromObj(defaults, orientation, false, true);
            mergeObjects(selector[orientation], styled, true);
            if (!Object.get(target, [cleanSelector, orientation])) {
                target[cleanSelector] = target[cleanSelector] || {};
                target[cleanSelector][orientation] = Object.deepCopy(styled);
            }
        });
        return this;
    }

    styleTemplate(args, orientation, override) {
        return this.style(undefined, args, orientation, override);
    }
    style(type: string | string[], args, orientation?, override?) {
        args = args || {};
        let i, l;
        if (!args.hasOwnProperty) return args; //Ti proxy object
        if (Array.isArray(args)) {
            return args.map(value => this.style(undefined, value, orientation, override));
        }
        if (!Array.isArray(type)) {
            if (type && type !== '') {
                type = [type];
            } else {
                type = [];
            }
        }
        if (typeof args.type === 'string') {
            let tiStyle = args.type;
            if (args.type.indexOf('Ti') === 0) {
                tiStyle = tiStyle.split('.').slice(-1)[0];
            }
            type.push(tiStyle);
        }

        let propertiesToStyle = args.properties || args;
        // console.log('types', type, args.hasOwnProperty('properties'));
        // if (args.hasOwnProperty('properties')) {
        // (type as string[]).forEach(t => {
        // console.log('styling', t);
        // if (data.defaults.byType[t]) {
        // args.properties = this.style(type, args.properties, orientation, override);
        // }
        // })
        // args.properties = this.style(type, args.properties, orientation, override);
        // } else {
        orientation = this.parseOrientationString(orientation);
        propertiesToStyle = stylePropFromObj(propertiesToStyle, orientation, override);
        if (type && type.length > 0) {
            (type as string[]).forEach(t => {
                // console.log('styling', t, Object.keys(data.defaults.byType), data.defaults.byType[t]);
                if (data.defaults.byType.hasOwnProperty(t)) {
                    // console.log('styling2', t, orientation, data.defaults.byType[t][orientation], override);
                    propertiesToStyle = mergeObjects(propertiesToStyle, data.defaults.byType[t][orientation], override);
                }
            });
            // console.log('style', propertiesToStyle);
        }
        if (data.propertiesToStyle.length > 0) {
            data.propertiesToStyle.forEach(prop => {
                if (!!propertiesToStyle[prop]) {
                    propertiesToStyle[prop] = this.style(undefined, propertiesToStyle[prop], orientation, override);
                }
            });
        }

        // if (type && type !== '' && data.defaults.byType[type]) {
        //     mergeObjects(args, data.defaults.byType[type][orientation], override);
        // }
        // }
        if (Array.isArray(args.childTemplates)) {
            var children = args.childTemplates;
            for (i = 0, l = children.length; i < l; i++) {
                children[i] = this.style(undefined, children[i], orientation, override);
            }
        }

        // for (i = 0, l = data.propertiesToStyle.length; i < l; i++) {
        //     var prop = data.propertiesToStyle[i];
        //     if (args.hasOwnProperty(prop) && args[prop]) {
        //         args[prop] = this.style(undefined, args[prop], orientation, override);
        //     }
        // }
        return args;
    }

    applyStyle(obj, type, args, orientation, override) {
        override = override !== false;
        var styles = this.style(type, args, orientation, override);
        mergeObjects(obj, styles, override);
    }

    applyOrientation = (obj, orientation, args, override) => {
        args = args || {};
        args.rclass = args.rclass || (obj.rclass || undefined);
        args.id = args.id || (obj.id || undefined);
        var type = obj.constructorName || '',
            styles = this.style(type, args, orientation, override);
        mergeObjects(obj, styles, override);
    };
    createObjectConstructor = (context, constructorName, type, parent) => {
        const redux = this;
        return function(args) {
            console.log('createObjectConstructor', constructorName);
            let results = getClassTree(this);
            results.push(constructorName);
            // console.log('test', results);
            args = redux.style(results, args);
            // if (args) args.constructorNames = results;
            return parent['create' + type](args);
        };
    };
    createTiConstructor = (context, namespace, constructorName, type) => {
        const redux = this;
        var TiClass = function(args) {
            // console.log('testTi1', args.constructorNames, getClassTree(this));
            if (!args || !args.constructorNames) {
                args = redux.style([constructorName], args || {});
            }
            let result = Ti[namespace]['create' + type](args);
            // result.prototype = TiClass.prototype
            // result.__proto__ = this.__proto__
            // result.constructor = this.constructor
            // console.log('test created ti object', 'result', result);
            // console.log('test created ti object', 'result.prototype', result.prototype); //null
            // console.log('test created ti object', 'this', this);
            // console.log('test created ti object', 'this.prototype', this.prototype); //null
            // console.log('test created ti object', ' this.__proto__', this.__proto__);
            // console.log('test created ti object', ' this.constructor',  this.constructor);
            // console.log('test created ti object', result, result.prototype, this, this.prototype, this.__proto__, this.constructor);
            return result;
        } as any;
        // TiClass.prototype = {name:constructorName};
        // TiClass.prototype.constructor =  TiClass;
        TiClass.tiname = constructorName;
        return TiClass;
    };
    prepareClassArgs = (_args, Class) => {
        let results = getClassTree(Class);
        console.log('prepareClassArgs', results);
        _args = this.style(results, _args);
        _args.constructorNames = results;
        // console.log('preparedClassArgs', _args);
        return _args;
    };
    addNaturalConstructor = (context, parent, type, constructorName) => {
        constructorName = constructorName || type;
        // console.log('addNaturalConstructor', JSON.stringify(Object.keys(context)), type, constructorName);
        context[constructorName] = this.createObjectConstructor(context, constructorName, type, parent);
        context[constructorName].setDefault = args => {
            this.setDefault(constructorName, args);
        };
    };

    addTitaniumNaturalConstructor = (context, namespace, type, constructorName?: string) => {
        constructorName = constructorName || type;
        // const redux = this;
        const constructor = (context[constructorName] = createTiClass(this, namespace, type, constructorName));
        // const constructor = context[constructorName] = this.createTiConstructor(context, namespace, constructorName, type );
        //   this.createTiConstructor(context, namespace, constructorName, type));
        // context[constructorName].setDefault = args => {
        //     this.setDefault(constructorName, args);
        // };
        return constructor;
    };

    addTiNaturalConstructors = (context, additionalTypes?) => {
        const types = (additionalTypes || []).concat(data.types);
        // console.log('addTiNaturalConstructors', types);
        const count = types.length;
        let value, key, i, j, args, current, toProcess: string, isMultiple;
        // for (key in types) {
        // iterate over type namespaces (UI, Network, Facebook, etc)
        // if (types.hasOwnProperty(key)) {
        for (i = 0; i < count; i++) {
            current = types[i];
            toProcess = current;
            isMultiple = false;
            if (Array.isArray(current)) {
                toProcess = current[0];
                isMultiple = true;
            }
            args = toProcess.split('.').slice(1);
            value = args.slice(1).join('.');
            key = args[0];
            // console.log('test', current, toProcess, args, value, key);
            if (isMultiple) {
                const constructor = this.addTitaniumNaturalConstructor(context, key, value);
                for (j = 1; j < current.length; j++) {
                    context[current[j]] = constructor;
                }
            } else {
                this.addTitaniumNaturalConstructor(context, key, value);
            }
        }
        // }
    };
}
