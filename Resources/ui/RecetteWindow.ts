import AppWindow from './AppWindow';

import { RecetteData } from '../data/data';
import AppTabController from 'akylas.commonjs/AkInclude/ui/AppTabController';

const TitleHeaderTop = $.roomHeaderHeight - $.navBarHeight;

export interface RecetteWinParams extends AKWindowParams {
    headerViewProps?: Object;
    titleViewProps?: Object;
    // recette: RecetteData;
}
function prepareSections(recette: RecetteData, roomColor) {
    let sections = [
        {
            items: [
                // {
                //     template: 'transparentView'
                // },
                {
                    template: 'description',
                    label: {
                        html: recette.text
                    }
                }
            ]
        }
    ] as { headerView?: Object; items: Object[] }[];
    return sections;
}

export default class RecetteWindow extends AppWindow {
    headerView: titanium.UIImageView;
    subTitleView: titanium.UILabel;
    titleBackgroundView: titanium.UIView;
    titleHolder: titanium.UIView;
    closeBtnSub: titanium.UIButton;
    bottomToolbar: AppTabController;
    currentLevel = 0;
    recette: RecetteData;
    roomColor: string;
    static initArgs(_args, recette?:RecetteData) {
        if (!_args.constructorNames) {
            _args = ak.ti.redux.prepareClassArgs(_args, RecetteWindow);
        }
        // const recette = _args.recette;
        const roomColor = $.cTheme.darkest;

        function createListView(recette: RecetteData) {
            return {
                bindId: 'listView',
                type: 'Ti.UI.CollectionView',
                properties: {
                    // opacity: 0,
                    // transform: 't0,100',
                    // touchPassThrough: true,
                    // bubbleParent: true,
                    stickyHeaders: true,
                    top: $.navBarHeight,
                    // bottom: $.toolbarHeight + (app.deviceinfo.isIPhoneX ? 20 : 0),
                    templates: {
                        // transparentView: app.templates.row.fakeHeaderView,
                        description: app.templates.row.description
                    },
                    sections: prepareSections(recette, roomColor)
                }
            };
        }
        // _args.backgroundColor = '#ffffff00';
        // _args.winOpeningArgs = {
        //     animated: false
        // };
        if (__APPLE__) {
            _args.underContainerView = {
                bindId: 'underContainerView',
                // transform:'t0,-100',
                // opacity: 0,
                top: 0,
                height: $.navBarTop,
                backgroundColor: roomColor
            };
        }
        _args.containerView = {
            top: $.navBarTop,
            layout:'vertical',
            childTemplates: [
                {
                    type: 'Ti.UI.ImageView',
                    bindId: 'headerView',
                    properties: Object.assign({
                        width: '100%',
                        // transform: 't0,-' + TitleHeaderTop,
                        // top: 0,
                        // borderRadius: 0,
                        height: TitleHeaderTop,
                        image: recette.image,
                        // transitionName: 'imageView'
                    }),
                    childTemplates:[{
                        type: 'Ti.UI.Button',
                        bindId: 'closeBtn',
                        properties: {
                            rclass: 'NavBarButton',
                            height: $.nbButtonWidth,
                            color: $.white,
                            // opacity: 0,
                            top: 0,
                            left: 0,
                            title: $.sLeft
                        }
                    }]
                },
                {
                    bindId: 'title',
                    type: 'Ti.UI.Label',
                    properties: {
                        width: 'fill',
                        left: 0,
                        height: 'size',
                        minHeight:$.navBarHeight,
                        backgroundColor:roomColor,
                        font: {
                            size: 18,
                            // family: $.sFontFamilyBlack
                        },
                        color: $.white,
                        html: recette.title,
                        // opacity: 0,
                        padding:{left: 10, top:5,bottom:5},
                        // top: TitleHeaderTop
                    }
                },
                createListView(recette),
                // {
                //     backgroundColor: roomColor,
                //     bindId: 'bottomToolbar',
                //     height: 'size',
                //     // transform: 't0,100',
                //     childTemplates: [
                //         new AppTabController({
                //             labels: ['novice', 'moyen', 'expert'],
                //             bubbleParent: true,
                //             bottom: app.deviceinfo.isIPhoneX ? 20 : 0
                //         })
                //     ]
                // }
            ]
        };
        return _args;
    }
    constructor(recette:RecetteData, _args: RecetteWinParams) {
        super(RecetteWindow.initArgs(_args, recette));
        this.roomColor = $.cTheme.darkest;
        this.recette = recette;

        // this.animate({
        //     backgroundColor:'#ffffffff',
        //     duration: 800,
        //     listView: {
        //         opacity: 1,
        //         transform: null,
        //         duration: 400
        //     },
        //     underContainerView: {
        //         delay: 200,
        //         opacity: 1
        //     },
        //     headerView: {
        //         transform: null,
        //         duration: 200
        //     },
        //     title: {
        //         delay: 200,
        //         opacity: 1
        //     },
        //     closeBtn: {
        //         delay: 200,
        //         opacity: 1
        //     }
        // });
        // this.listView.on('scroll', {
        //     variables: {
        //         offset: 'contentOffset.y'
        //     },
        //     expressions: {
        //         b: 'min(max(_offset' + '/' + (TitleHeaderTop - $.navBarTop) + ', 0), 1)',
        //         c: '1-_b'
        //     },
        //     targets: [
        //         {
        //             target: this,
        //             properties: {
        //                 headerView: {
        //                     opacity: '_c'
        //                 },
        //                 titleView: {
        //                     left: '_b*40 + 10'
        //                 },
        //                 titleHolder: {
        //                     top: '_c*' + TitleHeaderTop
        //                 },
        //                 titleBackgroundView: {
        //                     backgroundColor: Color(this.roomColor)
        //                         .setAlpha(0)
        //                         .toRgbString()
        //                         .replace(/,[^,]*\)/, ', _b)')
        //                 },
        //                 subTitleView: {
        //                     left: '_b*40 + 10',
        //                     opacity: '_b'
        //                 }
        //             }
        //         }
        //     ]
        // });

        this.getTiProxy().on('click', e => {
            if (e.item) {
                const item = e.item;
            } else {
                const callbackId = e.bindId || e.source.callbackId;
                switch (callbackId) {
                    case 'closeBtn':
                    // case 'closeBtnSub':
                        this.closeMe();
                        break;
                }
            }
        });
    }
}
