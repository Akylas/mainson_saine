export default class PullToRefresh extends View {
    // var rclass = _args.rclass || '';
    needsReset = true;
    unrotate = '';
    rotate = 'or180';
    listView;
    pullMessage;
    releaseMessage;
    loadingMessage;
    get arrow() {
        return this.getBind<titanium.UIView>('arrow');
    }
    get label() {
        return this.getBind<titanium.UILabel>('label');
    }
    static initArgs(_args) {
        if (!_args.constructorNames) {
            _args = ak.ti.redux.prepareClassArgs(_args, PullToRefresh);
        }
        var pullMessage = _args.pullMessage || trc('pull_down_refresh').toUpperCase();
        // var releaseMessage = _args.releaseMessage || trc('pull_down_release').toUpperCase();
        // var loadingMessage = _args.loadingMessage || trc('pull_down_loading').toUpperCase();
        return {
            properties: _args,
            childTemplates: [
                {
                    type: 'Ti.UI.View',
                    properties: {
                        rclass: 'Size HHolder'
                    },
                    childTemplates: [
                        {
                            bindId: 'arrow',
                            type: 'Ti.UI.Label',
                            properties: {
                                rclass: _args.arrowClass || 'PullToRefreshArrow'
                            }
                        },
                        {
                            bindId: 'label',
                            type: 'Ti.UI.Label',
                            properties: {
                                rclass: _args.labelClass || 'PullToRefreshLabel',
                                text: pullMessage
                            }
                        }
                    ]
                }
            ]
        };
    }
    constructor(_args) {
        super(PullToRefresh.initArgs(_args));
        this.pullMessage = _args.pullMessage || trc('pull_down_refresh').toUpperCase();
        this.releaseMessage = _args.releaseMessage || trc('pull_down_release').toUpperCase();
        this.loadingMessage = _args.loadingMessage || trc('pull_down_loading').toUpperCase();
    }

    pullchangedListener = e => {
        if (e.active === false) {
            this.arrow.animate({
                transform: this.unrotate,
                duration: 180
            });
            this.label.text = this.pullMessage;
        } else {
            this.arrow.animate({
                transform: this.rotate,
                duration: 180
            });
            this.label.text = this.releaseMessage;
        }
    };

    goToLoading = () => {
        this.label.text = this.loadingMessage;
        this.arrow.hide();
    };

    pullendListener = e => {
        this.listView.on('pull', this.reset);
        if (e.active === false) return;
        this.goToLoading();
        this.getTiProxy().emit('pulled');
    };
    reset = () => {
        this.listView.off('pull', this.reset);
        this.label.text = this.pullMessage;
        this.arrow.transform = this.unrotate;
        this.arrow.show();
    };

    setListView = _listview => {
        if (this.listView) {
            this.listView.off('pull', this.reset);
            this.listView.off('pullchanged', this.pullchangedListener);
            this.listView.off('pullend', this.pullendListener);
        }
        this.listView = _listview;
        _listview.on('pullchanged', this.pullchangedListener);
        _listview.on('pullend', this.pullendListener);
    };
}
