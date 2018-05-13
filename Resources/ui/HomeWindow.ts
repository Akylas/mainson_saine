import AppWindow from './AppWindow';

import * as Color from 'tinycolor2';

import * as data from '../data/data';
import RoomWindow, { RoomWinParams } from './RoomWindow';
import RecettesWindow, { RecetteWinParams } from './RecettesWindow';

function absRectToPos(rect) {
    rect.top = rect.y;
    rect.left = rect.x;
    delete rect.x;
    delete rect.y;
    return rect;
}

const headerHeight = app.deviceinfo.width;

// function showAlertWithStyle() {
//     var UIAlertController = require('UIKit/UIAlertController'),
//         UIAlertAction = require('UIKit/UIAlertAction'),
//         UIAlertControllerStyleAlert = require('UIKit').UIAlertControllerStyleAlert,
//         UIAlertControllerStyleActionSheet = require('UIKit').UIAlertControllerStyleActionSheet,
//         UIAlertActionStyleDefault = require('UIKit').UIAlertActionStyleDefault,
//         UIAlertActionStyleDestructive = require('UIKit').UIAlertActionStyleDestructive,
//         UIAlertActionStyleCancel = require('UIKit').UIAlertActionStyleCancel,
//         TiApp = require('Titanium/TiApp');
//     var alertController = UIAlertController.alertControllerWithTitleMessagePreferredStyle('My Title', 'My Message', UIAlertControllerStyleAlert);

//     var alertAction = UIAlertAction.actionWithTitleStyleHandler('OK', UIAlertActionStyleDefault, function() {
//         // $.notice.setText('Clicked OK!');
//     });

//     var cancelAction = UIAlertAction.actionWithTitleStyleHandler('Cancel', UIAlertActionStyleCancel, function() {
//         // $.notice.setText('Clicked Cancel!');
//     });

//     var destructiveAction = UIAlertAction.actionWithTitleStyleHandler('Delete', UIAlertActionStyleDestructive, function() {
//         // $.notice.setText('Clicked Delete!');
//     });

//     alertController.addAction(alertAction);
//     alertController.addAction(destructiveAction);
//     alertController.addAction(cancelAction);

