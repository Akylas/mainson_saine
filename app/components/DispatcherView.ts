import { View } from '@nativescript/core/ui/core/view';

declare module '@nativescript/core/ui/core/view' {
    interface View {
        handleGestureTouch(event);
        onTouchEvent(event);
    }
}

let TouchListener: TouchListener;
interface TouchListener {
    new (owner: View): android.view.View.OnTouchListener;
}

function initializeTouchListener(): void {
    if (TouchListener) {
        return;
    }

    @Interfaces([android.view.View.OnTouchListener])
    class TouchListenerImpl extends java.lang.Object implements android.view.View.OnTouchListener {
        private owner: WeakRef<View>;
        constructor(owner: View) {
            super();
            this.owner = new WeakRef(owner);

            return global.__native(this);
        }

        onTouch(view: android.view.View, event: android.view.MotionEvent): boolean {
            const owner = this.owner.get();
            if (!owner) {
                return;
            }
            owner.handleGestureTouch(event);

            
            return owner.onTouchEvent(event);
        }
    }

    TouchListener = TouchListenerImpl;
}

export class DispatcherView extends View {
    _dispatcherView: View;
    touchListener: TouchListener;
    touchListenerIsSet: boolean = false;

    get dispatcherView() {
        return this._dispatcherView;
    }
    set dispatcherView(view: View) {
        this._dispatcherView = view;
        if (gVars.isIOS && this.nativeViewProtected) {
            this.nativeViewProtected.setDispatcherView(view ? view.nativeViewProtected : null);
        }
    }
    createNativeView() {
        if (gVars.isAndroid) {
            // we need a view extending ViewGroup to make sure children can be added
            return new android.widget.FrameLayout(this._context);
        } else {
            return UIView.new();
        }
    }
    initNativeView() {
        if (gVars.isIOS) {
            if (this._dispatcherView) {
                this.nativeViewProtected.setDispatcherView(this._dispatcherView.nativeViewProtected);
            }
        }
    }
     setOnTouchListener() {
        if (!this.nativeViewProtected) {
            return;
        }
        // do not set noop listener that handles the event (disabled listener) if IsUserInteractionEnabled is
        // false as we might need the ability for the event to pass through to a parent view
        initializeTouchListener();
        this.touchListener = this.touchListener || new TouchListener(this) as any;
        this.nativeViewProtected.setOnTouchListener(this.touchListener);

        this.touchListenerIsSet = true;

        if (this.nativeViewProtected.setClickable) {
            this.nativeViewProtected.setClickable(this.isUserInteractionEnabled);
        }
    }

    handleGestureTouch(event) {
        if (this._dispatcherView) {
            return this._dispatcherView.handleGestureTouch(event);
        }
        return super.handleGestureTouch(event);
    }
    onTouchEvent(event) {
        if (this._dispatcherView ) {
            return (this._dispatcherView.nativeViewProtected as android.view.View).dispatchTouchEvent(event);
        }
        let nativeView = this.nativeViewProtected;
            if (!nativeView || !nativeView.onTouchEvent) {
                return false;
            }

        return nativeView.onTouchEvent(event);
    }
}
