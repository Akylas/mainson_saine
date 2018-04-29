import * as processModule from 'process';
process = processModule;

if (Ti.App.deployType !== 'production') {
    // Buffer = require('buffer');
    require('source-map-support').install({ environment: 'node' });
    const osname = Ti.Platform.osname;
    if (osname === 'ipad' || osname === 'iphone') {
        console.debug('setPrepareError');
        Ti.setPrepareError(require('sourcemap/prepareStackTrace'));
    }
}

import { loadAk } from 'akylas.commonjs/akylas.commonjs';
loadAk(this, {
    modules: ['ti', 'lang'],
    redux: {
        types: [
            'Ti.UI.SearchBar', //fix for ios for now
            'Ti.UI.Button',
            'Ti.UI.ImageView',
            'Ti.UI.Label',
            'Ti.UI.ScrollView'
        ]
    }
});

import * as lodashModule from 'lodash';
import * as momentModule from 'moment';
_ = lodashModule;
moment = momentModule;
_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
import * as lodashMixins from 'akylas.commonjs/lodashMixins';
lodashMixins.load();
declare global {
    var moment: typeof momentModule;
    var _: typeof lodashModule | typeof lodashModule & lodashMixins.LodashMixins;
    // var Color: Color;
}

import Logger from './logger';
const logger = new Logger('maisonsaine');
// logger.overloadConsole();
import AkApp from 'akylas.commonjs/AkInclude/App';
import * as Color from 'tinycolor2';
import * as Utils from './utils';

export function getContrastColors(_color): ContrastColor {
    let color: tinycolorInstance = Color(_color);
    //light means dark content and thus white contrast
    // console.log('getContrastColors', _color, color.getBrightness())
    var light = color.getBrightness() < 190;

    var color1 = Color(light ? '#fff' : '#222');
    var method = light ? 'darken' : 'lighten';
    var result = {
        isLight: light,
        luminance: color.getLuminance(),
        color: color.toHexString(),
        contrast: color1.toHexString(),
        contrastGray: color1
            .clone()
            [method].apply(color1, [0.2])
            .toHexString(),
        darkerRel: color
            .clone()
            [method].apply(color, [0.2])
            .toHexString(),
        lightenRel: color
            .clone()
            [method].apply(color, [-0.2])
            .toHexString(),
        darker: color
            .clone()
            .darken(8)
            .toHexString(),
        darkest: color
            .clone()
            .darken(20)
            .toHexString(),
        darkestRel: color[method].apply(color, [20]).toHexString()
    };
    return result;
}

// var clearMessageTimer;

// function clearMessage() {
//     Ti.Android.NotificationManager.cancel(1);
// }
// function errorToJSON(err) {
//     return Object.getOwnPropertyNames(err).map(key => err[key]);
// }

export function showMessage(_text, _colors?) {
    let args: any = {
        text: _text
    };
    if (_colors && _colors.color) {
        args.backgroundColor = _colors.color;
        args.color = _colors.contrast;
    } else {
        args.backgroundColor = _colors || $.cTheme.color;
    }
    if (__APPLE__) {
        app.modules.statusbarnotification.showMessage(args);
    } else {
        Ti.UI.showSnackbar(
            _.assign(args, {
                duration: 2000,
                gravity: 48
            })
        );
    }
}
import RowTemplates from './templates/row';
// import ViewTemplates from './templates/view';
declare global {
    interface IApp extends App {}
}
export class App extends AkApp {
    templates: {
        row: RowTemplates;
        // view: ViewTemplates;
    };
    constructor(context) {
        super(context, {
            modules: {
                zoomableimage: 'akylas.zoomableimage'
            },
            defaultLanguage: 'en',
            forceLanguage: Ti.App.Properties.getString('language'),
            // templatesPreRjss: ['text'],
            // templates: ['row', 'view'],
            ifApple: function(app) {
                // app.modules.statusbarnotification = require('akylas.statusbarnotification');
            },
            windowManager: {
                // androidNav: true
            }
        });

        // this needs to done after because it expects app to exist...
        // this.btHandler = new BTHandler(this.modules.bluetooth, this)
    }
    loadVariables() {
        require('$variables');
    }

