<template>
    <Page ref="page" class="page">
        <StackLayout backgroundColor="white" iosOverflowSafeArea="false">
            <AbsoluteLayout>
                <GridLayout :rows="'*,auto'" columns="*" :height="headerHeight" backgroundColor="white" width="100%">
                    <AImage row="0" :src="recetteData.image" stretch="aspectFill" />
                    <StackLayout row="1" orientation="horizontal" :backgroundColor="titleBackgroundColor" :paddingLeft="titleDelta*actionBarHeight + 15">
                        <HTMLLabel class="nunito" padding="5" fontSize="20" :html="recetteData.title" :color="backButtonColor" verticalAlignment="center" />
                    </StackLayout>
                </GridLayout>
                <MDCButton class="actionBarButton" :text="'mdi-arrow-left' | fonticon" :rippleColor="'#88' + backButtonColor.slice(1)" :color="backButtonColor" @tap="onTap('back', $event)" variant="text" />
            </AbsoluteLayout>
            <ScrollView>
                <HTMLLabel class="nunito" padding="5" fontSize="15" :html="recetteData.text" />
            </ScrollView>
        </StackLayout>
    </Page>
</template>

<script lang="ts">
import BaseVueComponent from './BaseVueComponent';
import { Component, Prop } from 'vue-property-decorator';
import { screen } from 'platform';
import { ObservableArray } from 'data/observable-array/observable-array';
import { RecetteData } from '~/data/data';
import { Image } from 'tns-core-modules/ui/image/image';
import { EventData } from 'tns-core-modules/ui/page/page';
import { getRecetteData } from '~/services/data.item.service';

import { actionBarHeight, backgroundColor, darkColor, roomHeaderHeight } from '../variables';

@Component({})
export default class Recette extends BaseVueComponent {
    recetteData: RecetteData;
    headerHeight = roomHeaderHeight;
    backButtonColor = darkColor;
    titleBackgroundColor = backgroundColor;
    titleDelta = 0;
    @Prop({ type: String })
    recetteId: string;
    public dataItems: ObservableArray<any>;
    constructor() {
        super();
        this.themeColor = this.darkColor;
        this.recetteData = getRecetteData(this.recetteId);
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
