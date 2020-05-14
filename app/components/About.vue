<template>
    <Page ref="page" class="page themedBack">
        <StackLayout backgroundColor="#F4F4F4">
            <StackLayout orientation="horizontal" class="actionBar">
                <Button class="actionBarButton" variant="text" text="mdi-arrow-left" @tap="onTap('back', $event)" />
                <Label class="actionBarTitle" verticalAlignment="center" :text="'à propos' | uppercase" color="white" />
            </StackLayout>
            <ScrollView>
                <StackLayout>
                    <SettingLabelIcon title="version" :subtitle="appVersion" />
                    <SettingLabelIcon
                        title="code source"
                        subtitle="obtenir le code source de l'application sur Github"
                        rightIcon="mdi-chevron-right"
                        @tap="onTap('github')"
                    />
                    <SettingLabelIcon
                        title="logiciel tiers"
                        subtitle="les logiciels que nous aimons et utilisons"
                        icon="mdi-chevron-right"
                        @tap="onTap('third_party')"
                    />
                    <SettingLabelIcon title="partager cette application" icon="mdi-chevron-right" @tap="onTap('share')" />
                    <SettingLabelIcon title="noter l'application" icon="mdi-chevron-right" @tap="onTap('review')" />
                </StackLayout>
            </ScrollView>
        </StackLayout>
    </Page>
</template>

<script lang="ts">
import Vue from 'nativescript-vue';
import { Component, Prop } from 'vue-property-decorator';
import { openUrl } from '@nativescript/core/utils/utils';
import BaseVueComponent from '~/components/BaseVueComponent';
import ThirdPartySoftwareBottomSheet from './ThirdPartySoftwareBottomSheet.vue';
import SettingLabelIcon from './SettingLabelIcon';
import { share } from '~/utils/share';
import InAppBrowser from 'nativescript-inappbrowser';
import { mdiFontFamily, primaryColor } from '~/variables';
import * as EInfo from 'nativescript-extendedinfo';


@Component({
    components: {
        SettingLabelIcon
    }
})
export default class About extends BaseVueComponent {
    mounted() {
        super.mounted();
    }

    get appVersion() {
        return EInfo.getVersionNameSync() + '.' + EInfo.getBuildNumberSync();
    }

    showThirdPartySoftwares() {}
    async openLink(url: string) {
        try {
            const available = await InAppBrowser.isAvailable();
            if (available) {
                const result = await InAppBrowser.open(url, {
                    // iOS Properties
                    dismissButtonStyle: 'close',
                    preferredBarTintColor: primaryColor,
                    preferredControlTintColor: 'white',
                    readerMode: false,
                    animated: true,
                    enableBarCollapsing: false,
                    // Android Properties
                    showTitle: true,
                    toolbarColor: primaryColor,
                    secondaryToolbarColor: 'white',
                    enableUrlBarHiding: true,
                    enableDefaultShare: true,
                    forceCloseOnRedirection: false
                });
            } else {
                openUrl(url);
            }
        } catch (error) {
            alert({
                title: 'Error',
                message: error.message,
                okButtonText: 'Ok'
            });
        }
    }
    onTap(command: string) {
        switch (command) {
            case 'back': {
                this.$navigateBack();
                return;
            }
            case 'github':
                this.openLink(GIT_URL);
                break;
            case 'share':
                share({
                    message: STORE_LINK
                });
                break;
            case 'review':
                openUrl(STORE_REVIEW_LINK);
                break;
            case 'third_party':
                this.$showBottomSheet(ThirdPartySoftwareBottomSheet, {
                    ignoreTopSafeArea: true,
                    trackingScrollView: 'trackingScrollView'
                });
                break;
        }
    }
}
</script>