    showLoading(args?) {}
    hideLoading(args?) {}
    errorToString(error) {
        try {
            let errorMessage;
            if (_.isString(error)) {
                errorMessage = error;
            } else {
                // if (!!error.isCustomError) {
                //     error = neosmia.customErrorFromObj(error);
                //     errorMessage = trc(error.message, error.localData());
                // } else {
                errorMessage = error.message || error.error;
                // }
            }
            return errorMessage;
        } catch (err) {
            console.log('errorToString error', err);
        }
    }
    showMessage = showMessage;
    colors = {
        red: getContrastColors('red'),
        green: getContrastColors('green'),
        blue: getContrastColors('blue')
    };
    setImmersive() {
        app.ui.topWindow.uiVisibilityFlags =
            0x00000100 | //View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            0x00000200 | //View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            0x00000400 | //View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            0x00000002 | //View.SYSTEM_UI_FLAG_HIDE_NAVIGATION // hide nav bar
            0x00000004 | //View.SYSTEM_UI_FLAG_FULLSCREEN // hide status bar
            0x00000800; //View.SYSTEM_UI_FLAG_IMMERSIVE
    }
    sendBugReport = (e?: { error: Error & { shouldReport?: boolean } }) => {
        if (e && !__SIMULATOR__ && (__DEVELOPMENT__ || (e.error && (!e.error.stack || (e.error.stack && e.error.stack.indexOf('\n') == -1) || e.error.shouldReport === false)))) {
            return;
        }
        return;
        // console.log("sendBugReport", e);

        // return new Promise(function() {
        //     const userProfile = api.getCurrentProfile();
        //     const data: any = {
        //         os: app.deviceinfo,
        //         app: app.info,
        //     };
        //     if (e && e.error) {
        //         delete e.error["source"];
        //         data.error = e.error.toJSON ? e.error.toJSON() : e.error;
        //     }
        //     return Promise.all([
        //         new Promise(function(resolve) {
        //             Ti.Media.takeScreenshot(function(e) {
        //                 resolve({ name: "screenshot.png", content: e.image });
        //             });
        //         }),
        //         new Promise(function(resolve) {
        //             resolve({ name: "reportdata.json", content: Ti.createBlob({ mimetype: "application/text", value: JSON.stringify(data, null, 4) }) });
        //         }),
        //         new Promise(function(resolve) {
        //             const Compression = require("ti.compression");
        //             var writeToZip = Ti.Filesystem.tempDirectory + "/neose_log.zip";
        //             const result = Compression.zip(writeToZip, [logger.getLogfilePath()]);
        //             if (result === "success") {
        //                 resolve({ name: "log.zip", content: Ti.Filesystem.getFile(writeToZip) });
        //             }
        //         })
        //     ] as Promise<any>[]).then((result: { name: string; content: titanium.Blob }[]) => {
        //         let postData = {
        //             from: userProfile ? userProfile.email : "bugreports@aryballe.com",
        //             to: "bugreports@aryballe.com",
        //             subject: `[BUG_REPORT][${data.os.name}][${data.app.name}][${data.app.version}]`,
        //             html: util.inspect(data, { showHidden: false, depth: 10, colors: true })
        //         };
        //         result.forEach(r => (postData[r.name] = r.content));
        //         app.api.sendBugReport(postData, { json: false }).then(() => showMessage(trc("report_sent")));
        //     });
        // }).catch(err => {
        //     logger.error("error sending report", app.errorToString(err));
        // });
    };
    getContrastColors = getContrastColors;
    ui: WindowManager;
    localeInfo = ak.getLocaleInfo();

    // getImage(path: string) {
    //     return new Promise(function(resolve, reject) {
    //         Ti.Network.createHTTPClient({
    //             timeout: 10000,
    //             onload: function() {
    //                 resolve(this.responseData);
    //             },
    //             onerror: (e) => {
    //                 reject(e.error);
    //             }
    //         })
    //             .open('GET', path)
    //             .send();
    //     });
    // }
    // getBluredScreenshot(_args?) {
    //     return Ti.Image.getFilteredScreenshot(
    //         _.merge(
    //             {
    //                 scale: 0.4,
    //                 filters: [
    //                     {
    //                         radius: 2,
    //                         type: Ti.Image.FILTER_IOS_BLUR
    //                     }
    //                 ],
    //                 tint: '#44000000',
    //                 blend: Ti.UI.BlendMode.DARKEN
    //             },
    //             _args
    //         )
    //     );
    // }

    showImageFullscreen(_photos, _index?, _fromView?) {
        app.ui.openWindow(
            new FullscreenImageWindow({
                photos: _photos,
                photoIndex: _index,
                fromView: _fromView
            })
        );
        // app.ui.createAndOpenWindow('FullscreenImageWindow', {
        //     photos: _photos,
        //     photoIndex: _index,
        //     fromView: _fromView
        // });
    }

