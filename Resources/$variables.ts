const BarHeight = Ti.App.defaultNavBarHeight;
const deviceHeight = app.deviceinfo.height;
class Variables {
    constructor() {
        // this.cText = this.white;
        // this.cMenuBack = this.cBackground;
    }
    // muiTFHeight: number
    // muiTFGray: string
    navBarHeight = BarHeight;
    width = app.deviceinfo.width;
    height = app.deviceinfo.height;
    // navBarTop = (app.deviceinfo.isAndroid && app.deviceinfo.SDKVersion < 19) ? 0 : Ti.App.defaultStatusBarHeight
    navBarTop = app.deviceinfo.isAndroid ? 0 : Ti.App.defaultStatusBarHeight;
    iconicfontfamily = 'material';
    cTheme = app.getContrastColors('#D1EDF7');
    // cBackground = '#fff'
    cBackground = '#D1EDF7';
    // cMenuBack: string
    black = '#010101';
    white = '#fff';
    gray = '#888';

    sMenu = '\ue5d2';
    sClose = '\ue5cd';
    sLeft = '\ue5c4'; //arrow_back

    nbButtonWidth = BarHeight;
    toolbarHeight = BarHeight;

    sFontFamily = __APPLE__ ? 'Nunito-Regular' : 'nunito-regular';
    sFontFamilyBold = __APPLE__ ? 'Nunito-Bold' : 'nunito-bold';
    sFontFamilyBlack = __APPLE__ ? 'Nunito-Black' : 'nunito-black';
    roomHeaderHeight = deviceHeight * 0.25 + BarHeight;
    deviceHeight = deviceHeight;
}

declare var $: Variables;
$ = new Variables();