//     TiApp.app().showModalController(alertController, true);
// }
export default class HomeWindow extends AppWindow {
    get headerView() {
        return this.getBind<titanium.UIView>('headerView');
    }
    get headerImageView() {
        return this.getBind<titanium.UIImageView>('headerImageView');
    }
    get clouds2() {
        return this.getBind<titanium.UIImageView>('clouds2');
    }
    get clouds() {
        return this.getBind<titanium.UIImageView>('clouds');
    }
    // defaultImageView = new ImageView({
    //     width: 'fill',
    //     height: 'fill',
    //     backgroundColor:'yellow',
    //     touchEnabled:false,
    //     image: 'images/house.png'
    // });
    // helpImageView = new ImageView({
    //     width: 'fill',
    //     height: 'fill',
    //     touchEnabled:false,
    //     image: 'images/house3.png',
    //     backgroundColor:'red',
    //     childTemplates: [
    //         {
    //             type: 'Ti.UI.Label',
    //             height: '57%',
    //             width: '57%',
    //             bottom: '13%',
    //             font: { family: $.sFontFamilyBlack, size: Math.floor(headerHeight / 24.61) },
    //             textAlign: 'center',
    //             html: `<font color="#FA8CA7">${'Vous trouverez ici tous les conseils pour préparer et garder une maison saine lors de l’arrivée de bébé.'.toUpperCase()}</font><br/>${'Vous pouvez visualiser les conseils par pièce de la maison et par facilité de mise en pratique.'.toUpperCase()}`
    //         }
    //     ]
    // });
    helpVisible = false;
    // headerView = new ImageView({
    //     width: '100%',
    //     top: 0,
    //     sizeRatio: 1,
    //     backgroundColor: $.cTheme.color,
    //     image: 'images/house.png'
    // });
    static initArgs(_args) {
        if (!_args.constructorNames) {
            _args = ak.ti.redux.prepareClassArgs(_args, HomeWindow);
        }
        _args.containerView = {
            top: $.navBarTop,
            childTemplates: [
                {
                    // type: 'Ti.UI.ImageView',
                    bindId: 'headerView',
                    properties: {
                        width: '100%',
                        height: headerHeight,
                        top: 0,
                        backgroundColor: $.cTheme.color
                    },
                    childTemplates: [
                        {
                            bindId: 'clouds2',
                            type: 'Ti.UI.ImageView',
                            properties: {
                                left: -260,
                                // backgroundColor: 'green',
                                width: 'size',
                                height: 'size',
                                touchEnabled: false,
                                top: 20,
                                image: 'images/clouds.png'
                            }
                        },
                        {
                            bindId: 'headerImageView',
                            type: 'Ti.UI.ImageView',
                            properties: {
                                width: 'fill',
                                height: 'fill',
                                image: 'images/house.png',
                                onlyTransitionIfRemote: false
                            }
                            // childTemplates: [
                            //     {
                            //         backgroundColor: 'red',
                            //         backgroundOpacity: 0.3,
                            //         touchEnabled:false,
                            //         top: '21%',
                            //         left: '10%',
                            //         width: '22%',
                            //         height: '33%'
                            //     },
                            //     {
                            //         touchEnabled:false,
                            //         backgroundColor: 'green',
                            //         backgroundOpacity: 0.3,
                            //         top: '53%',
                            //         left: '10%',
                            //         width: '15%',
                            //         bottom: '19%'
                            //     },
                            //     {
                            //         touchEnabled:false,
                            //         backgroundColor: 'yellow',
                            //         backgroundOpacity: 0.3,
                            //         top: '30%',
                            //         left: '31%',
                            //         right: '10%',
                            //         height: '32%'
                            //     },
                            //     {
                            //         backgroundColor: 'blue',
                            //         touchEnabled:false,
                            //         backgroundOpacity: 0.3,
                            //         left: '24%',
                            //         right: '10%',
                            //         bottom: '7%',
                            //         height: '32%'
                            //     }
                            // ]
                        },
                        {
                            bindId: 'clouds',
                            type: 'Ti.UI.ImageView',
                            properties: {
                                left: -110,
                                width: 'size',
                                height: 'size',
                                touchEnabled: false,
                                top: 10,
                                image: 'images/cloud1.png'
                            }
                        },
                        {
                            type: 'Ti.UI.Button',
                            bindId: 'helpBtn',
                            properties: {
                                rclass: 'NavBarButton',
                                top: 0,
                                right: 0,
                                title: '\ue88f'
                            }
                        }
                    ]
                },
                {
                    bindId: 'listView',
                    // type: 'Ti.UI.CollectionView',
                    type: 'Ti.UI.CollectionView',
                    childTemplates: [
                        {
                            top: 0,
                            height: 20,
                            touchEnabled: false,
                            backgroundGradient: {
                                type: 'linear',
                                colors: [
                                    Color($.cTheme.color)
                                        .setAlpha(1)
                                        .toHex8String(),
                                    Color($.cTheme.color)
                                        .setAlpha(0)
                                        .toHex8String()
                                ],
                                startPoint: {
                                    x: 0,
                                    y: 0
                                },
                                endPoint: {
                                    x: 0,
                                    y: '100%'
                                }
                            }
                        }
                    ],
                    properties: {
                        // touchPassThrough: true,
                        backgroundColor: Color($.white)
                            .setAlpha(0.5)
                            .toHex8String(),
                        stickyHeaders: false,
                        top: headerHeight - 20,

                        templates: {
                            default: app.templates.row.home
                        },
                        defaultItemTemplate: 'default',

                        sections: [
                            {
                                items: [
                                    {
                                        properties: {
                                            height: 20
                                        }
                                    }
                                ]
                            },
                            {
                                //     items:[{
                                //         template:'transparentView',
                                //         properties:{
                                //             height: headerHeight
                                //         }
                                //     }]
                                // },
                                //     {
                                items: data.rooms.map(room => {
                                    const roomColor = Color(room.color)
                                        .darken(30)
                                        .toHexString();
                                    return {
                                        roomId: room.title,
                                        room: room,
                                        roomColor: roomColor,
                                        properties: {
                                            selector: room.color,
                                            backgroundSelectedColor: __APPLE__ ? room.color : undefined
                                        },
                                        title: {
                                            text: room.title.toUpperCase(),
                                            color: roomColor
                                        },
                                        image: {
                                            // image: room.thumbnail.replace('banner_', '')
                                            image: room.thumbnail
                                        }
                                    };
                                })
                            },
                            {
                                items: [
                                    {
                                        id: 'recettes',
                                        icon: {
                                            visible: true,
                                            text: '\ue56c'
                                        },
                                        title: {
                                            text: 'RECETTES'
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                }
            ]
        };
        return _args;
    }
    constructor(_args) {
        super(HomeWindow.initArgs(_args));
        // (this.headerView as View).add(this.defaultImageView, 1);
        // this.listView.on('scroll', {
        //     variables: {
        //         offset: 'contentOffset.y'
        //     },
        //     // expressions: {
        //     // a: 'max(_offset/2,0)',
        //     // b: 'max(_offset/200*30,0)'
        //     // },
        //     targets: [
        //         {
        //             target: this.headerView,
        //             properties: {
        //                 // transform: 't0,_a',
        //                 opacity: '1-_offset/200'
        //             }
        //         }
        //     ]
        // });
        // this.setColors('blue');
        // (this.getTiProxy().getRProxy() as this).setColors('red');

        let isFocused = false;
        var startAnimation = () => {
            this.clouds.animate({
                transform: 't' + (headerHeight + 110) + ',0',
                dontApplyOnFinish: true,
                repeat: Ti.UI.INFINITE,
                duration: 23000
            });
            this.clouds2.animate({
                transform: 't' + (headerHeight + 260) + ',0',
                dontApplyOnFinish: true,
                repeat: Ti.UI.INFINITE,
                duration: 30000
            });
        };
        var stopAnimation = () => {
            this.clouds.cancelAllAnimations();
            this.clouds2.cancelAllAnimations();
        };

        // Ti.App.on('pause', () => {
        //     console.log('pause');
        //     stopAnimation();
        // }).on('resume', () => {
        //     console.log('resume', isFocused);
        //     if (isFocused) {
        //         startAnimation();
        //     }
        // });

        this.getTiProxy().on('focus', () => {
            // console.debug('MainWindow', 'focus');
            if (!isFocused) {
                isFocused = true;
                startAnimation();
            }
        })
            .on('blur', () => {
                // console.debug('MainWindow', 'blur');
                if (isFocused) {
                    isFocused = false;
                    setTimeout(stopAnimation, 100);
                }
            })
            .on('click', e => {
                // console.log('on click', e);
                if (e.item) {
                    const item = e.item;
                    if (item.id) {
                        switch (item.id) {
                            case 'recettes':
                                this.manager.navOpenWindow(new RecettesWindow(_.flatten(data.rooms.map(room => _.flatten(room.data.sections.map(s => s.recettes)))).filter(r => !!r), {}));
                                break;
                        }
                        return;
                    }
                    const room = item.room;
                    const imageView = e.source.image;
                    const titleView = e.source.title;
                    let winArgs: any = {
                        // headerViewProps: {
                        // scaleType: imageView.scaleType
                        // },
                        // titleViewProps: {
                        // font: titleView.font,
                        // text: item.title.text
                        // color: item.title.color
                        // }
                    };
                    let winOpeningArgs: any = {};
                    if (__APPLE__) {
                        let imageOrigin = absRectToPos(imageView.absoluteRect);
                        let titleOrigin = absRectToPos(titleView.absoluteRect);
                        winOpeningArgs.transition = {
                            from: {
                                headerView: Object.assign(imageOrigin, {
                                    borderRadius: imageView.borderRadius
                                }),
                                titleHolder: titleOrigin,
                                backgroundColor: Color(winArgs.backgroundColor)
                                    .setAlpha(0)
                                    .toHex8String(),
                                duration: 300
                            }
                        };
                    } else {
                        winOpeningArgs.sharedElements = {
                            imageView: imageView,
                            titleView: titleView
                        };
                    }
                    this.showRoom(item.room, winArgs, winOpeningArgs);

                    // const win = new RoomWindow(winArgs);
                    // console.log('showing room window', winArgs, winOpeningArgs);
                    // this.manager.navOpenWindow(win, winOpeningArgs);
                } else {
                    const callbackId = e.bindId || e.source.callbackId;
                    // console.log('on click', callbackId);
                    switch (callbackId) {
                        case 'helpBtn':
                            this.showHideHelp();
                            break;
                        case 'headerImageView':
                            if (this.helpVisible) {
                                return;
                            }
                            const x = e.x;
                            const xRatio = x / headerHeight;
                            const y = e.y;
                            const yRatio = y / headerHeight;
                            // console.log('on click headerImageView', x, y, xRatio, yRatio);
                            if (xRatio > 0.1 && xRatio < 0.32 && yRatio > 0.21 && yRatio < 0.54) {
                                this.showRoom('salle de bain - côté maman');
                            } else if (xRatio > 0.1 && xRatio < 0.25 && yRatio > 0.53 && yRatio < 0.81) {
                                this.showRoom('buanderie');
                            } else if (xRatio > 0.31 && xRatio < 0.9 && yRatio > 0.3 && yRatio < 0.63) {
                                this.showRoom('chambre de bébé');
                            } else if (xRatio > 0.24 && xRatio < 0.9 && yRatio > 0.61 && yRatio < 0.93) {
                                this.showRoom('cuisine');
                            }
                            break;
                    }
                }
            });
        // showAlertWithStyle(UIAlertControllerStyleAlert);
    }
    showRoom = (room, addWinArgs?, addOpenArgs?) => {
        // console.log('showRoom', room, addWinArgs, addOpenArgs);
        if (typeof room === 'string') {
            room = data.rooms.find(r => r.title === room);
        }
        // const room = data.rooms[roomId];
        const roomColor = Color(room.color)
            .darken(30)
            .toHexString();
        let winArgs: RoomWinParams = _.merge(
            {
                // room: room,
                roomColor: roomColor,
                headerViewProps: {
                    image: room.thumbnail
                },
                titleViewProps: {
                    text: room.title.toUpperCase()
                }
            },
            addWinArgs
        );
        let winOpeningArgs = addOpenArgs;

        const win = new RoomWindow(room, winArgs);
        if (addOpenArgs && addOpenArgs.sharedElements) {
            // console.log('sharedElements', addOpenArgs.sharedElements);
            for (let key in addOpenArgs.sharedElements) {
                // console.log('addSharedElement', key, addOpenArgs.sharedElements[key]);
                win.getTiProxy().addSharedElement(addOpenArgs.sharedElements[key], key);
            }
            delete addOpenArgs.sharedElements;
        }

        // console.log('showing room window', winArgs, winOpeningArgs);
        this.manager.navOpenWindow(win, winOpeningArgs);
    };
    showHideHelp = () => {
        this.headerImageView.applyProperties({
            transition: {
                style: Ti.UI.TransitionStyle.BACK_FADE
            },
            image: this.helpVisible ? 'images/house.png' : 'images/house_help.png'
        });
        this.helpVisible = !this.helpVisible;
    };
}
