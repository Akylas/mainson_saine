/// <reference path="./node_modules/tns-platform-declarations/ios.d.ts" />
/// <reference path="./node_modules/tns-platform-declarations/android-26.d.ts" />
/// <reference path="./vue.shim.d.ts" />

declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
declare module "*.scss";

declare const TNS_ENV;
declare const GIT_URL: string;
declare const STORE_LINK: string;
declare const STORE_REVIEW_LINK: string;

declare const gVars: {
  sentry: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  platform: 'ios' | 'android';
};