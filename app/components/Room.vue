<template>
    <Page ref="page" class="page" :backgroundColor="darkColor" :statusBarColor="darkColor" ios:barStyle="dark" :navigationBarColor="darkColor">
        <GridLayout :rows="mainRows" iosOverflowSafeArea="false" backgroundColor="white">
            <AbsoluteLayout row="0" rowSpan="2">
                <GridLayout
                    id="topView"
                    ref="topView"
                    :rows="`*,${actionBarHeight}`"
                    :height="headerHeight"
                    backgroundColor="white"
                    width="100%"
                >
                    <Pager row="0" :items="images" :backgroundColor="themeColor" showIndicator>
                        <v-template>
                            <GridLayout @tap="onRecetteTap(item)">
                                <!-- <MapComponent v-show="item.address && item.address.latitude" rowSpan="4" opacity="0.5" /> -->
                                <Image stretch="aspectFill" :src="item.image" width="100%" height="100%" />
                                <Label
                                    textAlignment="left"
                                    verticalAlignment="bottom"
                                    class="bottom-gradient"
                                    padding="10 10 30 10"
                                    fontSize="16"
                                    fontWeight="bold"
                                    color="white"
                                    :html="item.title"
                                />
                            </GridLayout>
                        </v-template>
                    </Pager>
                    <StackLayout
                        row="1"
                        orientation="horizontal"
                        :backgroundColor="titleBackgroundColor"
                        :paddingLeft="titleDelta * (40) + 15"
                    >
                        <Label
                            :text="roomData && roomData.title | uppercase"
                            :color="backButtonColor"
                            fontSize="18"
                            class="nunitoblack"
                            verticalAlignment="center"
                        />
                    </StackLayout>
                </GridLayout>
                <Button
                    class="actionBarButton"
                    text="mdi-arrow-left"
                    :height="actionBarHeight"
                    :rippleColor="'#88' + backButtonColor.slice(1)"
                    :color="backButtonColor"
                    @tap="onTap('back', $event)"
                    variant="text"
                />
            </AbsoluteLayout>
            <CollectionView
                row="1"
                rowSpan="2"
                ref="listView"
                :items="dataItems"
                :itemTemplateSelector="templateSelector"
                backgroundColor="transparent"
                @scroll="onScroll($event)"
            >
                <v-template name="level">
                    <GridLayout rows="10,20,auto,auto" columns="20,20,*" backgroundColor="white">
                        <Label
                            col="1"
                            row="1"
                            class="mdi"
                            :text="getLevelIcon(item.level)"
                            :color="darkColor"
                            verticalAlignment="top"
                        />
                        <Label fontSize="15" paddingTop="5" rowSpan="3" col="2" :html="item.text" verticalAlignment="top" />
                        <Image
                            row="3"
                            col="2"
                            :visibility="!!item.image ? 'visible' : 'collapsed'"
                            :src="item.image"
                            :aspectRatio="item.imageRatio"
                            @tap="onImageTap($event, item.image)"
                        />
                    </GridLayout>
                </v-template>
                <v-template name="header">
                    <DispatcherView id="dispatcherView" :height="roomImageHeight" width="100%" @loaded="onHeaderLoaded" exclusiveTouch/>
                </v-template>
                <v-template name="section">
                    <GridLayout rows="10,auto" columns="15,*" backgroundColor="white">
                        <Label
                            row="1"
                            col="1"
                            :text="item.text"
                            :color="darkColor"
                            fontSize="18"
                            class="nunitobold"
                            borderBottomWidth="2"
                            :borderBottomColor="darkColor"
                        />
                    </GridLayout>
                </v-template>
                <v-template name="description">
                    <GridLayout rows="auto,15" columns="*" backgroundColor="white">
                        <Label row="0" fontSize="15" padding="5" :html="item.text" />
                    </GridLayout>
                </v-template>
            </CollectionView>
            <GridLayout row="3" columns="20,*,*,*,20" rows="*" :backgroundColor="darkColor">
                <GridLayout
                    v-for="(item, i) in ['novice', 'moyen', 'expert']"
                    :key="item"
                    row="0"
                    :col="i + 1"
                    borderTopWidth="4"
                    :borderColor="i + 1 === currentLevel ? 'white' : 'transparent'"
                    @tap="onSetCurrentLevel($event, i + 1)"
                >
                    <Label
                        class="nunitoblack"
                        fontSize="18"
                        :color="i + 1 === currentLevel ? 'white' : '#88ffffff'"
                        :text="item"
                        textAlignment="center"
                        verticalAlignment="center"
                    />
                </GridLayout>
            </GridLayout>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
import BaseVueComponent from './BaseVueComponent';
import { Component, Prop } from 'vue-property-decorator';
import { isAndroid, screen, isIOS } from '@nativescript/core/platform';
import { ObservableArray } from '@nativescript/core/data/observable-array/observable-array';
import { RoomData, LevelData } from '~/data/data';
import { Image } from '@nativescript/core/ui/image/image';
import { CubicBezierAnimationCurve } from '@nativescript/core/ui/animation/animation';
import { EventData, Page, Color, View, NavigatedData } from '@nativescript/core/ui/page/page';
import { TouchGestureEventData } from '@nativescript/core/ui/gestures/gestures';
import { getRoomData } from '~/services/data.item.service';
import { CollectionViewItemEventData, CollectionView } from 'nativescript-collectionview';
import * as fileSystem from '@nativescript/core/file-system';
import * as imageModule from 'nativescript-image';
const TColor = require('tinycolor2');

import { darkColor, backgroundColor, roomImageHeight, roomHeaderHeight, actionBarHeight } from '../variables';

import { PhotoViewer, PhotoViewerOptions, PaletteType, NYTPhotoItem } from 'nativescript-photoviewer';
import { DispatcherView } from './DispatcherView';
const photoViewer = new PhotoViewer();

const levelIcons = ['mdi-numeric-0-box', 'mdi-numeric-1-box', 'mdi-numeric-2-box', 'mdi-numeric-3-box', 'mdi-numeric-4-box'];
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

    get images() {
        let result = [
            {
                image: this.roomData && this.roomData.thumbnail
            }
        ];
        if (this.roomData) {
            this.roomData.data.sections.forEach(s => {
                result.push(...s.recettes);
            });
        }
        return result;
    }
    mounted() {
        super.mounted();
    }
    onHeaderLoaded(e) {
        const headerView = e.object as DispatcherView;
        headerView.dispatcherView = this.topView;
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

    getLevelIcon(level: number) {
        return levelIcons[level];
    }

    get listView() {
        return (this.$refs.listView as any).nativeView as CollectionView;
    }
    get topView() {
        return (this.$refs.topView as any).nativeView as View;
    }
    templateSelector(item: any, index: number, items: any) {
        return item.type as string;
    }

    onRecetteTap(item) {
        if (item.title) {
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
                        recetteId: item.title
                    }
                } as any);
            });
        }
    }
    onScroll(event /*: ListViewScrollEventData*/) {
        // If the header content is still visiible
        let offset = event.scrollOffset;
        // the -1 is for edge case on android where a rounded issue might cause un unwanted pixel line
        this.topView.height = Math.max(roomHeaderHeight - offset, actionBarHeight -1);
        
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
        const folder = fileSystem.knownFolders.currentApp();
        photoViewer.showGallery(['file://' + fileSystem.path.join(folder.path, imageSrc.substr(2))]);
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
                            this.dataItems.splice(
                                levelStartIndex + index,
                                0,
                                this.createLevelItem(s.title, s.levels, this.currentLevel - 1 + index)
                            );
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
