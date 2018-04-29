export default class LoadingView extends View {
    static initArgs(_args) {
        if (!_args.constructorNames) {
            _args = ak.ti.redux.prepareClassArgs(_args, LoadingView);
        }
        return {
            properties: _args,
            childTemplates: [
                {
                    type: 'Ti.UI.View',
                    bindId: 'holder',
                    properties: {
                        rclass: 'LoadingViewHolder'
                    },
                    childTemplates: [
                        {
                            type: 'Ti.UI.ActivityIndicator',
                            bindId: 'indicator',
                            properties: {
                                rclass: 'LoadingViewIndicator'
                            }
                        },
                        {
                            type: 'Ti.UI.ImageView',
                            bindId: 'image',
                            properties: {
                                rclass: 'LoadingViewImage'
                            }
                        },
                        {
                            type: 'Ti.UI.Label',
                            bindId: 'label',
                            properties: {
                                rclass: 'LoadingViewLabel'
                            }
                        },
                        {
                            bindId: 'progress',
                            type: 'Ti.UI.ProgressBar',
                            properties: {
                                // height: 'FILL',
                                left: 10,
                                right: 10,
                                visible: false,
                                min: 0,
                                value: 0,
                                max: 100
                            }
                        },
                        {
                            type: 'Ti.UI.Label',
                            bindId: 'sublabel',
                            properties: {
                                visible: false,
                                font: { size: 14, weight: 'normal' },
                                padding: 5,
                                rclass: 'LoadingViewLabel'
                            }
                        }
                    ]
                }
            ]
        };
    }
    constructor(_args) {
        super(LoadingView.initArgs(_args));
    }

    startLoading = _args => {
        _args = _args || {};
        let computing = !!_args.computing;
        console.log('startLoading', _args);
        this.tiProxy.applyProperties(
            Object.assign(
                {
                    label: {
                        text: trc('loading') + '...'
                    },
                    indicator: {
                        visible: !computing
                    },
                    progress: {
                        visible: false
                    },
                    image: {
                        visible: computing
                    }
                },
                _args
            )
        );
    };
    updateLoading = _args => {
        console.log('updateLoading', _args);
        this.tiProxy.applyProperties(
            Object.assign(_args, {
                duration: 100
            })
        );
    };
    stopLoading = () => {
        // self.indicator.hide();
    };
}
