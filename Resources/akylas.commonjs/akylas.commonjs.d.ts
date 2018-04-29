/// <reference path="/Volumes/data/mguillon/Library/Application Support/Titanium/mobilesdk/osx/7.2.0.AKYLAS/titanium.d.ts" />

declare function akPath(name: string, dir: string): string;
declare function akRequire(moduleId: string): any;
declare function akInclude(moduleId: string);
declare function debounce(func: (...args: any[]) => any, wait: number, immediate?: boolean): (...args: any[]) => any;
declare function sdebug(...strings: any[]);
declare function sinfo(...strings: any[]);
declare function serror(...strings: any[]);
declare function stringify(value: any, space?: string | number);
declare function tr(id: string, _data?: string | object, _default?: string): string;
declare function trc(id: string, _data?: string | object, _default?: string): string;
declare function tru(id: string, _data?: string | object, _default?: string): string;
declare function trt(id: string, _data?: string | object, _default?: string): string;
declare var __APPLE__: boolean;
declare var __ANDROID__: boolean;
declare var __PRODUCTION__: boolean;
declare var __DEVELOPMENT__: boolean;
declare var __SIMULATOR__: boolean;
declare var __dirname: string;

declare var ak: AK.AK;

// interface String {
//     assign(...args);
// }
interface Object {
    assignDeep(target: Object, ...sources): Object;
    bindAssign(target: Object, ...sources): Object;
    defaults(target: Object, ...sources): Object;
    deepCopy(source: Object): Object;
    isObject(source): Boolean;
    get(source: Object, keys: string[]): any;
    findDeep(source: Object, key: string): any[];
}
interface Function {
    debounce(func: Function, wait: number, immediate?: Boolean): Function;
}


declare class TiUIWindowExtended extends titanium.UIWindow {
    winId?: any;
    akmanaged?: boolean;
    winOpeningArgs?: titanium.openWindowParams;
    winClosingArgs?: titanium.openWindowParams;
    // getRProxy():TiWindow
}
declare class TiUIViewExtended extends titanium.UIView {
    // getRProxy():View
}
declare class TiUINavigationWindowExtended extends titanium.UINavigationWindow {
    winId?: any;
    akmanaged?: boolean;

    winOpeningArgs?: titanium.openWindowParams;
    winClosingArgs?: titanium.openWindowParams;
    // getRProxy():NavigationWindow
}

declare class View extends TiWrapper<TiUIViewExtended> {}
declare class TiWindow extends TiWrapper<TiUIWindowExtended> {
    toDoAfterOpening?();
}
declare class NavigationWindow extends TiWrapper<TiUINavigationWindowExtended> {
    toDoAfterOpening?();
}
declare class ListView extends TiWrapper<titanium.UIListView> {}
declare class CollectionView extends TiWrapper<titanium.UIListView> {}

// declare class View extends Ti.UI.View {
//     static prepareArgs(_args, withClass?): any;
//     // GC?();
// }
// declare class TiWindow extends Ti.UI.Window {
//     static prepareArgs(_args, withClass?): any;
//     winId?: any;
//     winGCId?: string;
//     // GC?();
//     akmanaged?: boolean;
//     // handleOpen?: boolean
//     // handleClose?: boolean
//     // _closing?: boolean
//     // manager?: BaseWindow
//     // winManager?: AK.IWindowManager
//     winOpeningArgs?: titanium.openWindowParams;
//     winClosingArgs?: titanium.openWindowParams;
//     toDoAfterOpening?();
// }

declare class ImageView extends Ti.UI.ImageView {
    static prepareArgs(_args, withClass?): any;
}
// declare class CollectionView extends Ti.UI.ListView {
//     static prepareArgs(_args, withClass?): any;
// } //temp needs doc on ti side for collection
// declare class ListView extends Ti.UI.ListView {
//     static prepareArgs(_args, withClass?): any;
// }
//temp needs doc on ti side for collection
declare class Button extends Ti.UI.Button {
    static prepareArgs(_args, withClass?): any;
}

declare class Label extends Ti.UI.Label {
    static prepareArgs(_args, withClass?): any;
}
declare class HTTPClient extends Ti.Network.HTTPClient {
    static prepareArgs(_args, withClass?): any;
}
// declare class Window extends TiWindow {
//     static prepareArgs(_args, withClass?): any;
// }
// declare class NavigationWindow extends Ti.UI.NavigationWindow {
//     static prepareArgs(_args, withClass?): any;
// }

