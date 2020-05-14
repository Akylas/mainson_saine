<template>
    <Page ref="page" class="page themedBack">
        <StackLayout>
            <StackLayout orientation="horizontal" class="actionBar">
                <Button class="actionBarButton" variant="text" text="mdi-arrow-left" @tap="onTap('back', $event)" />
                <Label class="actionBarTitle" verticalAlignment="center" :text="'recettes' | uppercase" color="white" />
            </StackLayout>
            <CollectionView width="100%" height="100%" :items="dataItems" backgroundColor="#F4F4F4" :rowHeight="itemHeight" colWidth="49.8%" :itemIdGenerator="(item,i)=>i">
                <v-template>
                    <GridLayout width="100%" height="100%" rows="*" columns="*">
                        <CardView margin="10" borderRadius="4" @tap="onNavigationItemTap(item)" :rippleColor="themeColor">
                            <StackLayout width="100%" height="100%" orientation="vertical" isUserInteractionEnabled="false">
                                <Image row="0" borderRadius="4 4 0 0" :height="itemWidth" :src="item.image" stretch="aspectFill" fadeDuration="200"/>
                                <Label row="1" fontSize="15" width="100%" padding="5" color="black" :html="item.title" isUserInteractionEnabled="false" backgroundColor="transparent" />
                            </StackLayout>
                        </CardView>
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
import { ObservableArray } from '@nativescript/core/data/observable-array/observable-array';
import { RecetteData } from '~/data/data';
import { EventData } from '@nativescript/core/ui/page/page';
import { getRecettes } from '~/services/data.item.service';

@Component({})
export default class RecettesList extends BaseVueComponent {
    dataItems: ObservableArray<RecetteData> = new ObservableArray();
    public itemWidth = (screen.mainScreen.widthDIPs - 20) / 2;
    public itemHeight = (screen.mainScreen.widthDIPs - 20) / 2 + 100;
    constructor() {
        super();
        this.themeColor = this.darkColor;
    }

    mounted() {
        super.mounted();
        this.dataItems = new ObservableArray(getRecettes());
    }
    onTap(command: string, args: EventData) {
        switch (command) {
            case 'back': {
                this.$navigateBack();
            }
        }
    }
    // onNavigatedTo() {
    //    this.dataItems = new ObservableArray(getRecettes());
    // }

    public onNavigationItemTap(tappedItem) {
        import('~/components/Recette.vue').then(Recette => {
            this.$navigateTo(Recette.default, {
                animated: true,
                transitionAndroid: {
                    name: 'slideTop',
                    duration: 200,
                    curve: 'linear'
                },
                transitioniOS: {
                    name: 'slideTop',
                    duration: 200,
                    curve: 'linear'
                },
                props: {
                    recetteId: tappedItem.title
                }
            } as any);
        });
    }
}
</script>
