<template>
    <Page ref="page" class="page themedBack">
        <StackLayout>
            <StackLayout orientation="horizontal" class="actionBar">
                <MDCButton class="actionBarButton" variant="text" :text="'mdi-arrow-left' | fonticon" @tap="onTap('back', $event)" />
                <Label class="actionBarTitle" verticalAlignment="center" :text="'recettes' | uppercase" color="white" />
            </StackLayout>
            <CollectionView width="100%" height="100%" :items="dataItems" backgroundColor="#F4F4F4" :rowHeight="itemHeight" colWidth="50%">
                <v-template>
                    <GridLayout width="100%" height="100%" rows="*" columns="*">
                        <CardView margin="10" borderRadius="10" @tap="onNavigationItemTap(item)" :rippleColor="themeColor">
                            <StackLayout width="100%" height="100%" orientation="vertical">
                                <Image row="0" :height="itemWidth" :src="item.image" stretch="aspectFill" />
                                <HTMLLabel row="1" class="nunito" fontSize="15" width="100%" padding="5" color="black" :html="item.title" isUserInteractionEnabled="false" />
                            </StackLayout>
                        </CardView>
                    </GridLayout>
                </v-template>
            </CollectionView>
        </StackLayout>
    </Page>
</template>

<script lang="ts">
import BaseVueComponent from './BaseVueComponent'
import { Component } from 'vue-property-decorator'
import { screen } from 'platform';
import { ObservableArray } from 'data/observable-array/observable-array';
import { RecetteData } from '~/data/data';
import { EventData } from 'tns-core-modules/ui/page/page';
import { getRecettes } from '~/services/data.item.service';

@Component({})
export default class RecettesList extends BaseVueComponent {
    dataItems: ObservableArray<RecetteData> = new (ObservableArray as any)(getRecettes());;
    public itemWidth = (screen.mainScreen.widthDIPs - 20) / 2;
    public itemHeight = (screen.mainScreen.widthDIPs - 20) / 2 + 100;

    mounted() {
        super.mounted();
    }
    onTap = (command: string, args: EventData) => {
        switch (command) {
            case 'back': {
                this.$navigateBack();
            }
        }
    };

    public onNavigationItemTap(tappedItem) {
        import('~/components/Recette.vue').then(Recette => {
            this.$navigateTo(Recette.default, {
                animated: true,
                transitionAndroid: {
                    name: "slideTop",
                    duration: 200,
                    curve: "linear"
                },
                transitioniOS: {
                    name: "slideTop",
                    duration: 200,
                    curve: "linear"
                },
                props: {
                    recetteId: tappedItem.title
                }
            } as any);
        })
    }
}
</script>