    // showViewFullScreen(_view, _fromView) {
    //     var originalWidth = _view.width || 'FILL';
    //     var originalHeight = _view.height || 'FILL';
    //     var originalLeft = _view.left || null;
    //     var originalTop = _view.top || null;
    //     var sourceRect = _fromView.absoluteRect;
    //     var backView = new View({
    //         opacity: 0,
    //         backgroundImage: this.getBluredScreenshot()
    //     });
    //     var win = new AppWindow({
    //         underContainerView: backView,
    //         verticalContainer: false,
    //         centerContainerView: _view
    //     }).on('click', function() {
    //         win.closeMe();
    //     });
    //     var startRect = {
    //         opacity: 0,
    //         left: sourceRect.x,
    //         top: sourceRect.y + $.navBarTop,
    //         width: sourceRect.width,
    //         height: sourceRect.height
    //     };
    //     _view.applyProperties(startRect);
    //     win.closeMe = function() {
    //         backView.animate({
    //             opacity: 0,
    //             duration: 200
    //         });
    //         _view.animate(
    //             _.assign(startRect, {
    //                 duration: 200
    //             }),
    //             function() {
    //                 app.ui.closeWindow(win);
    //                 win = null;
    //                 backView = null;
    //             }
    //         );
    //     };
    //     win.toDoAfterOpening = function() {
    //         backView.animate({
    //             opacity: 1,
    //             duration: 200
    //         });
    //         _view.animate({
    //             opacity: 1,
    //             left: originalLeft,
    //             top: originalTop,
    //             width: originalWidth,
    //             height: originalHeight,
    //             duration: 200
    //         });
    //     };
    //     this.ui.openWindow(win);
    // }
}
app = new App(this);


function errorHandler(e: {
    silent?: boolean;
    error?: Error & {
        silent?: boolean;
        longStack?: string;
        nativeLocation?: string;
    };
}) {
    const err = e.error;
    if (!err) {
        return;
    }
    const isRealError = Utils.isActualError(err);
    Utils.dumpError(err, trc);
    if (err.stack || err.longStack || err.nativeLocation) {
        console.log('throwing error so that it shows in Ti');
        // app.sendBugReport({ error: e.error });
        setTimeout(() => {
            throw err;
        }, 0);
        return;
    }
    let errorMessage = app.errorToString(err);
    if (!e.silent || !err.silent) {
        app.confirmAction(
            {
                title: trc('error'),
                message: errorMessage,
                cancel: 0,
                tapOutDismiss: !isRealError,
                // hideOnClick: !isRealError,
                buttonNames: isRealError && [trc('done'), trc('send_bug_report')]
            },
            function(e) {
                console.debug('confirmError', e);
                if (!e.cancel) {
                    app.sendBugReport({ error: err });
                }
            }
        );
    } else {
        showMessage(errorMessage, app.colors.red.color);
    }
}
app.on('error', errorHandler);

// send when Ti shows the error dialog. There we can send to api
Ti.App.on('uncaughtException', function(error) {
    app.sendBugReport({ error: error });
});

// Unhandled promise rejection, let's emit the error so that it's handled
process.on('unhandledRejection', (reason, promise) => {
    app.emit('error', { error: reason, silent: true });
});

// ak.locale.storeMissingTranslations = true;
app.main();

app.templates = {
    row: new RowTemplates()
    // view: new ViewTemplates()
};
//we cant import before Ti constructors are loaded
import MainWindow from './ui/MainWindow';
import AppWindow from './ui/AppWindow';
import FullscreenImageWindow from './ui/FullscreenImageWindow';
import RecettesWindow from 'ui/RecettesWindow';
import RoomWindow from 'ui/RoomWindow';

const oldShowAlert = app.showAlert;
app.showAlert = (_args: any, onClick) => {
    if (_.isString(_args)) {
        _args = {
            message: _args,
            constructorName: 'CustomAlertView'
        };
    }
    _args.constructorName = 'CustomAlertView';
    oldShowAlert(_args, onClick);
};
var oldFunc = app.confirmAction;
app.confirmAction = function(_args, _c1, _c2) {
    _args.constructorName = 'CustomAlertView';
    return oldFunc.apply(this, [_args, _c1, _c2]);
};
const win = app.ui.rootWindow = app.ui.topWindow = app.ui.mainwindow = new MainWindow({
    exitOnClose: true
});

// console.debug('test3333', win, win.constructor, win.__proto__);

app.ui.openWindow(win);



// let testWin = new RoomWindow(require('./data/data').rooms[0], {
//     properties:{
//         backgroundColor:'blue'
//     },
//     events:{
//         click:function(e){tiwin.close(); tiwin = null}
//     }
// });
// let tiwin = testWin.tiProxy;
// tiwin.on('close', function() {
//     testWin.clearProxy();
//     testWin = null;
// })
// tiwin.open()
// Ti.UI.createWindow({
//     properties:{
//         backgroundColor:'blue'
//     },
//     events:{
//         click:function(e){e.source.close()}
//     }
// }).open()

// app.ui.mainwindow.once("open", function() {
// app.geoUpdater.start();
// app.geoUpdater.update();
// });

// Ti.Network.on("change", () => {
//     console.debug("detected network change", Ti.Network.online);
// });

// app.api.updateNetwork();

Ti.App.on('close', function() {
    console.log('app closing');
});

logger.debug('info', app.info);
logger.debug('deviceinfo', app.deviceinfo);
