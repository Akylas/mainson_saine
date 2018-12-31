// const dev = TNS_ENV === 'development';
const dev = false;
import Vue, { registerElement } from 'nativescript-vue';

import * as trace from 'tns-core-modules/trace';
const errorHandler: trace.ErrorHandler = {
    handlerError(err) {
        // (development 1)
        throw err;

        // (development 2)
        // trace.write(err, "unhandlede-error", type.error);

        // (production)
        // reportToAnalytics(err)
    }
};

trace.setErrorHandler(errorHandler);

// naming main file app is important for snapshot
import './app.scss';
import { isAndroid, isIOS } from 'platform';
// import { addCategories, categories, enable } from 'trace';
// addCategories(categories.NativeLifecycle);
// addCategories(categories.ViewHierarchy);
// addCategories(categories.Layout);
// enable();

Vue.config.silent = !dev;
Vue.config['debug'] = dev;

import { fonticon, TNSFontIcon } from 'nativescript-fonticon';

import CollectionView from 'nativescript-collectionview/vue';
Vue.use(CollectionView);
import RadListViewPlugin from 'nativescript-ui-listview/vue';
Vue.use(RadListViewPlugin);

registerElement('MDCButton', () => require('nativescript-material-button').Button);
// registerElement('FloatingActionButton', () => require('nativescript-material-components/floatingactionbutton').FloatingActionButton);
// registerElement('MDCActivityIndicator', () => require('nativescript-material-components/activityindicator').ActivityIndicator);
registerElement('CardView', () => require('nativescript-material-cardview').CardView);
registerElement('Ripple', () => require('nativescript-material-ripple').Ripple);
registerElement('HTMLLabel', () => require('nativescript-htmllabel').Label);

import * as app from 'tns-core-modules/application';
import * as imageModule from 'nativescript-image';
registerElement('AImage', () => imageModule.Img);

app.on(app.launchEvent, () => imageModule.initialize({ isDownsampleEnabled: true }), imageModule.getImagePipeline().clearCaches());
app.on(app.exitEvent, args => imageModule.shutDown());

import Home from './components/Home.vue';

// Prints all icon classes loaded
// TNSFontIcon.debug = true;
TNSFontIcon.paths = {
    mdi: './assets/mdi.css'
};
TNSFontIcon.loadCss();
Vue.filter('fonticon', fonticon);

Vue.filter('uppercase', function(value) {
    if (!value) return '';
    value = value.toString();
    return value.toUpperCase();
});

Vue.prototype.$isAndroid = isAndroid;
Vue.prototype.$isIOS = isIOS;

Vue.prototype.$showError = function(err: Error) {
    console.log('showError', err, err.toString(), err['stack']);
    const message = typeof err === 'string' ? err : err.toString();
    return alert({
        title: Vue.prototype.$ltc('error'),
        okButtonText: Vue.prototype.$ltc('ok'),
        message
    });
};
Vue.prototype.$alert = function(message) {
    return alert({
        okButtonText: Vue.prototype.$ltc('ok'),
        message
    });
};

new Vue({
    render: h => {
        return h('frame', [h(Home)]);
    }
}).$start();
