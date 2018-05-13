import AppWindow from './AppWindow';

import { RoomData, RoomDataData } from '../data/data';
import AppTabController from 'akylas.commonjs/AkInclude/ui/AppTabController';

import * as Color from 'tinycolor2';

const TitleHeaderTop = $.roomHeaderHeight - $.navBarHeight;

const LEVEL_ICON = {
    1: '\ue400',
    2: '\ue401',
    3: '\ue3fb',
    4: '\ue3fd',
    5: '\ue3fe',
    6: '\ue3ff'
};

export interface RoomWinParams extends AKWindowParams {
    headerViewProps?: Object;
    titleViewProps?: Object;
    // room: RoomData;
    roomColor: string;
}

function prepareSections(data: RoomDataData, roomColor) {
    let sections = [
        {
            items: [
                {
                    template: 'transparentView'
                },
                {
                    template: 'description',
                    label: {
                        visible: !!data.description,
                        html: data.description
                    }
                }
            ]
        }
    ] as { headerView?: Object; items: Object[] }[];
    data.sections.forEach(s => {
        let items = [];

        if (s.description) {
            items.push({
                template: 'description',
                label: {
                    html: s.description
                }
            });
        }
        items.push(createLevelItem(s.levels, 0, roomColor));
        sections.push({
            headerView: {
                template: 'header',
                label: {
                    color: roomColor,
                    borderColor: roomColor,
                    html: s.title || ''
                }
            },
            items: items
        });
    });
    return sections;
}
function createLevelItem(levels, level, roomColor) {
    if (levels[level]) {
        let l = levels[level];
        return {
            template: 'level',
            // hidden: i > 0,
            level: {
                color: roomColor,
                text: LEVEL_ICON[level + 1]
            },
            label: {
                html: l.text
            },
            image: {
                visible: !!l.image,
                image: l.image
            }
        };
    }
}
export default class RoomWindow extends AppWindow {
    get headerView() {
        return this.getBind<titanium.UIImageView>('headerView');
    }
    get subTitleView() {
        return this.getBind<titanium.UILabel>('subTitleView');
    }
    get titleBackgroundView() {
        return this.getBind<titanium.UIView>('titleBackgroundView');
    }
    get titleHolder() {
        return this.getBind<titanium.UIView>('titleHolder');
    }
    get closeBtnSub() {
        return this.getBind<titanium.UIButton>('closeBtnSub');
    }
    get listView() {
        return this.getBind<titanium.UIListView>('listView');
    }
    get bottomToolbar() {
        return this.getBind<titanium.UIView>('bottomToolbar');
    }
    currentLevel = 0;
    roomData: RoomData;
    roomColor: string;
    static initArgs(_args, room?: RoomData) {
        if (!_args.constructorNames) {
            _args = ak.ti.redux.prepareClassArgs(_args, RoomWindow);
        }
        const roomColor = Color(room.color)
            .darken(30)
            .toHexString();
        _args.statusBarColor = roomColor;

        function createListView(roomData: RoomDataData) {
            return {
                bindId: 'listView',
                type: 'Ti.UI.CollectionView',
                properties: {
                    opacity: 0,
                    transform: 't0,100',
                    stickyHeaders: true,
                    top: $.navBarHeight,
                    bottom: $.toolbarHeight + (app.deviceinfo.isIPhoneX ? 20 : 0),
                    templates: {
                        transparentView: app.templates.row.fakeHeaderView,
                        header: app.templates.row.header,
                        description: app.templates.row.description,
                        level: app.templates.row.level
                    },
                    sections: prepareSections(roomData, roomColor)
                }
            };
        }

        if (__APPLE__) {
            _args.underContainerView = {
                bindId: 'underContainerView',
                opacity: 0,
                top: 0,
                height: $.navBarTop,
                backgroundColor: roomColor
            };
        }
        // console.log('test', $.sFontFamilyBlack);
        _args.containerView = {
            top: $.navBarTop,
            childTemplates: [
                {
                    type: 'Ti.UI.ImageView',
                    bindId: 'headerView',
                    properties: Object.assign(
                        {
                            scaleType: Ti.UI.SCALE_TYPE_ASPECT_FILL,
                            width: '100%',
                            top: 0,
                            borderRadius: 0,
                            height: TitleHeaderTop,
                            transitionName: 'imageView'
                        },
                        _args.headerViewProps
                    )
                },
                {
                    bindId: 'titleHolder',
                    properties: {
                        width: 'fill',
                        left: 0,
                        height: $.navBarHeight,
                        top: TitleHeaderTop
                    },
                    childTemplates: [
                        {
                            bindId: 'titleBackgroundView'
                        },
                        {
                            type: 'Ti.UI.Label',
                            bindId: 'titleView',
                            properties: Object.assign(
                                {
                                    width: 'fill',
                                    height: 'fill',
                                    left: 10,
                                    transitionName: 'titleView',
                                    color: roomColor,
                                    font: {
                                        size: 18,
                                        family: $.sFontFamilyBlack
                                    }
                                },
                                _args.titleViewProps
                            )
                        },
                        {
                            bindId: 'subTitleView',
                            type: 'Ti.UI.Label',
                            properties: Object.assign(
                                {
                                    width: 'fill',
                                    height: 'fill',
                                    opacity: 0,
                                    left: 10,
                                    font: {
                                        size: 18,
                                        family: $.sFontFamilyBlack
                                    }
                                },
                                _args.titleViewProps,
                                {
                                    color: $.white
                                }
                            )
                        }
                    ]
                },
                {
                    type: __APPLE__ ? 'Ti.UI.Button' : 'Ti.UI.Label',
                    bindId: 'closeBtn',
                    properties: {
                        rclass: 'NavBarButton',
                        height: $.nbButtonWidth,
                        color: roomColor,
                        opacity: 0,
                        top: 0,
                        left: 0,
                        text: $.sLeft
                    },
                    childTemplates: [
                        {
                            type: __APPLE__ ? 'Ti.UI.Button' : 'Ti.UI.Label',
                            bindId: 'closeBtnSub',
                            properties: {
                                rclass: 'NavBarButton',
                                width: 'fill',
                                height: 'fill',
                                color: $.white,
                                opacity: 0,
                                text: $.sLeft
                            }
                        }
                    ]
                },
                createListView(room.data),
                {
                    backgroundColor: roomColor,
                    bindId: 'bottomToolbar',
                    height: 'size',
                    transform: 't0,100',
                    bottom: 0,
                    childTemplates: [
                        new AppTabController({
                            labels: ['novice', 'moyen', 'expert'],
                            bubbleParent: true,
                            bottom: app.deviceinfo.isIPhoneX ? 20 : 0
                        }).getTiProxy()
                    ]
                }
            ]
        };
        return _args;
    }
    constructor(room: RoomData, _args: RoomWinParams) {
        super(RoomWindow.initArgs(_args, room));
        this.roomData = room;
        this.roomColor = _args.roomColor;
        this.getTiProxy().animate({
            listView: {
                delay: 200,
                opacity: 1,
                transform: null,
                duration: 200
            },
            bottomToolbar: {
                delay: 200,
                transform: null,
                duration: 200
            },
            underContainerView: {
                delay: 200,
                opacity: 1
            },
            closeBtn: {
                delay: 200,
                opacity: 1
            },
            duration: 400
        });
        this.listView.on('scroll', e => {
            const offset = e.contentOffset.y;
            // if (offset <= TitleHeaderTop - $.navBarTop + 40) {
            const b = Math.min(Math.max(offset / (TitleHeaderTop - $.navBarTop), 0), 1);
            const c = 1 - b;
            this.getTiProxy() &&
                this.getTiProxy().applyProperties({
                    headerView: {
                        opacity: c
                    },
                    titleView: {
                        left: b * 40 + 10
                    },
                    titleHolder: {
                        top: c * TitleHeaderTop
                    },
                    titleBackgroundView: {
                        backgroundColor: Color(this.roomColor)
                            .setAlpha(b)
                            .toRgbString()
                    },
                    subTitleView: {
                        left: b * 40 + 10,
                        opacity: b
                    },
                    closeBtnSub: {
                        opacity: b
                    }
                });
            // }
        });
        //     this.listView.on('scroll', {
        //         // if:'',
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
        //                 },
        //                 closeBtnSub: {
        //                     opacity: '_b'
        //                 }
        //             }
        //         }
        //     ]
        // });
        this.getTiProxy().on('click', e => {
            if (e.item) {
                const item = e.item;
                const callbackId = e.bindId || e.source.callbackId;
                switch (callbackId) {
                    case 'image':
                        app.showImageFullscreen(
                            [
                                {
                                    image: item.image.image
                                }
                            ],
                            0
                        );
                        break;
                }
            } else {
                const callbackId = e.bindId || e.source.callbackId;
                switch (callbackId) {
                    case 'closeBtn':
                    case 'closeBtnSub':
                        this.closeMe();
                        break;
                }
            }
        })
            .on('request_tab', e => {
                console.log('tab2click', e.index);
                this.setCurrentLevel(e.index);
            });
    }
    onClose() {
        this.getAppTabController().clearProxy();
        super.onClose();
    }
    getAppTabController() {
        return ak.ti.getRProxy(this.bottomToolbar.children[0]) as AppTabController;
    }
    setCurrentLevel = (level: number) => {
        if (level != this.currentLevel) {
            const oldLevel = this.currentLevel;
            this.currentLevel = level;
            if (this.currentLevel > oldLevel) {
                // console.log('this.currentLevel', this.currentLevel);
                // console.log('oldLevel', oldLevel);
                const sectionsCount = this.listView.sectionCount;
                const contentOffset = this.listView.contentOffset;
                for (let i = 1; i < sectionsCount; i++) {
                    // console.log('section', i);
                    this.listView.appendItems(
                        i,
                        _.times(this.currentLevel - oldLevel, j => {
                            const levelIndex = j + oldLevel + 1;
                            const levels = this.roomData.data.sections[i - 1].levels;
                            // console.log('item', j, levels);
                            return createLevelItem(levels, levelIndex, this.roomColor);
                        }).filter(s => !!s),
                        {
                            animated: true
                        }
                    );
                }
            } else {
                const sectionsCount = this.listView.sectionCount;
                for (let i = 1; i < sectionsCount; i++) {
                    const section = this.roomData.data.sections[i - 1];
                    const levels = section.levels;
                    const levelCount = levels.length;
                    let delta = 1;
                    if (section.description) {
                        delta++;
                    }
                    const toRemove = oldLevel - this.currentLevel;
                    this.listView.deleteItemsAt(i, this.currentLevel + delta, Math.min(toRemove, levelCount - (this.currentLevel + delta)), { animated: true });
                }
            }
            this.getAppTabController().setIndex(level);
        }
    };
}
