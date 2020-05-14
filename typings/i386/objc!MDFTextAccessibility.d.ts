
declare class MDFTextAccessibility extends NSObject {

	static alloc(): MDFTextAccessibility; // inherited from NSObject

	static contrastRatioForTextColorOnBackgroundColor(textColor: UIColor, backgroundColor: UIColor): number;

	static isLargeForContrastRatios(font: UIFont): boolean;

	static minAlphaOfTextColorOnBackgroundColorOptions(textColor: UIColor, backgroundColor: UIColor, options: MDFTextAccessibilityOptions): number;

	static new(): MDFTextAccessibility; // inherited from NSObject

	static textColorFromChoicesOnBackgroundColorOptions(choices: NSArray<UIColor> | UIColor[], backgroundColor: UIColor, options: MDFTextAccessibilityOptions): UIColor;

	static textColorOnBackgroundColorTargetTextAlphaFont(backgroundColor: UIColor, targetTextAlpha: number, font: UIFont): UIColor;

	static textColorOnBackgroundColorTargetTextAlphaOptions(backgroundColor: UIColor, targetTextAlpha: number, options: MDFTextAccessibilityOptions): UIColor;

	static textColorOnBackgroundImageInRegionTargetTextAlphaFont(backgroundImage: UIImage, region: CGRect, targetTextAlpha: number, font: UIFont): UIColor;

	static textColorPassesOnBackgroundColorOptions(textColor: UIColor, backgroundColor: UIColor, options: MDFTextAccessibilityOptions): boolean;
}

declare const enum MDFTextAccessibilityOptions {

	None = 0,

	LargeFont = 1,

	PreserveAlpha = 2,

	PreferDarker = 4,

	PreferLighter = 8,

	EnhancedContrast = 16
}

declare var MDFTextAccessibilityVersionNumber: number;

declare var MDFTextAccessibilityVersionString: interop.Reference<number>;
