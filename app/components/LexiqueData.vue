<template>
    <Page ref="page" class="page">
        <GridLayout rows="auto,*" backgroundColor="white" iosOverflowSafeArea="false">
            <StackLayout row="0" orientation="horizontal" :backgroundColor="darkColor">
                <MDCButton class="actionBarButton" variant="text" :text="'mdi-arrow-left' | fonticon" @tap="onTap('back', $event)" />
                <Label class="actionBarTitle" verticalAlignment="center" :text="lexiqueData['Agent pathogène']" color="white" />
            </StackLayout>
            <ScrollView  row="1" >
                <StackLayout>
                <StackLayout padding="15 15 0 15" v-for="(key, index) in Object.keys(lexiqueData).filter(k=>k !== 'Agent pathogène')" :key="key">
                     <Label :text="key" :color="darkColor" fontSize="18" class="nunitobold" borderBottomWidth="2" :borderBottomColor="darkColor"/>
                    <HTMLLabel fontSize="15" class="nunito" padding="5" :html="Array.isArray(lexiqueData[key])?lexiqueData[key].join(', '):lexiqueData[key]" />
                </StackLayout>
                </StackLayout>
            </ScrollView>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
import BaseVueComponent from './BaseVueComponent';
import { Component, Prop } from 'vue-property-decorator';
import { screen } from 'platform';
import { ObservableArray } from 'data/observable-array/observable-array';
import { Image } from 'tns-core-modules/ui/image/image';
import { EventData } from 'tns-core-modules/ui/page/page';

import { actionBarHeight, backgroundColor, darkColor, roomHeaderHeight } from '../variables';

interface LexiqueItemData {
    'Agent pathogène': string;
    'Voie de contamination': string;
    Localisation: string;
    "Type d'effet secondaire": string;
    Cible: string;
    'Effet sanitaire': string;
}

@Component({})
export default class LexiqueData extends BaseVueComponent {
    headerHeight = roomHeaderHeight;
    backButtonColor = darkColor;
    titleBackgroundColor = backgroundColor;
    @Prop()
    public lexiqueData: LexiqueItemData;
    constructor() {
        super();
        this.themeColor = this.darkColor;
    }
    mounted() {
        super.mounted();
    }
    onTap(command: string, args: EventData) {
        switch (command) {
            case 'back': {
                this.$navigateBack();
            }
        }
    }
}
</script>