declare interface TiEvent {
    [k: string]: any;
    type?: string;
    bindId?: string;
    source?: titanium.Proxy;
}
declare interface TiMediaEvent extends TiEvent {
    media: titanium.Blob;
    width: number;
    height: number;
}

declare interface TiImageEvent extends TiEvent {
    image: titanium.Blob;
}
declare type TiEventCallback = (e?: TiEvent) => any;

declare interface TiListEvent extends TiEvent {
    section: titanium.UIListSection;
    item: any;
    itemIndex: number;
    sectionIndex: number;
}
declare interface TiChangeListEvent extends TiListEvent {
    value: string;
}

declare interface TiChangeEvent extends TiEvent {
    value: string;
}
declare namespace AK {
    //     export interface IReduxFn {
    //         addNaturalConstructor(context: any, constructors: {}, arg1: string, arg2: string)
    //         style(type: any, obj?: any): any
    //         includeOverloadRJSS(...args: string[])
    //         includeRJSS(...args: string[])
    //         setDefault(selector: string, defaults, orientation?)
    //     }
    //     export interface IRedux {
    //         fn: IReduxFn
    //     }

    //     export class TiEmitter extends Emitter {
    //         addEventListener(name: string, callback: (e: TiEvent) => any): this;
    //         removeEventListener(name: string, callback: (e: TiEvent) => any): this;
    //         fireEvent(name: string, e: TiEvent): void;
    //         emit(name: string, e: TiEvent);
    //         on(name: string, callback: (e: TiEvent) => any): this;
    //         once(name: string, callback: (e: TiEvent) => any): this;
    //         off(name: string, callback: (e: TiEvent) => any): this;
    //     }

    //     export class Emitter {
    //         on(name: string, callback: (...args: any[]) => any): this;
    //         once(name: string, callback: (...args: any[]) => any): this;
    //         off(name: string, callback: (...args: any[]) => any): this;
    //         removeAllListeners(): this;
    //         emit(name: string, ...args);
    //     }
    export interface IWindowManager {
        // mainwindow: MainWindow
        androidNav?: boolean;
        // slidemenu: SlideMenu
        // topWindow: TiWindow
        handlingOpening?: boolean;
        rootWindow?: TiWindow;
        // createAndOpenWindow(_constructor: string, _args?: TiDict, _openingArgs?: TiDict, _dontCheckOpening?: boolean);
        // getWindowManager(_win);
        openWindow(_win: TiWindow, _args?: TiDict, _dontCheckOpening?: boolean);
        closeWindow(_win, _args?, _callGC?: Boolean);
        // windowSignalsOpened(_win);
        // getWindowManager(_win);
    }
}

// declare module 'akylas.commonjs/AkInclude/MicroEvent' {
//     export class TiEventEmitter extends AK.Emitter { }
// }

declare interface Error {
    toJSON(): Object;
}

declare interface ListEvent<T> {
    item: T;
    section: titanium.UIListSection;
    sectionIndex: number;
    itemIndex: number;
    editing?: boolean;
    accessoryClicked?: boolean;
    searchResult?: boolean;
    listView: titanium.UIListView;
    bindId?: string;
}

declare interface AKWindowParams extends TiPropertiesT<TiWindow> {
    topToolbar?: titanium.UIView | TiPropertiesT<titanium.UIView>;
    bottomToolbar?: titanium.UIView | TiPropertiesT<titanium.UIView>;
    loadingViewArgs?: TiDict;
    listViewArgs?: AKAppListViewParams;
}

declare interface AKAppListViewParams extends TiPropertiesT<titanium.UIListView> {}
declare interface AKCustomAlertViewParams extends TiPropertiesT<titanium.UIView> {
    cancel?: boolean;
    hideOnClick?: boolean;
    tapOutDismiss?: boolean;
    blurBackground?: boolean;
    buttonNames?: string[];
    message?: string;
    error?: string;
    textAlign?: string | number;
    image?: string;
    title?: string;
    customView?: titanium.UIView | TiPropertiesT<titanium.UIView>;
}
