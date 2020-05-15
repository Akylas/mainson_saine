<template>
    <Page ref="page" class="page themedBack" @navigatedTo="onNavigatedTo">
        <StackLayout backgroundColor="#F4F4F4">
            <StackLayout orientation="horizontal" class="actionBar">
                <Button class="actionBarButton" variant="text" text="mdi-arrow-left" @tap="onTap('back', $event)" />
                <Label class="actionBarTitle" verticalAlignment="center" :text="'sources' | uppercase" color="white" />
            </StackLayout>
            <CollectionView width="100%" height="100%" :items="dataItems" :itemIdGenerator="(item,i)=>i">
                <v-template>
                    <GridLayout backgroundColor="white" @tap="onNavigationItemTap(item)">
                        <GridLayout columns="*,auto" orientation="horizontal" padding="10">
                            <Label col="0" verticalAlignment="center" :text="item.name" fontSize="18" color="#666" />
                            <Label col="1" v-show="!!item.url" class="mdi" text="mdi-chevron-right" fontSize="26" color="gray" />
                        </GridLayout>
                    </GridLayout>
                </v-template>
            </CollectionView>
        </StackLayout>
    </Page>
</template>

<script lang="ts">
import BaseVueComponent from './BaseVueComponent';
import { Component, Prop } from 'vue-property-decorator';
import { screen } from '@nativescript/core/platform';
import { openUrl } from '@nativescript/core/utils/utils';
import { ObservableArray } from '@nativescript/core/data/observable-array/observable-array';
import { EventData, NavigatedData, Observable } from '@nativescript/core/ui/page/page';
import * as fileSystem from '@nativescript/core/file-system';
import InAppBrowser from 'nativescript-inappbrowser';
import { darkColor, primaryColor } from '~/variables';

@Component({})
export default class Sources extends BaseVueComponent {
    dataItems: ObservableArray<{ name?: string; url?: string }> = new ObservableArray();
    constructor() {
        super();
        this.themeColor = this.darkColor;
    }

    mounted() {
        super.mounted();
        this.refresh();
    }
    async openLink(url: string) {
        try {
            const available = await InAppBrowser.isAvailable();
            if (available) {
                const result = await InAppBrowser.open(url, {
                    // iOS Properties
                    dismissButtonStyle: 'close',
                    preferredBarTintColor: darkColor,
                    preferredControlTintColor: 'white',
                    readerMode: false,
                    animated: true,
                    // modalPresentationStyle: 'fullScreen',
                    // modalTransitionStyle: 'partialCurl',
                    // modalEnabled: true,
                    enableBarCollapsing: false,
                    // Android Properties
                    showTitle: true,
                    toolbarColor: darkColor,
                    secondaryToolbarColor: 'white',
                    enableUrlBarHiding: true,
                    enableDefaultShare: true,
                    forceCloseOnRedirection: false
                    // Specify full animation resource identifier(package:anim/name)
                    // or only resource name(in case of animation bundled with app).
                    // animations: {
                    //     startEnter: 'slide_in_right',
                    //     startExit: 'slide_out_left',
                    //     endEnter: 'slide_in_left',
                    //     endExit: 'slide_out_right'
                    // },
                    // headers: {
                    //     'my-custom-header': 'my custom header value'
                    // }
                });
                // alert({
                //     title: 'Response',
                //     message: JSON.stringify(result),
                //     okButtonText: 'Ok'
                // });
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
    refresh() {
        const folder = fileSystem.knownFolders.currentApp();

        folder.getFile('assets/sources.json').readText().then(function (content) {
            return JSON.parse(content);
        })
            .then(r => {
                this.dataItems = new ObservableArray(r);
            })
            .catch(err => {
                console.log(err);
            });
    }
    onNavigatedTo(args: NavigatedData) {
        // if (!args.isBackNavigation) {
        //     this.refresh();
        // }
    }
    onTap(command: string, args: EventData) {
        switch (command) {
            case 'back': {
                this.$navigateBack();
            }
        }
    }
    public onNavigationItemTap(tappedItem) {
        console.log('onNavigationItemTap', tappedItem)
        if (tappedItem.url) {
                     this.openLink(tappedItem.url);
        }
    }
}
</script>
