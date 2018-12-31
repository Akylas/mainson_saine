<template>
    <Page ref="page" class="page">
        <GridLayout :rows="mainRows" iosOverflowSafeArea="false" backgroundColor="white">
            <AbsoluteLayout row=0 rowSpan="2">
                <GridLayout ref="topView" rows="*,51" columns="*" :height="headerHeight" backgroundColor="white" width="100%">
                    <AImage row="0" :src="roomData && roomData.thumbnail" stretch="aspectFill" />
                    <StackLayout row="1" orientation="horizontal" :backgroundColor="titleBackgroundColor" :paddingLeft="titleDelta*actionBarHeight + 15">
                        <Label :text="roomData && roomData.title | uppercase" :color="backButtonColor" fontSize="18" class="nunitoblack" verticalAlignment="center" />
                    </StackLayout>
                </GridLayout>
                <MDCButton class="actionBarButton" :text="'mdi-arrow-left' | fonticon" :rippleColor="'#88' + backButtonColor.slice(1)" :color="backButtonColor" @tap="onTap('back', $event)" variant="text" />
            </AbsoluteLayout>
            <CollectionView row="1" rowSpan="2" ref="listView" :items="dataItems" :itemTemplateSelector="templateSelector" backgroundColor="transparent" @scroll="onScroll($event)">
                <v-template name="level">
                    <GridLayout rows="10,20,auto,auto" columns="20,20,*" backgroundColor="white">
                        <Label col="1" row="1" class="mdi" :text="'mdi-numeric-' + item.level + '-box' | fonticon" :color="darkColor" verticalAlignment="top" />
                        <HTMLLabel fontSize="15" class="nunito" paddingTop="5" rowSpan="3" col="2" :html="item.text" verticalAlignment="top" />
                        <AImage row="3" col="2" :visibility="!!item.image ? 'visible' : 'collapsed'" :src="item.image" :aspectRatio="item.imageRatio" @tap="onImageTap($event, item.image)" />
                    </GridLayout>
                </v-template>
                <v-template name="header">
                    <StackLayout :height="roomImageHeight" width="100%" />
                </v-template>
                <v-template name="section">
                    <GridLayout rows="10,auto" columns="15,*" backgroundColor="white">
                        <Label row="1" col="1" :text="item.text" :color="darkColor" fontSize="18" class="nunitobold" borderBottomWidth="2" :borderBottomColor="darkColor" />
                    </GridLayout>
                </v-template>
                <v-template name="description">
                    <GridLayout rows="auto,15" columns="*" backgroundColor="white">
                        <HTMLLabel row="0" fontSize="15" class="nunito" padding="5" :html="item.text" />
                    </GridLayout>
                </v-template>
            </CollectionView>
            <GridLayout row="3" columns="20,*,*,*,20" rows="*" :backgroundColor="darkColor">
                <GridLayout v-for="(item, i) in ['novice', 'moyen', 'expert']" :key="item" row="0" :col="i+1" borderTopWidth="4" :borderColor="i+1 === currentLevel ? 'white':'transparent'" @tap="onSetCurrentLevel($event, i+1)">
                    <Label class="nunitobold" fontSize="18" :color="i+1 === currentLevel ? 'white':'#88ffffff'" :text="item" textAlignment="center" verticalAlignment="center" />
                </GridLayout>
            </GridLayout>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
import BaseVueComponent from './BaseVueComponent';
import { Component, Prop } from 'vue-property-decorator';
import { isAndroid, screen, isIOS } from 'tns-core-modules/platform';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { RoomData, LevelData } from '~/data/data';
import { Image } from 'tns-core-modules/ui/image/image';
import { CubicBezierAnimationCurve } from 'tns-core-modules/ui/animation/animation';
import { EventData, Page, Color, View, NavigatedData } from 'tns-core-modules/ui/page/page';
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures/gestures';
import { getRoomData } from '~/services/data.item.service';
import { CollectionViewItemEventData, CollectionView } from 'nativescript-collectionview';
import * as fileSystem from 'tns-core-modules/file-system';
import * as imageModule from 'nativescript-image';
const TColor = require('tinycolor2');

import { darkColor, backgroundColor, roomImageHeight, roomHeaderHeight, actionBarHeight } from '../variables';

const PhotoViewer = require('nativescript-photoviewer');

const photoViewer = new PhotoViewer();

@Component({})
export default class Room extends BaseVueComponent {
    public roomData: RoomData;
    public headerHeight = roomHeaderHeight;
    public roomImageHeight = roomImageHeight;
    public currentLevel = 1;
    public backButtonColor: string;
    public titleBackgroundColor = '#ffffff';
    public titleDelta = 0;
    public mainRows = `${actionBarHeight},${roomImageHeight},*,${actionBarHeight}`;
    @Prop({ type: String }) roomId: string;
    // @Prop({ type: String }) themeColor;
    // @Prop({ type: String }) darkColor;
    // @Prop({ type: String })
    // _themeColor;
    // @Prop({ type: String })
    // _darkColor;

