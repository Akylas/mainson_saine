<template>
    <Page ref="page" class="page themedBack" @navigatingTo="onNavigatingTo" @navigatedTo="onNavigatedTo">
        <GridLayout rows="auto,*" iosOverflowSafeArea="false">
            <GridLayout row="0" rows="50,*" columns="*,50">
                <AbsoluteLayout rowSpan="2" colSpan="2" :height="headerHeight">
                    <Image src="res://clouds" class="cloud1" isUserInteractionEnabled="false" left="-260" top="20" />
                    <Image ref="imageViewHelp" width="100%" height="100%" src="res://house_help" opacity="0" style="transform:scale(0.2,0.2);" stretch="fitCenter" />
                    <Image ref="imageView" width="100%" height="100%" src="res://house" stretch="fitCenter" fadeDuration="200" />
                    <Image src="res://cloud1" class="cloud2" isUserInteractionEnabled="false" left="-110" top="10" />
                </AbsoluteLayout>
                <Button row="0" col="1" class="actionBarButton" text="mdi-information-outline" @tap="onTap('help', $event)" variant="text" />
            </GridLayout>
            <AbsoluteLayout row="1">
                <CollectionView top="10" width="100%" height="100%" rowHeight="60" :items="dataItems" :backgroundColor="backgroundColor" :itemIdGenerator="(item,i)=>i">
                    <v-template>
                        <GridLayout columns="50,*" width="100%" :backgroundColor="backgroundColor" :rippleColor="item.darkColor" @tap="onNavigationItemTap(item)">
                            <Image col="0" :visibility="!!item.thumbnail ? 'visible' : 'collapsed'" :src="item.thumbnail" stretch="aspectFill" isUserInteractionEnabled="false" />
                            <Label
                                col="0"
                                :visibility="!!item.icon ? 'visible' : 'hidden'"
                                class="mdi"
                                :color="item.darkColor"
                                fontSize="32"
                                :text="item.icon | fonticon"
                                verticalAlignment="center"
                                horizontalAlignment="center"
                                isUserInteractionEnabled="false"
                            />
                            <Label
                                col="1"
                                padding="5"
                                verticalAlignment="center"
                                :color="item.darkColor"
                                :text="item.title | uppercase"
                                fontSize="18"
                                class="nunitoblack"
                                isUserInteractionEnabled="false"
                            />
                            <!-- <Ripple colSpan="2" /> -->
                        </GridLayout>
                    </v-template>
                </CollectionView>
                <StackLayout width="100%" height="20" background="linear-gradient(to bottom, #D1EDF7, #D1EDF7, #00D1EDF7)" />
            </AbsoluteLayout>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
import BaseVueComponent from './BaseVueComponent';
import { Component, Prop } from 'vue-property-decorator';
import { isAndroid, screen } from '@nativescript/core/platform';
import { GC } from '@nativescript/core/utils/utils';
import { profile } from '@nativescript/core/profiling';
import { ObservableArray } from '@nativescript/core/data/observable-array';
import { RoomData } from '~/data/data';
import { Image } from '@nativescript/core/ui/image/image';
import { CubicBezierAnimationCurve } from '@nativescript/core/ui/animation/animation';
import { EventData, Page, Color } from '@nativescript/core/ui/page';
import { getRooms } from '~/services/data.item.service';
const TColor = require('tinycolor2');
import { screenWidthDips } from '../variables';
import Room from './Room.vue';
import RecettesList from './RecettesList.vue';
import Lexique from './Lexique.vue';
import Sources from './Sources.vue';
import About from './About.vue';

