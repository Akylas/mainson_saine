<template>
    <Page ref="page" class="page themedBack" @navigatingTo="onNavigatingTo">
        <GridLayout rows="auto,*">
            <GridLayout row="0" rows="50,*" columns="*,50">
                <AbsoluteLayout rowSpan="2" colSpan="2" :height="headerHeight">
                    <Image src="res://clouds" class="cloud1" isUserInteractionEnabled="false" left="-260" top="20" />
                    <Image ref="imageViewHelp" width="100%" height="100%" src="res://house_help" opacity="0" style="transform:scale(0.2,0.2);" />
                    <Image ref="imageView" width="100%" height="100%" src="res://house" />
                    <Image src="res://cloud1" class="cloud2" isUserInteractionEnabled="false" left="-110" top="10" />
                </AbsoluteLayout>
                <MDCButton row="0" col="1" top="0" padding="0" left="0" horizontalAlignment="right" :width="actionBarHeight" :height="actionBarHeight" fontSize="26" class="mdi" :text="'mdi-information-outline' | fonticon" color="white" @tap="onTap('help', $event)" variant="text" />
            </GridLayout>
            <AbsoluteLayout row="1">
                <CollectionView top="5" width="100%" height="100%" :items="dataItems" :backgroundColor="backgroundColor">
                    <v-template>
                        <GridLayout columns="50,*" height="60" width="100%" :backgroundColor="backgroundColor">
                            <Image col="0" :visibility="!!item.thumbnail ? 'visible' : 'collapsed'" :src="item.thumbnail" stretch="aspectFill" />
                            <Label col="0" :visibility="!!item.icon ? 'visible' : 'hidden'" class="mdi" :color="item.darkColor" fontSize="32" :text="item.icon | fonticon" verticalAlignment="center" horizontalAlignment="center" />
                            <Label col="1" padding="5" verticalAlignment="center" :color="item.darkColor" :text="item.title | uppercase" fontSize="18" class="nunitoblack" />
                            <CardView backgroundColor="transparent" colSpan="2" :rippleColor="item.darkColor" @tap="onNavigationItemTap(item)" />
                        </GridLayout>
                    </v-template>
                </CollectionView>
                <StackLayout width="100%" height="20" background="linear-gradient(to bottom, #D1EDF7, #D1EDF7, #00D1EDF7)" />
            </AbsoluteLayout>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
import BaseVueComponent from './BaseVueComponent'
import { Component } from 'vue-property-decorator'
import { isAndroid, screen } from 'platform';
import { ObservableArray } from 'data/observable-array/observable-array';
import { RoomData } from '~/data/data';
import { Image } from 'tns-core-modules/ui/image/image';
import { CubicBezierAnimationCurve } from 'tns-core-modules/ui/animation/animation';
import { EventData, Page, Color } from 'tns-core-modules/ui/page/page';
import { getRooms } from '~/services/data.item.service';
const TColor = require('tinycolor2');
import { screenWidthDips } from "../variables";


interface IRoomData extends RoomData {
    darkColor?: string
}

@Component({})
export default class Home extends BaseVueComponent {
    public backgroundColor: string;
    helpVisible = false;
    dataItems: ObservableArray<IRoomData>;
    public headerHeight = screenWidthDips * 0.8;

    constructor() {
        super();
        this.backgroundColor = TColor.mix(TColor(this.themeColor), TColor('#ffffff'), 50).toHexString();
        this.dataItems = new (ObservableArray as any)(
            getRooms().map((r: IRoomData) => { r.darkColor = this.getTitleColor(r.color).toHexString(); return r; }).concat([
                {
                    color: TColor(this.themeColor)
                        .lighten(10)
                        .toHexString(),
                    darkColor: this.getTitleColor(this.themeColor).toHexString(),
                    title: 'recettes',
                    icon: 'mdi-food-fork-drink'
                }
            ])
        );
    }
    mounted() {
        super.mounted();
    }
    onNavigatingTo() {
        if (isAndroid) {
            const page = this.page;
            page.androidStatusBarBackground = null;
            page.androidStatusBarBackground = new Color(this.darkColor);
        }
    }

    get imageView() {
        return (this.$refs.imageView as any).nativeView as Image;
    }
    get imageViewHelp() {
        return (this.$refs.imageViewHelp as any).nativeView as Image;
    }
    showHideHelp = () => {
        const curve = new CubicBezierAnimationCurve(0.8, 0.0, 0.2, 1.0);
        const viewIn = (this.helpVisible ? this.imageView : this.imageViewHelp);
        const viewOut = (this.helpVisible ? this.imageViewHelp : this.imageView);
        viewIn.animate({
            scale: { x: 1, y: 1 },
            opacity: 1,
            curve: curve,
            duration: 500
        });
        viewOut.animate({
            scale: { x: 0.2, y: 0.2 },
            opacity: 0,
            curve: curve,
            duration: 500
        });
        this.helpVisible = !this.helpVisible;
    };
    onTap = (command: string, args: EventData) => {
        console.log('onTap', command);

        switch (command) {
            case 'help':
                this.showHideHelp();
                break;
        }
    };

    getTitleColor(color: string) {
        return TColor(color).darken(30);
    }

    public onNavigationItemTap(tappedItem) {
        let title = tappedItem.title;
        if (title === 'recettes') {
            import('~/components/RecettesList.vue').then(RecettesList => {
                this.$navigateTo(RecettesList.default, {
                    animated: true,
                    transitionAndroid: {
                        name: "fade",
                        duration: 200,
                        curve: "linear"
                    },
                    transitioniOS: {
                        name: "fade",
                        duration: 200,
                        curve: "linear"
                    },
                } as any);
            })
        } else {
            import('~/components/Room.vue').then(Room => {
                this.$navigateTo(Room.default, {
                    animated: true,
                    transitionAndroid: {
                        name: "fade",
                        duration: 200,
                        curve: "linear"
                    },
                    transitioniOS: {
                        name: "fade",
                        duration: 200,
                        curve: "linear"
                    },
                    props: {
                        roomId: tappedItem.title,
                        _darkColor: tappedItem.darkColor,
                        _themeColor: tappedItem.color
                    },
                } as any);
            })
        }
    }
}
</script>