    public dataItems: ObservableArray<any>;
    constructor() {
        super();
        // imageModule.getImagePipeline().clearCaches()
        // console.log('creating room', this.roomId, this.darkColor, this.themeColor);
        this.roomData = getRoomData(this.roomId);
        this.backButtonColor = this.darkColor;
        const data = this.roomData.data;
        const dataItems = (this.dataItems = new ObservableArray());
        dataItems.push({
            type: 'header',
            height: roomImageHeight
        });
        if (data.description) {
            dataItems.push({
                type: 'description',
                text: data.description
            });
        }
        data.sections.forEach(s => {
            if (s.title) {
                dataItems.push({
                    type: 'section',
                    text: s.title
                });
            }
            if (s.description) {
                dataItems.push({
                    type: 'description',
                    category: s.title,
                    text: s.description
                });
            }
            if (s.levels.length > 0) {
                dataItems.push(this.createLevelItem(s.title, s.levels, 0));
            }
        });
        // dataItems.forEach(d=>{
        //     console.log(d.type, d.category, d.text);
        // });
    }
    mounted() {
        super.mounted();
        this.page.backgroundColor = this.darkColor;
    }
    createLevelItem(category, levels: LevelData[], lindex) {
        const l = levels[lindex];
        return {
            type: 'level',
            // hidden: i > 0,
            category: category,
            level: lindex + 1,
            text: l.text,
            image: l.image,
            imageRatio: l.imageRatio
        };
    }

    get listView() {
        return (this.$refs.listView as any).nativeView as CollectionView;
    }
    get topView() {
        return (this.$refs.topView as any).nativeView as View;
    }
    templateSelector = (item: any, index: number, items: any) => {
        return item.type as string;
    };
    onScroll(event /*: ListViewScrollEventData*/) {
        // If the header content is still visiible
        let offset = event.scrollOffset;
        this.topView.height = Math.max(roomHeaderHeight - offset, actionBarHeight);
        if (offset >= roomImageHeight) {
            this.titleDelta = 1;
            this.backButtonColor = '#ffffff';
            this.titleBackgroundColor = this.darkColor;
        } else if (offset >= roomImageHeight - actionBarHeight) {
            const delta = (roomImageHeight - offset) / actionBarHeight;
            this.titleDelta = 1 - delta;
            this.backButtonColor = TColor.mix(TColor(this.darkColor), TColor('#ffffff'), (1 - delta) * 100).toHexString();
            this.titleBackgroundColor = TColor.mix(TColor(this.darkColor), TColor('#ffffff'), delta * 100).toHexString();
        } else {
            this.titleDelta = 0;
            this.backButtonColor = this.darkColor;
            this.titleBackgroundColor = '#ffffff';
        }
    }

    onImageTap(event, imageSrc: string) {
        console.log('onImageTap', imageSrc);
        const folder = fileSystem.knownFolders.currentApp();
        photoViewer.showViewer(['file://' + fileSystem.path.join(folder.path, imageSrc.substr(2))]);
    }
    handleSetCurrentLevel(level: number) {
        if (this.currentLevel !== level) {
            if (level <= this.currentLevel) {
                const count = this.dataItems.length;
                for (let index = count - 1; index >= 0; index--) {
                    const item = this.dataItems.getItem(index);
                    if (!!item.level && item.level > level) {
                        this.dataItems.splice(index, 1);
                    }
                }
            } else {
                let levelStartIndex = 0;
                this.roomData.data.sections.forEach(s => {
                    levelStartIndex = -1;
                    this.dataItems.forEach((d, i) => {
                        if (d.type === 'level' && d.category === s.title && d.level === this.currentLevel) {
                            levelStartIndex = i;
                        }
                    });
                    if (levelStartIndex === -1) {
                        return;
                    }
                    for (let index = 1; index <= level - this.currentLevel; index++) {
                        if (s.levels[this.currentLevel - 1 + index]) {
                            this.dataItems.splice(levelStartIndex + index, 0, this.createLevelItem(s.title, s.levels, this.currentLevel - 1 + index));
                        }
                    }
                });
            }
            this.currentLevel = level;
        }
    }
    onSetCurrentLevel(event, level: number) {
        if (isIOS) {
            (this.listView.ios as UICollectionView).performBatchUpdatesCompletion(() => {
                this.handleSetCurrentLevel(level);
            }, null);
        } else {
            this.handleSetCurrentLevel(level);
        }
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
