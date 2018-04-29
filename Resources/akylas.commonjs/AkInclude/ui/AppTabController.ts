export default class AppTabController extends View {
    currentTab = 0;
    tabRClass = 'AppTab';
    get container() {
        return this.getBind<titanium.UIView>('container') 
    }
    static initArgs(_args) {
        if (!_args.constructorNames) {
            _args = ak.ti.redux.prepareClassArgs(_args, AppTabController);
        }
        return _args;
    }
    constructor(_args) {
        super(AppTabController.initArgs(_args));
        if (_args.createTab) {
            this.createTab = _args.createTab;
            delete _args.createTab;
        }

        if (_args.tabRClass) {
            this.tabRClass = _args.tabRClass;
        }
        const rclassContainer = _args.rclassContainer || 'AppTabControllerContainer';
        this.getTiProxy().add(
            ak.ti.style({
                type: 'Ti.UI.View',
                bindId: 'container',
                properties: {
                    rclass: rclassContainer
                }
            }),
            0
        );
        if (_args.labels) {
            ak.ti.add(this.container, this.prepareTabs(_args.labels));
        }
        this.getTiProxy().on('click', _event => {
            // console.log('on tab view click');
            if (this.getTiProxy().containsView(_event.source) && _event.source.index !== undefined) {
                // console.log('on tab2 view click');
                this.setIndex(_event.source.index);
                this.getTiProxy().emit('request_tab', {
                    index: _event.source.index
                });
            }
        });
    }

    createTab = (_tab:string, index, selected, tabRClass) => {
        return {
            type: 'Ti.UI.Label',
            properties: Object.assign(
                {
                    html: _tab,
                    index: index,
                    rclass: tabRClass
                },
                __APPLE__ ? { selected: selected } : { enabled: !selected }
            )
        };
    };

    prepareTabs = (_tabs:string[]) => {
        var currentCount = this.container.children.length;
        var selected = currentCount === 0;
        var tabsToAdd = [];
        for (var i = 0; i < _tabs.length; i++) {
            tabsToAdd.push(this.createTab(_tabs[i], currentCount, selected, this.tabRClass));
            currentCount++;
            selected = false;
        }
        return tabsToAdd;
    };

    setLabels (_tabs:string[]) {
        this.getTiProxy().removeAllChildren();
        this.getTiProxy().add(this.prepareTabs(_tabs));
    };

    addTab = _title => {
        this.getTiProxy().add(this.prepareTabs([_title]));
    };

    setIndex (_index:number){
        if (_index !== undefined && _index !== this.currentTab) {
            var children = this.container.children;
            if (__APPLE__) {
                children[this.currentTab].selected = false;
                children[_index].selected = true;
            } else {
                children[this.currentTab].enabled = true;
                children[_index].enabled = false;
            }

            this.currentTab = _index;
        }
    };
}
