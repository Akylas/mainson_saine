import TemplateModule from 'akylas.commonjs/TemplateModule';

// export function createSwipeButton(_id, _color, _icon?) {
//     return {
//         type: 'Ti.UI.Label',
//         bindId: _id,
//         properties: {
//             callbackId: _id,
//             width: 70,
//             backgroundColor: app.colors[_color].color,
//             backgroundSelectedColor: app.colors[_color].darker,
//             color: $.white,
//             height: 'FILL',
//             textAlign: 'center',
//             font: _icon ? { size: 20, family: $.iconicfontfamily } : null,

//             text: _icon || trc(_id)
//         }
//     };
// }

export default class CRowTemplates extends TemplateModule {
    // [key: string]: Template
    home = ak.ti.style({
        properties: {
            height: 60,
            // borderColor: Color($.cTheme.color).brighten(5).toHex8String(),
            // borderPadding: [-1, -1, -0, -1],
            backgroundSelectedColor: __APPLE__ ? $.cTheme.color : undefined,
            selector: $.cTheme.color,
            layout: 'horizontal'
        },
        childTemplates: [
            {
                type: 'Ti.UI.Label',
                bindId: 'icon',
                properties: {
                    transitionName: 'iconView',
                    color: $.cTheme.darkest,
                    touchEnabled: false,
                    width: 50,
                    height: 'fill',
                    left: 0,
                    textAlign: 'center',
                    right: 5,
                    font: { family: $.iconicfontfamily, size: 32 }
                },
                childTemplates: [
                    {
                        type: 'Ti.UI.ImageView',
                        bindId: 'image',
                        properties: {
                            transitionName: 'imageView',
                            width: 'fill',
                            height: 'fill',
                            color: $.black,
                            scaleType: Ti.UI.SCALE_TYPE_ASPECT_FILL
                        }
                    }
                ]
            },

            {
                // properties: {
                //     touchEnabled: false,
                //     rclass: 'MaterialRowLabelHolder'
                // },
                // bindId: 'labelHolder',
                // childTemplates: [
                //     {
                //         properties: {
                //             rclass: 'MaterialRowTitleLabelHolder'
                //         },
                //         bindId: 'titleHolder',
                //         childTemplates: [
                //             {
                type: 'Ti.UI.Label',
                bindId: 'title',
                properties: {
                    touchEnabled: false,
                    transitionName: 'titleView',
                    color: $.cTheme.darkest,
                    width: 'fill',
                    height: 'fill',
                    left: 5,
                    right: 5,
                    // top: 10,
                    font: {
                        size: 18,
                        family: $.sFontFamilyBlack
                        // weight: 'black'
                    }
                }
                // }
                //         {
                //             type: 'Ti.UI.Label',
                //             bindId: 'date',
                //             properties: {
                //                 rclass: 'MaterialRowDate'
                //             }
                //         }
                //     ]
                // },
                // {
                //     bindId: 'subtitleHolder',
                //     properties: {
                //         rclass: 'MaterialRowTitleLabelHolder'
                //     },
                //     childTemplates: [
                //         {
                //             type: 'Ti.UI.Label',
                //             bindId: 'subtitle',
                //             properties: {
                //                 rclass: 'MaterialRowSubtitle'
                //             }
                //         }
                //     ]
                // }
                // ]
                // },
                // {
                //     type: 'Ti.UI.Label',
                //     bindId: 'accessory',
                //     properties: {
                //         touchEnabled: false,
                //         rclass: 'MaterialRowAccessory'
                //     }
            }
        ]
    });
    // material = ak.ti.style({
    //     properties: {
    //         rclass: 'MaterialRow'
    //     },
    //     childTemplates: [
    //         {
    //             //     type: __ANDROID__ ? 'Ti.UI.Switch' : 'Ti.UI.Label',
    //             //     bindId: 'check',
    //             //     properties: {
    //             //         rclass: __ANDROID__ ? 'MaterialRowCheck' : 'MaterialRowCustomCheck'
    //             //     }
    //             // }, {
    //             type: 'Ti.UI.Label',
    //             bindId: 'icon',
    //             properties: {
    //                 rclass: 'MaterialRowAvatar'
    //             }
    //         },
    //         {
    //             properties: {
    //                 rclass: 'MaterialRowLabelHolder'
    //             },
    //             bindId: 'labelHolder',
    //             childTemplates: [
    //                 {
    //                     properties: {
    //                         rclass: 'MaterialRowTitleLabelHolder'
    //                     },
    //                     bindId: 'titleHolder',
    //                     childTemplates: [
    //                         {
    //                             type: 'Ti.UI.Label',
    //                             bindId: 'title',
    //                             properties: {
    //                                 rclass: 'MaterialRowTitle'
    //                             }
    //                         },
    //                         {
    //                             type: 'Ti.UI.Label',
    //                             bindId: 'date',
    //                             properties: {
    //                                 rclass: 'MaterialRowDate'
    //                             }
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     bindId: 'subtitleHolder',
    //                     properties: {
    //                         rclass: 'MaterialRowTitleLabelHolder'
    //                     },
    //                     childTemplates: [
    //                         {
    //                             type: 'Ti.UI.Label',
    //                             bindId: 'subtitle',
    //                             properties: {
    //                                 rclass: 'MaterialRowSubtitle'
    //                             }
    //                         }
    //                     ]
    //                 }
    //             ]
    //         },
    //         {
    //             type: 'Ti.UI.Label',
    //             bindId: 'accessory',
    //             properties: {
    //                 rclass: 'MaterialRowAccessory'
    //             }
    //         }
    //     ]
    //     // },
    //     // image: {
    //     //     properties: {
    //     //         height: 'size'
    //     //     },
    //     //     childTemplates: [{
    //     //         type: 'Ti.UI.ImageView',
    //     //         bindId: 'image',
    //     //         properties: {
    //     //             scaleType: Ti.UI.SCALE_TYPE_ASPECT_FIT,
    //     //             hires: false,
    //     //             width: 'fill',
    //     //             height: 'size'
    //     //         }

