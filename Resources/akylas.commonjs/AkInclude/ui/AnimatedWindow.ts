export default class AnimatedWindow extends TiWindow {
    openArgs?: TiDict;
    closeArgs?: TiDict;
    handleOpen: boolean;
    handleClose: boolean;
    _opened: boolean;
    _closing: boolean;
    onShow?: () => void;
    beforeShow?: () => void;
    winManager?: AK.IWindowManager;
    onHide?: () => void;
    closeInOnHide?: boolean;
    constructor(_args?) {
        super(_args);
        _args = _args || {};

        this.openArgs = _args.openArgs || {
            opacity: 1,
            duration: 200
        };
        this.closeArgs = _args.closeArgs || {
            opacity: 0,
            duration: 200
        };
        this.handleOpen = this.handleClose = true;
        this._opened = false;
        this._closing = false;
        this.tiProxy.on('open', this.onWinOpen);
    }

    onWinOpen = () => {
        this.tiProxy.animate(this.openArgs, function() {
            app.ui.windowSignalsOpened(self);
        });
        if (this.onShow) {
            this.onShow();
        }
    };
    showMe = _force => {
        if (this._opened || (_force !== true && (this.winManager || app.ui).handlingOpening === true)) return;
        this._closing = false;
        this._opened = true;
        this._closing = false;
        if (this.beforeShow) {
            this.beforeShow();
        }
        this.tiProxy.applyProperties(this.closeArgs);
        app.ui.openWindow(this, { animated: false });
    };
    hideMe = () => {
        if (!this._opened || this._closing) return;
        this._closing = true;
        this._opened = false;

        if (this.onHide) {
            this.onHide();
        }
        if (this.closeInOnHide !== true) {
            this.tiProxy.animate(this.closeArgs, function() {
                app.ui.closeWindow(this, { animated: false });
                this._closing = false;
            });
        } else {
            app.ui.closeWindow(this);
        }
    };
}
