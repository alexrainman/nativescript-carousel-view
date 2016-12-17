
import view = require("ui/core/view");
import definition = require("nativescript-carousel-view");
import dependencyObservable = require("ui/core/dependency-observable");
import proxy = require("ui/core/proxy");
import observableArrayModule = require("data/observable-array");

export class CarouselView extends view.View implements definition.CarouselView {

    public static positionProperty = new dependencyObservable.Property(
        "position",
        "CarouselView",
        new proxy.PropertyMetadata(0)
        );

   public static templateSelectorProperty = new dependencyObservable.Property(
        "templateSelector",
        "CarouselView",
        new proxy.PropertyMetadata(null)
        );

   public static itemsSourceProperty = new dependencyObservable.Property(
        "itemsSource",
        "CarouselView",
        new proxy.PropertyMetadata(null)
        );

    public static interPageSpacingProperty = new dependencyObservable.Property(
        "interPageSpacing",
        "CarouselView",
        new proxy.PropertyMetadata(0)
        );

    public static interPageSpacingColorProperty = new dependencyObservable.Property(
        "interPageSpacingColor",
        "CarouselView",
        new proxy.PropertyMetadata("#FFFFFF")
        );

    public static orientationProperty = new dependencyObservable.Property(
        "orientation",
        "CarouselView",
        new proxy.PropertyMetadata("horizontal")
        );

    public static showIndicatorsProperty = new dependencyObservable.Property(
        "showIndicators",
        "CarouselView",
        new proxy.PropertyMetadata(true)
        );

    public static indicatorsTintColorProperty = new dependencyObservable.Property(
        "indicatorsTintColor",
        "CarouselView",
        new proxy.PropertyMetadata("#c0c0c0")
        );

    public static indicatorsCurrentPageColorProperty = new dependencyObservable.Property(
        "indicatorsCurrentPageColor",
        "CarouselView",
        new proxy.PropertyMetadata("#808080")
        );

    get position(): number {
        return this._getValue(CarouselView.positionProperty);
    }
    set position(value: number) {
        this._setValue(CarouselView.positionProperty, value);
    }

    get templateSelector(): definition.ITemplateSelector {
        return this._getValue(CarouselView.templateSelectorProperty);
    }
    set templateSelector(value: definition.ITemplateSelector) {
        this._setValue(CarouselView.templateSelectorProperty, value);
    }

    get itemsSource(): observableArrayModule.ObservableArray<any> {
        return this._getValue(CarouselView.itemsSourceProperty);
    }
    set itemsSource(value: observableArrayModule.ObservableArray<any>) {
        this._setValue(CarouselView.itemsSourceProperty, value);
    }

    get interPageSpacing(): number {
        return this._getValue(CarouselView.interPageSpacingProperty);
    }
    set interPageSpacing(value: number) {
        this._setValue(CarouselView.interPageSpacingProperty, value);
    }

    get interPageSpacingColor(): string {
        return this._getValue(CarouselView.interPageSpacingColorProperty);
    }
    set interPageSpacingColor(value: string) {
        this._setValue(CarouselView.interPageSpacingColorProperty, value);
    }

    get orientation(): string {
        return this._getValue(CarouselView.orientationProperty);
    }
    set orientation(value: string) {
        this._setValue(CarouselView.orientationProperty, value);
    }

    get showIndicators(): boolean {
        return this._getValue(CarouselView.showIndicatorsProperty);
    }
    set showIndicators(value: boolean) {
        this._setValue(CarouselView.showIndicatorsProperty, value);
    }

    get indicatorsTintColor(): string {
        return this._getValue(CarouselView.indicatorsTintColorProperty);
    }
    set indicatorsTintColor(value: string) {
        this._setValue(CarouselView.indicatorsTintColorProperty, value);
    }

    get indicatorsCurrentPageColor(): string {
        return this._getValue(CarouselView.indicatorsCurrentPageColorProperty);
    }
    set indicatorsCurrentPageColor(value: string) {
        this._setValue(CarouselView.indicatorsCurrentPageColorProperty, value);
    }

    public async insertPage(position: number, bindingContext: any) {}
    
    public async removePage(position: number) {}
    
    public setCurrentPage(position: number): void {}
}