    //     //     }]
    // });
    fakeHeaderView = {
        properties: {
            width: '100%',
            height: $.roomHeaderHeight - $.navBarHeight,
            touchEnabled: false
        }
    };
    header = ak.ti.style({
        properties: {
            height: 'size'
            // backgroundColor: $.white
        },
        childTemplates: [
            {
                type: 'Ti.UI.Label',
                bindId: 'label',
                properties: {
                    backgroundColor: $.white,
                    width: 'fill',
                    height: 'size',
                    left: 15,
                    // top: 10,
                    padding: { top: 10 },
                    // bottom: 5,
                    // right: 0,
                    // color: roomColor,
                    font: {
                        size: 18,
                        family: $.sFontFamilyBold
                    },
                    // borderColor: roomColor,
                    borderWidth: 2,
                    borderPadding: [-4, -4, 0, -4]
                }
            }
        ]
    });
    headerHidden = {
        properties: {
            height: 0
        }
    };
    description = ak.ti.style({
        properties: {
            height: 'size',
            minHeight: 5,
            backgroundColor: $.white
        },
        childTemplates: [
            {
                type: 'Ti.UI.Label',

                bindId: 'label',
                properties: {
                    top: 5,
                    bottom: 20,
                    left: 5,
                    right: 5,
                    height: 'size'
                    // color: $.white
                }
            }
        ]
    });
    recette = ak.ti.style({
        properties: {
            height: 'size'
            // width: '50%'
            // unHighlightOnSelect:false,
        },
        childTemplates: [
            {
                properties: {
                    rclass: 'RecetteRow'
                },
                childTemplates: [
                    {
                        type: 'Ti.UI.ImageView',
                        bindId: 'image',
                        properties: {
                            width: 'fill',
                            sizeRatio: 1,
                            touchEnabled: false,
                            top: 0,
                            // transition: {
                            //     style: Ti.UI.TransitionStyle.FADE
                            // },
                            scaleType: Ti.UI.SCALE_TYPE_ASPECT_FILL
                        }
                    },
                    {
                        type: 'Ti.UI.Label',
                        bindId: 'title',
                        properties: {
                            width: 'fill',
                            height: 'fill',
                            color: '#464646',
                            verticalAlign: 'top',
                            touchEnabled: false,
                            padding: 5,
                            font: {
                                fontSize: 20
                            },
                            ellipsize: Ti.UI.TEXT_ELLIPSIZE_TAIL
                        }
                    }
                ]
            }
        ]
    });
    level = ak.ti.style({
        properties: {
            height: 'size',
            layout: 'horizontal',
            backgroundColor: $.white
        },
        childTemplates: [
            {
                type: 'Ti.UI.Label',

                bindId: 'level',
                properties: {
                    // height: 'size',
                    left: 20,
                    top: 8,
                    verticalAlign: 'top',
                    width: 20,
                    font: { family: $.iconicfontfamily, size: 17 }
                    // color: roomColor
                }
            },
            {
                properties: {
                    height: 'size',
                    width: 'fill',
                    layout: 'vertical'
                },
                childTemplates: [
                    {
                        type: 'Ti.UI.Label',

                        bindId: 'label',
                        properties: {
                            height: 'size',
                            width: 'fill',
                            top: 5,
                            left: 5,
                            right: 5
                            // color: $.white
                        }
                    },
                    {
                        type: 'Ti.UI.ImageView',
                        bindId: 'image',
                        properties: {
                            height: 'size',
                            scaleType: Ti.UI.SCALE_TYPE_ASPECT_FIT,
                            width: 'fill',
                            visible: false
                        }
                    }
                ]
            }
        ]
    });
    constructor() {
        super({
            prepareTemplate: ak.ti.prepareListViewTemplate
        });
    }
    // createSwipeButton = createSwipeButton;
}

declare global {
    type RowTemplates = CRowTemplates;
}

export function load(_context) {
    return new CRowTemplates();
}