interface IRoomData extends RoomData {
    darkColor?: string;
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
            getRooms()
                .map((r: IRoomData) => {
                    r.darkColor = this.getTitleColor(r.color).toHexString();
                    return r;
                })
                .concat([
                    {
                        color: TColor(this.themeColor)
                            .lighten(10)
                            .toHexString(),
                        darkColor: this.getTitleColor(this.themeColor).toHexString(),
                        title: 'recettes',
                        icon: 'mdi-food-fork-drink'
                    },
                    {
                        color: TColor(this.themeColor)
                            .lighten(10)
                            .toHexString(),
                        darkColor: this.getTitleColor(this.themeColor).toHexString(),
                        title: 'lexique',
                        icon: 'mdi-book-open-variant'
                    },
                    {
                        color: TColor(this.themeColor)
                            .lighten(10)
                            .toHexString(),
                        darkColor: this.getTitleColor(this.themeColor).toHexString(),
                        title: 'sources',
                        icon: 'mdi-link-variant'
                    },
                    {
                        color: TColor(this.themeColor)
                            .lighten(10)
                            .toHexString(),
                        darkColor: this.getTitleColor(this.themeColor).toHexString(),
                        title: 'about',
                        icon: 'mdi-information'
                    }
                ])
        );
    }
    mounted() {
        super.mounted();
    }
    onNavigatedTo() {
        GC();
    }
    onNavigatingTo() {
        // if (isAndroid) {
        //     const page = this.page;
        //     page.androidStatusBarBackground = null;
        //     page.androidStatusBarBackground = new Color(this.darkColor);
        // }
    }

    get imageView() {
        return (this.$refs.imageView as any).nativeView as Image;
    }
    get imageViewHelp() {
        return (this.$refs.imageViewHelp as any).nativeView as Image;
    }
    showHideHelp = () => {
        const curve = new CubicBezierAnimationCurve(0.8, 0.0, 0.2, 1.0);
        const viewIn = this.helpVisible ? this.imageView : this.imageViewHelp;
        const viewOut = this.helpVisible ? this.imageViewHelp : this.imageView;
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
    onTap(command: string, args: EventData) {
        console.log('onTap', command);

        switch (command) {
            case 'help':
                this.showHideHelp();
                break;
        }
    }

    getTitleColor(color: string) {
        return TColor(color).darken(30);
    }
    showError(err) {
        this.$showError(err);
    }
     onNavigationItemTap(tappedItem) {
        // alert('test');
        let title = tappedItem.title;
        if (title === 'recettes') {
            this.$navigateTo(RecettesList, {
                animated: true,
                transitionAndroid: {
                    name: 'fade',
                    duration: 200,
                    curve: 'linear'
                },
                transitioniOS: {
                    name: 'fade',
                    duration: 200,
                    curve: 'linear'
                }
            } as any);
        } else if (title === 'lexique') {
            this.$navigateTo(Lexique, {
                animated: true,
                transitionAndroid: {
                    name: 'fade',
                    duration: 200,
                    curve: 'linear'
                },
                transitioniOS: {
                    name: 'fade',
                    duration: 200,
                    curve: 'linear'
                }
            } as any);
        } else if (title === 'sources') {
            this.$navigateTo(Sources, {
                animated: true,
                transitionAndroid: {
                    name: 'fade',
                    duration: 200,
                    curve: 'linear'
                },
                transitioniOS: {
                    name: 'fade',
                    duration: 200,
                    curve: 'linear'
                }
            } as any);
        } else if (title === 'about') {
            console.log('opening about')
            this.$navigateTo(About, {
                animated: true,
                transitionAndroid: {
                    name: 'fade',
                    duration: 200,
                    curve: 'linear'
                },
                transitioniOS: {
                    name: 'fade',
                    duration: 200,
                    curve: 'linear'
                }
            } as any).catch(this.showError);
        } else {
            console.log('opening room', tappedItem.title, tappedItem.color, tappedItem.darkColor);
            this.$navigateTo(Room, {
                animated: true,
                transitionAndroid: {
                    name: 'fade',
                    duration: 200,
                    curve: 'linear'
                },
                transitioniOS: {
                    name: 'fade',
                    duration: 200,
                    curve: 'linear'
                },
                props: {
                    roomId: tappedItem.title,
                    darkColor: tappedItem.darkColor + '',
                    themeColor: tappedItem.color + ''
                }
            } as any);
        }
    }
}
</script>
