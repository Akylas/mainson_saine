import Vue from 'vue';
declare module "vue/types/vue" {
    // 3. Declare augmentation for Vue
    interface Vue {

        $isAndroid: boolean
        $isIOS: boolean

        $showError(err: Error | string)
        $alert(message: string)
    }
}
