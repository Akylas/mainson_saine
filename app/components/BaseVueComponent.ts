import Vue from 'nativescript-vue';
import { Prop } from 'vue-property-decorator';
import { Color, Page } from 'tns-core-modules/ui/page/page';
import { isAndroid, isIOS } from 'tns-core-modules/platform/platform';

import { actionBarHeight, darkColor, primaryColor } from '../variables';

export default class BaseVueComponent extends Vue {
    public isAndroid = isAndroid;
    public isIOS = isIOS;
    // themeColor = primaryColor;
    // darkColor = darkColor;
    @Prop({ type: String, default: primaryColor })
    themeColor;
    @Prop({ type: String, default: darkColor })
    darkColor;
    public actionBarHeight = actionBarHeight;
    get page() {
        return (this.$refs.page as any).nativeView as Page;
    }
    mounted() {
        const page = this.page;
        // page.backgroundSpanUnderStatusBar = true;
        page.actionBarHidden = true;
        if (isIOS) {
            page.statusBarStyle = 'dark';
        } else {
            page.androidStatusBarBackground = null;
            page.androidStatusBarBackground = new Color(this.darkColor);
        }
        page.backgroundColor = this.themeColor;
    }

    // get darkColor() {
    //     return this._darkColor || darkColor;
    // }
    // get themeColor() {
    //     return this._themeColor || primaryColor;
    // }
}
