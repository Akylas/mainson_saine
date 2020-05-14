import { locals } from './variables.module.scss';
import { screen } from '@nativescript/core/platform';

export const primaryColor: string = locals.primaryColor;
export const darkColor: string = locals.darkColor;
export const backgroundColor: string = locals.backgroundColor;
export const actionBarHeight: number = parseFloat(locals.actionBarHeight);
export const actionBarButtonHeight: number = parseFloat(locals.actionBarButtonHeight);
export const screenHeightDips = screen.mainScreen.heightDIPs;
export const screenWidthDips = screen.mainScreen.widthDIPs;
export const mdiFontFamily: string = locals.mdiFontFamily;
export const nunitoFontFamily: string = locals.nunitoFontFamily;

export const roomImageHeight = Math.round(screenHeightDips * 0.25);
export const roomHeaderHeight = roomImageHeight + actionBarHeight;
