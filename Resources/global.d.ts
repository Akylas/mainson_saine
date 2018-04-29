// / <reference path="/Volumes/data/dev/titanium/dist/modules/iphone/akylas.commonjs/5.0/documentation/akylas.commonjs.d.ts" />
// / <reference path="/Volumes/data/dev/titanium/dist/modules/iphone/akylas.commonjs/5.0/documentation/lodash.d.ts" />

/// <reference path="./akylas.commonjs/akylas.commonjs.d.ts" />
declare var app: IApp;
declare interface ContrastColor {
    isLight: boolean
    luminance: number
    color: string
    contrast: string
    contrastGray: string
    darkerRel: string
    lightenRel: string
    darker: string
    darkest: string
    darkestRel: string
}


declare interface ContrastColor {
    isLight: boolean
    luminance: number
    color: string
    contrast: string
    contrastGray: string
    darkerRel: string
    lightenRel: string
    darker: string
    darkest: string
    darkestRel: string
}
declare interface WindowManager extends AK.IWindowManager {
    mainwindow: TiWindow
    topWindow: TiWindow
    rootWindow: TiWindow
    windowSignalsOpened(_win);
    getWindowManager(_win);

}

declare interface WindowParams extends AKWindowParams {
}

declare class ScrollView extends Ti.UI.ScrollView {
    static prepareArgs(_args, withClass?): any;
} 