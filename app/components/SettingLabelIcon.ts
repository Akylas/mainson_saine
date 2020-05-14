import Vue from 'nativescript-vue';
import { Component, Prop } from 'vue-property-decorator';
import { mdiFontFamily, primaryColor } from '~/variables';

@Component({
    template: /*html*/ `
    <GridLayout columns="16,*,auto,16" backgroundColor="white" rippleColor=${primaryColor} @tap="$emit('tap', $event)" rows="12,auto,12">
        <StackLayout row="1" col="1" verticalAlignment="center">
            <Label fontSize="17" :text="title" textWrap="true" verticalTextAlignment="top" maxLines="2" lineBreak="end" />
            <Label v-show="!!subtitle" fontSize="14" :text="subtitle" verticalTextAlignment="top" :color="subtitleColor" :maxLines="subtitleMaxLines" lineBreak="end" />
        </StackLayout>
        <Label row="1" col="2" v-show="!!icon" fontFamily="${mdiFontFamily}" fontSize="24" textAlignment="right" color="lightgray" :text="icon" verticalAlignment="center" />

    </GridLayout>`
})
export default class SettingLabelIcon extends Vue {
    @Prop({ type: String }) title: string;
    @Prop({ type: String }) subtitle: string;
    @Prop({ type: String }) icon: string;
    @Prop({ default: 'gray', type: String }) subtitleColor: string;
    @Prop({ default: 2, type: Number })
    subtitleMaxLines: number;
}
