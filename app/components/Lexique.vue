<template>
    <Page ref="page" class="page themedBack" @navigatedTo="onNavigatedTo">
        <StackLayout backgroundColor="#F4F4F4">
            <StackLayout orientation="horizontal" class="actionBar">
                <Button class="actionBarButton" variant="text" text="mdi-arrow-left" @tap="onTap('back', $event)" />
                <Label class="actionBarTitle" verticalAlignment="center" :text="'lexique' | uppercase" color="white" />
            </StackLayout>
            <CollectionView
                width="100%"
                height="100%"
                :items="dataItems"
                :itemTemplateSelector="templateSelector"
                :itemIdGenerator="(item, i) => i"
            >
                <v-template name="section">
                    <GridLayout rows="10,auto" columns="15,*" backgroundColor="white">
                        <Label
                            row="1"
                            col="1"
                            :text="item.name"
                            :color="darkColor"
                            fontSize="18"
                            class="nunitobold"
                            borderBottomWidth="2"
                            :borderBottomColor="darkColor"
                        />
                    </GridLayout>
                </v-template>
                <v-template name="item">
                    <GridLayout backgroundColor="white" :rippleColor="themeColor" @tap="onNavigationItemTap(item)">
                        <Label padding="10" verticalAlignment="center" :text="item.name" fontSize="18" color="#666"></Label>
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
import { EventData, NavigatedData, Observable } from '@nativescript/core/ui/page/page';
import * as http from '@nativescript/core/http';
import * as fileSystem from '@nativescript/core/file-system';

interface Data {}

function mergeData(last, newObj) {
    const keys = Object.keys(last)
        .concat(Object.keys(newObj))
        .filter((v, i, a) => a.indexOf(v) === i);
    keys.forEach(k => {
        if (last[k] !== newObj[k]) {
            if (last[k] === undefined) {
                last[k] = newObj[k];
            } else if (newObj[k]) {
                last[k] = (Array.isArray(last[k]) ? last[k] : [last[k]]).concat(newObj[k]);
            }
        }
    });
    return last;
}

@Component({})
export default class Lexique extends BaseVueComponent {
    dataItems: ObservableArray<Data> = new ObservableArray();
    constructor() {
        super();
        this.themeColor = this.darkColor;
    }

    mounted() {
        super.mounted();
        this.refresh();
    }
    refresh() {
        const folder = fileSystem.knownFolders.currentApp();
        folder
            .getFile('assets/lexique.json')
            .readText()
            .then(function(content) {
                return JSON.parse(content);
            })
            // http.getJSON('file://' + fileSystem.path.join(folder.path, 'assets/lexique.json'))
            .then(r => {
                // console.log(r);
                const keys = Object.keys(r);
                const items = [];
                keys.forEach(k => {
                    const values = r[k];
                    items.push({
                        template: 'section',
                        name: k
                    });
                    let lastValue;
                    values.forEach(v => {
                        if (lastValue && lastValue.name === v['Agent pathogène']) {
                            lastValue.data = mergeData(lastValue.data, v);
                            return;
                        }
                        const toAdd = {
                            template: 'item',
                            name: v['Agent pathogène'],
                            data: v
                        };
                        items.push(toAdd);
                        lastValue = toAdd;
                    });
                });
                return items;
            })
            .then(items => {
                this.dataItems = new ObservableArray(items);
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
    templateSelector(item, index, items) {
        return item.template;
    }

    public onNavigationItemTap(tappedItem) {
        import('~/components/LexiqueData.vue').then(LexiqueData => {
            this.$navigateTo(LexiqueData.default, {
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
                    lexiqueData: tappedItem.data
                }
            } as any);
        });
    }
}
</script>
