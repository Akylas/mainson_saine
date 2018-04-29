import AppWindow, { AppWindowContainer, TopToolbar, BottomToolbar, BaseNavWindow } from './AppWindow';

export interface Photo {
    image: string | titanium.FilesystemFile;
    attribution?: {
        logo?: string;
        author?: string;
        description?: string;
        link?: string;
        author_link?: string;
    };
}

function photoAttribution(_photo: Photo) {
    var attribution;
    if (!!_photo.attribution) {
        attribution = '';
        var attr = _photo.attribution;
        if (attr.author) {
            attribution += attr.author;
            if (attr.author_link) {
                attribution = '<a href="' + attr.author_link + '">' + attribution + '</a>';
            }
        }
        if (attr.description) {
            attribution += '<br>' + attr.description;
        }
        if (attr.link) {
            attribution += '<br>' + '<a href="' + attr.link + '">' + attr.link + '</a>';
        }
    }
    return attribution;
}

function scrollViewForPhoto(_index: number, _photo: Photo, _current, sourceRect) {
    console.log('scrollViewForPhoto', _index, _photo, _current, sourceRect);
    return Ti.UI.createView({
        // type: 'Ti.UI.View',
        properties: {
            attribution: photoAttribution(_photo),
            attributionLogo: _photo.attribution && _photo.attribution.logo
        },
        childTemplates: [
            {
                type: 'Akylas.ZoomableImageView',
                bindId: 'imageView',
                properties: Object.assign(
                    {
                        bubbleParent: true,
                        maxZoomScale: __APPLE__ ? 2.0 : 2 * app.deviceinfo.densityFactor,
                        rclass: 'ImageWindowImageView',
                        image: _photo.image
                    },
                    sourceRect && _current && __APPLE__
                        ? {
                              left: sourceRect.x,
                              top: sourceRect.y + (__APPLE__ ? $.navBarTop : 0),
                              width: sourceRect.width,
                              height: sourceRect.height
                          }
                        : undefined
                )
            }
        ]
    });
}

export interface Container extends AppWindowContainer {
    topToolbar: titanium.UIView;
    scrollableView;
    bottomToolbar: titanium.UIView & {
        label: titanium.UILabel;
    };
}
export default class FullscreenImageWindow extends BottomToolbar(TopToolbar(AppWindow)) {
    // var rclass = _args.rclass || '';
    // sourceRect;
    topRect;
    scaleType: string | number = Ti.UI.SCALE_TYPE_ASPECT_FILL;
    optionsVisible = false;
    currentView;

