// const dev = TNS_ENV === 'development';
const dev = false;
import Vue from 'nativescript-vue';

import * as trace from '@nativescript/core/trace';
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
import { isAndroid, isIOS } from '@nativescript/core/platform';
// import { addCategories, categories, enable } from 'trace';
// addCategories(categories.NativeLifecycle);
// addCategories(categories.ViewHierarchy);
// addCategories(categories.Layout);
// enable();

Vue.config.silent = !dev;
Vue.config['debug'] = dev;

import CollectionView from 'nativescript-collectionview/vue';
Vue.use(CollectionView);
import {installMixins} from 'nativescript-material-core';
installMixins();
import { install as installBottomSheets } from 'nativescript-material-bottomsheet';
installBottomSheets();
Vue.registerElement('Button', () => require('nativescript-material-button').Button);
// registerElement('FloatingActionButton', () => require('nativescript-material-components/floatingactionbutton').FloatingActionButton);
// registerElement('MDCActivityIndicator', () => require('nativescript-material-components/activityindicator').ActivityIndicator);
Vue.registerElement('CardView', () => require('nativescript-material-cardview').CardView);
Vue.registerElement('Ripple', () => require('nativescript-material-ripple').Ripple);
import BottomSheetPlugin from 'nativescript-material-bottomsheet/vue';
Vue.use(BottomSheetPlugin);

// import { addCategories, enable } from '@nativescript/core/trace';
// import {CollectionViewTraceCategory} from 'nativescript-collectionview';
// addCategories(CollectionViewTraceCategory);
// enable();

import { Label, enableIOSDTCoreText } from 'nativescript-htmllabel';
enableIOSDTCoreText();
Vue.registerElement('Label', () => Label);

import * as imageModule from 'nativescript-image';
Vue.registerElement('Image', () => imageModule.Img);
imageModule.initialize({ isDownsampleEnabled: true });
// app.on(app.launchEvent, () => imageModule.initialize({ isDownsampleEnabled: true }), imageModule.getImagePipeline().clearCaches());
// app.on(app.exitEvent, args => imageModule.shutDown());

import Home from './components/Home.vue';

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
