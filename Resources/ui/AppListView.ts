import PullToRefresh from './PullToRefresh';
import AppWindow, { AppWindowContainer, hasBottomToolbar } from './AppWindow';
import { BaseClass, ViewConstructor, BaseNavWindow } from 'akylas.commonjs/AkInclude/ui/BaseWindow';

export function hasListView(window: AppWindow) {
    return (window as any).listView !== undefined;
}

function CAppListView<T extends BaseClass<ListView>>(baseClass: T) {
    function initListViewArgs(_args) {
        if (!_args.constructorNames) {
            _args = ak.ti.redux.prepareClassArgs(_args, AppListView);
        }
        _args = _args || {};
        var pullToRefresh: PullToRefresh;
        if (_args.noPullView === false) {
            pullToRefresh = new PullToRefresh({
                rclass: _args.pullToRefreshClass || 'PullToRefresh'
            });
            _args.pullView = pullToRefresh;
        }
        return _args;
    }
    
    return class extends baseClass {
    showPullView?();
    closePullView?();
    pullToRefresh: PullToRefresh;
    firstLoaded = false;
    loadingTimer = null;
    updating = false;
    constructor(...args:any[]) {
        super(initListViewArgs(args[0]));
        this.init(args[0]);
    }
    get sections() {
        return this.tiProxy.sections;
    }
    init(_args) {
        this.pullToRefresh = _args.pullView;
        if (this.pullToRefresh) {
            this.pullToRefresh.setListView(this);
            app.onDebounce(this.pullToRefresh, 'pulled', this.onPulled.bind(this));
        }
    }
    onPulled() {
        this.showPullView();
        this.update();
    }
    // var this = ((_args.isCollection === true) ? new CollectionView(_args) : new ListView(_args)) as AppListView;

    // let firstLoaded = false;
    update() {}

    cancelLoadingTimer() {
        if (this.loadingTimer !== null) {
            clearTimeout(this.loadingTimer);
            this.loadingTimer = null;
        }
    }

    onTimerComplete() {
        if (this.loadingTimer !== null) {
            this.loadingTimer = null;
        }
    }

    startLoadingTimer() {
        this.cancelLoadingTimer();
        this.loadingTimer = setTimeout(this.onTimerComplete.bind(this), 50);
    }

    startLoading() {
        if (this.updating === true) return;
        this.updating = true;
    }
    doneLoading() {
        if (this.firstLoaded === false) {
            this.firstLoaded = true;
        }
        this.closePullView();
        if (this.pullToRefresh) {
            this.pullToRefresh.reset();
        }
        this.updating = false;
    }
}
}

export default class AppListView extends CAppListView(ListView) {
    
}

export class AppCollectionView extends CAppListView(CollectionView) {
    static initArgs(_args) {
        if (!_args.constructorNames) {
           _args = ak.ti.redux.prepareClassArgs(_args, AppCollectionView);
        }
        return _args;
    }
    constructor(_args) {
        super(AppCollectionView.initArgs(_args));
    }
}

export function WithListView<T extends ViewConstructor<AppWindow>>(Base: T) {
    return class extends Base {
        //ListView
        listView?: AppListView | AppCollectionView
        hasContentLoading = false;
        headerTemplate?: any;
        editing = false;
        selectedItems: { [k: string]: number } = {};
        constructor(...args: any[]) {
            super(args[0]);
            const _args = args[0];
            const theClass = !!_args.useCollection? AppCollectionView : AppListView;

            if (_args.listViewArgs) {
                this.listView = new theClass(_args.listViewArgs);
                this.container.add(this.listView.tiProxy);
            } else if (_args.templates) {
                this.headerTemplate = ak.ti.style({
                    type: 'Ti.UI.Label',
                    properties: {
                        rclass: 'LVHeader'
                    }
                });

                var listargs = {
                    rid: _args.listViewId,
                    isCollection: _args.useCollection,
                    canEdit: _args.canEdit,
                    rclass: _args.listViewClass,
                    templates: _.assign(
                        {
                            noitem: app.templates.row.noitem
                        },
                        _args.templates
                    ),
                    defaultItemTemplate: _args.defaultItemTemplate || 'default',
                    headerView: undefined
                };
                if (_args.headerView) {
                    listargs.headerView = _args.headerView;
                } else if (_args.withAd === true) {
                }
                this.listView = new theClass(listargs);

                this.container.add(this.listView.tiProxy);
                this.hasContentLoading = true;
            }
        }

        getSelectedItems = () => {
            return this.selectedItems;
        };
        deselectItems = () => {
            this.selectedItems = {};
            if (hasBottomToolbar(this)) {
                (this as any).hideBottomToolbar();
            }
        };

        handleCheck = e => {
            if (!e.item || !e.item.check || !e.item.canBeChecked) {
                return;
            }
            const newValue = !!!e.item.check.selected;
            let id = e.item.id;
            let currentSize = Object.keys(this.selectedItems).length;
            let newSize = currentSize;
            console.log('handleCheck', id, newValue, currentSize, this.selectedItems);
            if (newValue) {
                if (!this.selectedItems.hasOwnProperty(id)) {
                    this.selectedItems[id] = e.itemIndex;
                    newSize += 1;
                }
            } else {
                if (this.selectedItems.hasOwnProperty(id)) {
                    newSize -= 1;
                    delete this.selectedItems[id];
                }
            }
            console.log('handleCheck2', newSize, this.selectedItems);
            e.section.updateItemAt(e.itemIndex, {
                check: {
                    selected: newValue
                }
            });
            this.emit('selection', {
                oldCount: currentSize,
                newCount: newSize,
                selected: newValue,
                item: e.item,
                itemIndex: e.itemIndex,
                section: e.section,
                sectionIndex: e.sectionIndex,
                id: e.id,
                recordIndex: e.recordIndex
            });
        };

        setEditing = value => {
            if (this.editing == value) {
                return;
            }
            this.tiProxy.blur();
            this.editing = value;
            if (!this.editing) {
                this.deselectItems();
            }
            this.updateEditingState();
        };
        updateEditingState = () => {
            const editing = this.editing;
            this.listView.sections.forEach((section: any) => {
                console.log('updateEditingState', section.canBeChecked);
                if (section.canBeChecked === false) {
                    return;
                }
                section.updateItems(
                    _.times(section.itemCount, () => {
                        let result = {
                            check: {
                                visible: editing
                            },
                            unHighlightOnSelect: !editing,
                            dispatchPressed: editing
                        } as any;
                        if (!editing) {
                            result.check.selected = false;
                        }
                        return result;
                    })
                );
            });
        };
    };
}