    get underContainer() {
        return this.getBind<titanium.UIView>('underContainer')
    }
    get container() {
        return this.getBind<Container>('container')
    }
    canPan = false;
    setCanPanTimer;
    scrollPanDict: any;
    static initArgs(_args) {
        if (!_args.constructorNames) {
            _args = ak.ti.redux.prepareClassArgs(_args, FullscreenImageWindow);
        }

        Object.assign(_args, {
            backgroundColor: 'transparent',
            underContainerView: {
                type: 'Ti.UI.View',
                bindId: 'underContainer',
                properties: {
                    backgroundColor: 'black'
                }
            }
        });
        // console.log('test', _args);
        let _photos: Photo[] = _.remove(_args, 'photos');
        console.log('photos', _photos);

        let _photoIndex = _.remove(_args, 'photoIndex', 0);
        let _fromView: titanium.UIImageView = _.remove(_args, 'fromView');
        let sourceRect;
        if (_fromView) {
            sourceRect = _fromView.absoluteRect;
        }
        _args.centerContainerView = {
            type: 'Ti.UI.ScrollableView',
            bindId: 'scrollableView',
            properties: {
                panDirection: 'vertical',
                directionalLockEnabled: true,
                verticalBounce: false,
                currentPage: _photoIndex,
                views: _photos.map((value, index) => scrollViewForPhoto(index, value, index === _photoIndex, sourceRect))
            }
        };

        _args.topToolbar = {
            bindId: 'topToolbar',
            properties: {
                layout: 'horizontal',
                height: $.navBarHeight,
                top:app.deviceinfo.isIPhoneX?20:0,
                bottom: 0
            },
            childTemplates: [
                {
                    type: 'Ti.UI.Button',
                    properties: {
                        rclass: 'NBBackButton',
                        callbackId: 'close',
                        title: $.sClose
                    }
                },
                {
                    type: 'Ti.UI.ImageView',
                    bindId: 'logo',
                    properties: {
                        width: 'SIZE',
                        height: 20,
                        top: 10,
                        left: 10,
                        onlyTransitionIfRemote: false,
                        transition: {
                            style: Ti.UI.TransitionStyle.FADE,
                            duration: 200
                        }
                        // image: _photo.attribution ? (_photo.attribution.logo) : undefined
                    }
                },
                {
                    type: 'Ti.UI.View'
                    // },
                    // {
                    //     type: 'Ti.UI.Button',
                    //     properties: {
                    //         rclass: 'NBBackButton',
                    //         callbackId: 'share',
                    //         title: '\ue25a'
                    //     }
                }
            ]
        };

        // var argsBottomToolbar = _args.bottomToolbar;
        // if (argsBottomToolbar) {
        //     scrollViewArgs.childTemplates.push({
        //         rclass: 'BottomToolbar',
        //         childTemplates: argsBottomToolbar
        //     });
        // }
        _args.bottomToolbar =Ti.UI.createScrollView({
            // type: 'Ti.UI.ScrollView',
            bindId: 'bottomToolbar',
            properties: {
                width: 'FILL',
                height: 'SIZE',
                maxHeight: 100,
                layout: 'vertical',
                backgroundColor: '#aa000000',
                contentHeight: 'SIZE'
            },
            childTemplates: [
                {
                    type: 'Ti.UI.Label',
                    bindId: 'label',
                    properties: {
                        top: 0,
                        padding: {
                            left: 10,
                            right: 10,
                            bottom: 5,
                            top: 5
                        },
                        color: $.white,
                        height: 'SIZE',
                        width: 'FILL',
                        font: {
                            size: 14
                        },
                        verticalAlign: 'top',
                        transition: {
                            style: Ti.UI.TransitionStyle.FADE,
                            duration: 200
                        }
                    },
                    events: {
                        click: app.debounce(function(e) {
                            if (e.link) {
                                // app.ui.createAndOpenWindow('WebWindow', {
                                //     floating: true,
                                //     showBackButton: true,
                                //     url: e.link
                                // });
                            }
                        })
                    }
                }
            ]
        });
        _args.bottomToolbarVisible = _args.topToolbarVisible = true;
        return _args;
    }
    constructor(_args) {
        super(FullscreenImageWindow.initArgs(_args));

        this.topRect = app.ui.topWindow.getTiProxy().rect;
        this.container.scrollableView
            .on('scale', this.onScale)
            // .on('singletap', this.onSingleTap)
            .on('panend', this.onPanEnd)
            .on('scrollstart', this.onScrollStart)
            .on('change', this.onPageChange)
            .on('scrollend', this.onScrollEnd);

        this.scrollPanDict = {
            variables: {
                tx: 'translation.y',
                canPan: true
            },
            expressions: {
                offset: '_tx'
            },
            condition: '_canPan',
            targets: [
                {
                    properties: {
                        transform: 'ot0,_offset'
                    }
                },
                {
                    target: this.underContainer,
                    properties: {
                        opacity: '1-abs(_offset*2.0/' + this.topRect.height + ')'
                    }
                },
                {
                    target: this.container.scrollableView,
                    properties: {
                        scrollingEnabled: '0'
                    }
                }
            ]
        };
        this.on('open', () => {
            if (__APPLE__) {
                this.getCurrentView().animate({
                    left: null,
                    top: null,
                    width: 'FILL',
                    height: 'FILL',
                    duration: 300
                });
            }
        });
        this.on('click', e => {
            var callbackId = e.source.callbackId;
            switch (callbackId) {
                case 'share':
                    app.share({
                        image: this.getCurrentView().image
                    });
                    break;
                case 'close':
                    this.closeMe();
                    break;
            }
        });
        this.setCanPan(true);
    }
    getCurrentView = () => {
        var view = this.container.scrollableView.getView(this.container.scrollableView.currentPage).imageView;
        // console.log('getCurrentView', scrollableView.currentPage, scrollableView.views.length, view);
        if (!this.currentView) {
            this.currentView = view;
        }
        return view;
    };
    setCanPan = _value => {
        if (this.canPan === _value) {
            return;
        }
        if (this.setCanPanTimer) {
            clearTimeout(this.setCanPanTimer);
            this.setCanPanTimer = null;
        }
        if (_value) {
            this.setCanPanTimer = setTimeout(() => {
                this.canPan = _value;
                sdebug('setCanPan', this.canPan);
                this.scrollPanDict.variables.canPan = this.canPan;
                this.container.scrollableView.on('pan', this.scrollPanDict);
            }, 200);
            return;
        }

        this.canPan = _value;

        this.container.scrollableView.off('pan', this.scrollPanDict);
        sdebug('setCanPan', this.canPan);
        if (!_value) {
            if (this.currentView) {
                this.currentView.animate({
                    transform: null,
                    duration: 100
                });
            }

            this.underContainer.animate({
                opacity: 1,
                duration: 100
            });
        }
    };
    onSingleTap = e => {
        if (e.bindId === 'imageView') {
            console.debug('singletap', e);
            if (this.optionsVisible) {
                this.optionsVisible = false;
                this.hideBottomToolbar();
                this.hideTopToolbar();
            } else {
                this.optionsVisible = true;
                this.showBottomToolbar();
                this.showTopToolbar();
            }
        }
    };
    onScale = e => {
        if (!!e.userInteraction) {
            this.setCanPan(false);
        } else {
            this.setCanPan(e.zoomScale < e.source.minZoomScale + 0.02);
        }
    };
    onPanEnd = e => {
        this.container.scrollableView.scrollingEnabled = true;
        if (!!this.canPan) {
            // sdebug('panend', Math.abs(e.velocity.y), Math.abs(e.translation.y));
            if (Math.abs(e.velocity.y) > 300 && Math.abs(e.translation.y) > 40) {
                e.source.animate({
                    transform: e.velocity.y > 0 ? 'ot0,100%' : 'ot0,-100%',
                    duration: 200
                    // }, function() {
                });
                this.underContainer.animate({
                    opacity: 0,
                    duration: 100
                });
                this.closeMe();
            } else {
                e.source.animate({
                    transform: null,
                    duration: 100
                });
                this.underContainer.animate({
                    opacity: 1,
                    duration: 100
                });
            }
        }
    };
    onPageChange = e => {
        if (!e.view) {
            return;
        }
        const attribution = e.view.attribution;
        // console.log('test', attribution, this.container.bottomToolbar);
        
        this.container.topToolbar.applyProperties({
            logo: {
                image: e.view.attributionLogo || null
            }
        });
        this.container.bottomToolbar.label.animate({
            opacity: !!attribution ? 1 : 0,
            html: attribution,
            duration: 200
        });
    };
    onScrollStart = e => {
        this.setCanPan(false);
    };
    onScrollEnd = e => {
        console.debug('scrollend', this.canPan);
        const view = this.getCurrentView();
        if (view !== this.currentView) {
            console.debug('view changed');
            this.currentView.zoomScale = 0;
            this.currentView = view;
        }
        this.setCanPan(view.zoomScale < view.minZoomScale + 0.02);
    };
}
