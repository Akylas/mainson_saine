import AppTabController from './AppTabController'

export type ViewWithTitle  = titanium.UIView & {
    title?: string
}

export type Tabs = Array<TiDictT<ViewWithTitle> | ViewWithTitle>;
export default class AppTabView extends View {
    tabController: AppTabController | titanium.UIButtonBar;
    get pager(){
        return this.getBind<titanium.UIScrollableView>('pager');
    } 
    tabs: Tabs;
    currentPage: 0;
    currentView: titanium.UIView;
    static initArgs(_args) {
        if (!_args.constructorNames) {
            _args = ak.ti.redux.prepareClassArgs(_args, AppTabView);
        }
        return _args;
    }
    constructor(_args) {
        super(AppTabView.initArgs(_args));
        this.tabs = _args.tabs || [];
        this.currentPage = _args.currentPage || 0;

        let showControls = _args.showControls;
        let createTab = _args.createTab;
        let nativeControls = _args.nativeControls;
        let tabsControllerClass = _args.tabsControllerClass;
        let tabControllerParams = _args.tabControllerParams;
        let pagerClass = _args.pagerClass || 'AppTabViewScrollableView';
        let loadedTabs = [];
        delete _args.tabs;
        _args = {
            properties: _args,
            childTemplates: []
        };

        _args.childTemplates.push({
            type: 'Ti.UI.ScrollableView',
            bindId: 'pager',
            properties: {
                rclass: pagerClass,
                views: this.tabs
            },
            events: {
                scrollend: e => {
                    if (e.hasOwnProperty('currentPage')) {
                        if (this.tabController) {
                            this.tabController.setIndex(e.currentPage);
                        }
                        var oldTab = this.tabs[this.currentPage],
                            newTab = e.view;
                        this.currentPage = e.currentPage;
                        e.oldView = oldTab;
                        if (oldTab && oldTab.blur) {
                            oldTab.blur();
                        }
                        if (newTab) {
                            if (newTab && newTab.focus) {
                                newTab.focus();
                            }
                        }
                        this.tiProxy.emit('change', e);
                    }
                },
                change: e => {
                    if (!e.hasOwnProperty('currentPage')) {
                        return;
                    }
                    this.tiProxy.emit('change', e);
                    this.currentView = e.view;
                    if (loadedTabs.indexOf(e.currentPage) === -1) {
                        loadedTabs.push(e.currentPage);
                        this.currentView.emit('first_load');
                    }
                }
            }
        });
        if (showControls !== false) {
            var titles = this.tabs.map(t => t.title);
            console.log('titles', titles);
            if (nativeControls === true) {
                if (__APPLE__) {
                    this.tabController = Ti.UI.createButtonBar({
                        bindId: 'buttonbar',
                        index: 0,
                        rclass: tabsControllerClass,
                        labels: titles
                    });
                    this.tabController.on('click', function(_event) {
                        console.log('tab1 click', _event.index);
                        this.setTab(_event.index);
                    });
                } else {
                    _args.childTemplates[0].properties.strip = ak.ti.style({
                        titles: titles,
                        rclass: tabsControllerClass
                    });
                }
            } else {
                this.tabController = new AppTabController(
                    Object.assign(
                        {
                            rclass: tabsControllerClass,
                            createTab: createTab,
                            labels: titles
                        },
                        tabControllerParams
                    )
                );
                this.tabController.on('request_tab', function(_event) {
                    console.log('tab2click', _event.index);
                    this.setTab(_event.index);
                });
            }

            if (this.tabController) {
                _args.childTemplates.unshift(this.tabController);
            }
        }

        this.setTab(this.currentPage);
    }

    setTab(_index) {
        console.log('setTab', _index, this.currentPage);
        if (this.currentPage != _index) {
            this.pager.scrollToView(_index);
        } else {
            this.tiProxy.emit('tab_should_go_back', { index: _index, view: this.pager.views[_index] });
        }
    }
    setTabs(_tabs: Tabs) {
        this.tabs = _tabs;
        this.pager.views = this.tabs;
        if (this.tabController) {
            this.tabController.setLabels(this.tabs.map(t => t.title) as string[]);
        }
    }
    getTab(_index) {
        return this.tabs[_index];
    }
    getTabs() {
        return this.tabs;
    }

    moveNext() {
        this.pager.moveNext();
    }
}
