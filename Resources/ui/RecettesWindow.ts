import AppWindow, { TopToolbar, CustomNavBar, AppWindowContainer, BaseNavWindow } from './AppWindow';
import RecetteWindow from './RecetteWindow';

export interface RecetteData {
    text: string;
    title: string;
    image: string;
}

export interface RecetteWinParams extends AKWindowParams {
    // recettes: RecetteData[];
}

function prepareSections(recettes: RecetteData[], roomColor) {
    return [
        {
            items: recettes.map(r => {
                return {
                    recette: r,
                    image: {
                        image: r.image
                    },
                    title: {
                        html: r.title
                    }
                };
            })
        }
    ];
}

export default class RecettesWindow extends CustomNavBar(TopToolbar(AppWindow)) {
    static initArgs(_args: RecetteWinParams, recettes?: RecetteData[]) {
        // console.debug('RecettesWindow', 'initArgs', _args)
        if (!_args.constructorNames) {
            _args = ak.ti.redux.prepareClassArgs(_args, RecettesWindow);
        }
        // console.debug('RecettesWindow', 'initArgs2', _args)
        const roomColor = $.cTheme.darkest;
        _args.statusBarColor = roomColor;
        _args.title = 'RECETTES';
        if (__APPLE__) {
            _args.underContainerView = {
                bindId: 'underContainerView',
                // transform:'t0,-100',
                opacity: 0,
                top: 0,
                height: $.navBarTop,
                backgroundColor: roomColor
            };
        }

        return _args;
    }
    constructor(recettes: RecetteData[], _args) {
        super(RecettesWindow.initArgs(_args, recettes));
        const roomColor = $.cTheme.darkest;
        ak.ti.add(this.container, {
            bindId: 'listView',
            type: 'Ti.UI.CollectionView',
            properties: {
                columnWidth: '50%',
                defaultItemTemplate: 'recette',
                backgroundColor: '#F4F4F4',
                templates: {
                    recette: app.templates.row.recette
                },
                sections: prepareSections(recettes, roomColor)
            }
        });
        this.on('click', e => {
            // this.setColors(undefined);
            if (e.item) {
                const item = e.item;
                this.manager.navOpenWindow(new RecetteWindow(item.recette, {}));
            } else {
                const callbackId = e.bindId || e.source.callbackId;
                switch (callbackId) {
                    case 'closeBtn':
                    case 'closeBtnSub':
                        this.closeMe();
                        break;
                    // default:
                        // this.setColors(undefined);
                        // this.showHideTopToolbar();
                }
            }
        });
    }
}
