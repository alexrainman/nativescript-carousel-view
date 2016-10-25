
import view = require("ui/core/view");
import definition = require("carousel-view");
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

    public async insertPage(position: number, bindingContext: any) {}
    
    public async removePage(position: number) {}
    
    public setCurrentPage(position: number): void {}

    public itemsSourceChanged(): void {}

}