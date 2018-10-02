// require('./ts_helpers');
import Vue, { registerElement } from "nativescript-vue";

import "./styles.scss";
import { isAndroid, isIOS } from "platform";

// if (TNS_ENV !== "production") {
//   import("nativescript-vue-devtools").then(VueDevtools => Vue.use(VueDevtools));
// }

// Prints Vue logs when --env.production is *NOT* set while building
// Vue.config.silent = (TNS_ENV === 'production')
// Vue.config['debug'] = true
// Vue.config.silent = false
Vue.config.silent = true

import { fonticon, TNSFontIcon } from "nativescript-fonticon";

import { Label as HTMLLabel } from "nativescript-htmllabel/label";
import { Button as MDCButton } from "nativescript-material-components/button";
import { CardView } from "nativescript-material-components/cardview";

import CollectionView from 'nativescript-collectionview/vue';

Vue.use(CollectionView);
import Home from "./components/Home.vue";
registerElement("MDCButton", () => MDCButton);
registerElement("HTMLLabel", () => HTMLLabel);
registerElement("CardView", () => CardView);

// Prints all icon classes loaded
// TNSFontIcon.debug = true;
TNSFontIcon.paths = {
  mdi: "./assets/mdi.css"
};
TNSFontIcon.loadCss();
Vue.filter("fonticon", fonticon);

Vue.filter('uppercase', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.toUpperCase();
})

Vue.prototype.$isAndroid = isAndroid;
Vue.prototype.$isIOS = isIOS;

new Vue({
  render: h => {
    return h("frame", [h(Home)]);
  }
}).$start();