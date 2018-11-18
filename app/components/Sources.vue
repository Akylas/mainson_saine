<template>
    <Page ref="page" class="page themedBack" @navigatedTo="onNavigatedTo">
        <StackLayout backgroundColor="#F4F4F4">
            <StackLayout orientation="horizontal" class="actionBar">
                <MDCButton class="actionBarButton" variant="text" :text="'mdi-arrow-left' | fonticon" @tap="onTap('back', $event)" />
                <Label class="actionBarTitle" verticalAlignment="center" :text="'sources' | uppercase" color="white" />
            </StackLayout>
            <RadListView width="100%" height="100%" :items="dataItems">
                <v-template>
                    <GridLayout backgroundColor="white">
                        <GridLayout columns="*,auto" orientation="horizontal" padding="10">
                            <Label col="0" verticalAlignment="center" :text="item.name" fontSize="18" class="nunito" color="#666" />
                            <Label col="1" v-show="!!item.url" class="mdi" :text="'mdi-chevron-right' | fonticon" fontSize="26" color="gray" />
                        </GridLayout>
                        <Ripple :rippleColor="themeColor" @tap="onNavigationItemTap(item)" />
                    </GridLayout>
                </v-template>
            </RadListView>
        </StackLayout>
    </Page>
</template>

<script lang="ts">
import BaseVueComponent from './BaseVueComponent';
import { Component, Prop } from 'vue-property-decorator';
import { screen } from 'tns-core-modules/platform';
import { openUrl } from 'tns-core-modules/utils/utils';
import { ObservableArray } from 'data/observable-array/observable-array';
import { EventData, NavigatedData, Observable } from 'tns-core-modules/ui/page/page';
import * as http from 'tns-core-modules/http';
import * as fileSystem from 'tns-core-modules/file-system';

@Component({})
export default class Sources extends BaseVueComponent {
    dataItems: ObservableArray<{ name?: string; url?: string }> = new ObservableArray();
    constructor() {
        super();
        this.themeColor = this.darkColor;
    }

    mounted() {
        super.mounted();
    }
    refresh() {
        const folder = fileSystem.knownFolders.currentApp();

        folder.getFile('assets/sources.json').readText().then(function (content) {
            return JSON.parse(content);
        })
        // http.getJSON('file://' + fileSystem.path.join(folder.path, 'assets/sources.json'))
            .then(r => {
                this.dataItems = new ObservableArray(r);
            })
            .catch(err => {
                console.log(err);
            });
    }
    onNavigatedTo(args: NavigatedData) {
        if (!args.isBackNavigation) {
            this.refresh();
        }
    }
    onTap(command: string, args: EventData) {
        switch (command) {
            case 'back': {
                this.$navigateBack();
            }
        }
    }
    public onNavigationItemTap(tappedItem) {
        if (tappedItem.url) {
            openUrl(tappedItem.url);
        }
    }
}
</script>
