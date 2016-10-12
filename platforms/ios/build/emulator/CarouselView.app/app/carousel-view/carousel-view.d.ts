
declare module "carousel-view" {

    import view = require("ui/core/view");
    import dependencyObservable = require("ui/core/dependency-observable");
    import observableArrayModule = require("data/observable-array");
    import observable = require("data/observable");

    export class CarouselView extends view.View {
        // static (prototype) properties
        public static positionProperty: dependencyObservable.Property;
        public static templateSelectorProperty: dependencyObservable.Property;
        public static itemsSourceProperty: dependencyObservable.Property;

        // instance properties
        position: number;
        templateSelector: ITemplateSelector;
        itemsSource: observableArrayModule.ObservableArray<any>;

        public insertPage(position: number, bindingContext: any);
        public removePage(position: number);
        public setCurrentPage(position: number): void;

        android: any; /*android.support.v4.view.ViewPager;*/
        ios: any; /*UIPageViewController;*/
    }

    export interface ITemplateSelector {
        OnSelectTemplate(position: number, bindingContext: any) : view.View;
    }
} 