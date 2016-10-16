import * as application from 'application';
// import common = require("./carousel-view-common");
import {ContentView} from "ui/content-view";
import observable = require("data/observable");

import dependencyObservable = require("ui/core/dependency-observable");
import proxy = require("ui/core/proxy");
import observableArrayModule = require("data/observable-array");

export class CarouselView extends ContentView//common.CarouselView
{
    private _ios: UIPageViewController;

    get ios(): UIPageViewController{
        return this._ios;
    }

    // We will need this for the view to show up
    // However, if you uncomment an run with this, it will crash with:
    // -[UIPageViewController superview]: unrecognized selector sent to instance 0x7f9d21804000
    // Some of the docs linked by core team should provide a way forward 
    // Basically we need to extend UIPageViewController properly
    // get _nativeView(): any {
    //     return this._ios;
    // }
    
    // tmp
    // this is here to simplify debugging and to get working
    // ContentView works better for the base class when working with iOS custom view components
    // once you get iOS working with all this here, then can refactor later where applicable
    public static positionProperty = new dependencyObservable.Property(
        "position",
        "CarouselView",
        new proxy.PropertyMetadata(false)
        );

   public static templateSelectorProperty = new dependencyObservable.Property(
        "templateSelector",
        "CarouselView",
        new proxy.PropertyMetadata(false)
        );

   public static itemsSourceProperty = new dependencyObservable.Property(
        "itemsSource",
        "CarouselView",
        new proxy.PropertyMetadata(false)
        );

    get position(): number {
        return this._getValue(CarouselView.positionProperty);
    }
    set position(value: number) {
        this._setValue(CarouselView.positionProperty, value);
    }

    get templateSelector(): any {
        return this._getValue(CarouselView.templateSelectorProperty);
    }
    set templateSelector(value: any) {
        this._setValue(CarouselView.templateSelectorProperty, value);
    }

     get itemsSource(): observableArrayModule.ObservableArray<any> {
        return this._getValue(CarouselView.itemsSourceProperty);
    }
    set itemsSource(value: observableArrayModule.ObservableArray<any>) {
        this._setValue(CarouselView.itemsSourceProperty, value);
    }
    // end tmp

    constructor()
    {
        super();
        
        this._ios = new UIPageViewController(
            UIPageViewControllerTransitionStyle.UIPageViewControllerTransitionStyleScroll,
            UIPageViewControllerNavigationOrientation.UIPageViewControllerNavigationOrientationHorizontal,
            NSDictionary.dictionaryWithObjectForKey(UIPageViewControllerSpineLocation.UIPageViewControllerSpineLocationNone, "spineLocation"));
        

        var that = new WeakRef(this);
        this._ios.dataSource = DataSourceClass.initWithOwner(that);
        this._ios.delegate = new DelegateClass();
        
        var eventData: observable.EventData = {
            eventName: "positionSelected",
            object: this
        }
        this.notify(eventData);
    }

    public onLoaded() {
        // this is called when the custom XML loads in the {N} view on iOS
        console.log(`onLoaded!`);
    }

    public async insertPage(position: number, bindingContext: any) {
        if (this._ios != null) {
				
            if (position == -1)
				this.itemsSource.push(bindingContext);
			else
				this.itemsSource.splice(position, 0, bindingContext);

            let firstViewController;
            if (this._ios.viewControllers && this._ios.viewControllers.count) {
                firstViewController = this._ios.viewControllers[0];
            } else {
                firstViewController = this.createViewController(0);
            }
            console.log('insertPage');
            console.log(firstViewController);
            var direction = UIPageViewControllerNavigationDirection.UIPageViewControllerNavigationDirectionForward;
            console.log(`direction: ${direction}`);

            // can use a standard JS Array here (just type-cast to any to suffice TypeScript)
            // {N} will auto-marshall this into a NSArray when making the call since the metadata knows its
            // supposed to be an NSArray :)
			this._ios.setViewControllersDirectionAnimatedCompletion(<any>[firstViewController], direction, false, (arg1) => {});

            await this.delay(100);
        }
    }

    public async removePage(position: number) {
        if (this._ios != null) {
            if (position == this.position) {
				
                var newPos = position - 1;
                if (newPos == -1)
                    newPos = 0;

                await this.delay(100);

                var forward = UIPageViewControllerNavigationDirection.UIPageViewControllerNavigationDirectionForward;
                var reverse = UIPageViewControllerNavigationDirection.UIPageViewControllerNavigationDirectionReverse;
                let direction = position == 0 ? forward : reverse;
                
                let firstViewController = this.createViewController(newPos);
                this._ios.setViewControllersDirectionAnimatedCompletion(new NSArray(firstViewController), direction, true, (arg1) => {});

                this.position = newPos;

            } else {

                let firstViewController = this._ios.viewControllers[0];
                let direction = UIPageViewControllerNavigationDirection.UIPageViewControllerNavigationDirectionForward;
                this._ios.setViewControllersDirectionAnimatedCompletion (new NSArray(firstViewController), direction, false, (arg1) => {});

            }
        }
    }

    public setCurrentPage(position: number): void {
        if (this._ios != null) {
            var forward = UIPageViewControllerNavigationDirection.UIPageViewControllerNavigationDirectionForward;
            var reverse = UIPageViewControllerNavigationDirection.UIPageViewControllerNavigationDirectionReverse;
            var direction = position > this.position ? forward : reverse;

			this.position = position;

            var firstViewController = this.createViewController(position);
            console.log('firstViewController:');
            console.log(firstViewController);
            // let arr = new NSArray(firstViewController);
            // console.log(arr);
			this._ios.setViewControllersDirectionAnimatedCompletion(<any>[firstViewController], direction, true, (arg1) => {});
        }
    }

   public createViewController(position: number) : UIViewController 
   {
       var item;
        if (this.itemsSource != null)
            item = this.itemsSource.getItem(position);

        var view = this.templateSelector.OnSelectTemplate(position, item);
        var obj = <any>view;
        //obj._onAttached();

        console.log('createViewController');
        var viewController = new ViewContainer();
        console.log(viewController);
        viewController.tag = position;
        //viewController.view = obj.ios;

        return viewController;
    }

    public delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class DataSourceClass implements UIPageViewControllerDataSource
{
    private _owner: WeakRef<CarouselView>;

    public static initWithOwner(owner: WeakRef<CarouselView>): DataSourceClass {
        let datasource = new DataSourceClass();
        datasource._owner = owner;
        return datasource;
    }

    pageViewControllerViewControllerBeforeViewController(pageViewController: UIPageViewController, viewController: UIViewController): UIViewController
    {
        var controller = <ViewContainer>viewController;
        var position = controller.tag;

        // Determine if we are on the first page
        if (position == 0)
        {
            // We are on the first page, so there is no need for a controller before that
            return null;
        }
        else {
            var previousPageIndex = position - 1;
            let owner = this._owner.get();
            return owner.createViewController(previousPageIndex);
        }
    }

    pageViewControllerViewControllerAfterViewController(pageViewController: UIPageViewController, viewController: UIViewController): UIViewController
    {
        var controller = <ViewContainer>viewController;
        console.log('pageViewControllerViewControllerAfterViewController');
        var position = controller.tag;

        // Determine if we are on the last page
        var count = this.presentationCountForPageViewController(pageViewController);
        if (position == count - 1)
        {
            // We are on the last page, so there is no need for a controller after that
            return null;
        }
        else {
            var nextPageIndex = position + 1;
            let owner = this._owner.get();
            return owner.createViewController(nextPageIndex);
        }
    }

    presentationCountForPageViewController(pageViewController: UIPageViewController): number
    {
        let owner = this._owner.get();

        // FIX: populate the carousel with data after being loaded in UI
        if (owner.itemsSource == null)
            return 0;
        return owner.itemsSource.length;
    }

    presentationIndexForPageViewController(pageViewController: UIPageViewController): number
    {
        let owner = this._owner.get();
        return owner.position;
    }
}

export class DelegateClass implements UIPageViewControllerDelegate
{
    pageViewControllerDidFinishAnimatingPreviousViewControllersTransitionCompleted(pageViewController: UIPageViewController, finished: boolean, previousViewControllers: NSArray, completed: boolean): void
    {
        /*var eventData: observable.EventData = {
            eventName: "positionSelected",
            object: this
        }
        this.notify(eventData);*/
    }
}

/*export class PageViewController extends UIPageViewController implements UIPageViewControllerDataSource
{
    private _owner: WeakRef<CarouselView>;

    get owner(): CarouselView {
        return this._owner.get();
    }

    public static initWithOwner(owner: WeakRef<CarouselView>): PageViewController {
        let controller = new PageViewController(
            UIPageViewControllerTransitionStyle.UIPageViewControllerTransitionStyleScroll,
            UIPageViewControllerNavigationOrientation.UIPageViewControllerNavigationOrientationHorizontal,
            NSDictionary.dictionaryWithObjectForKey(UIPageViewControllerSpineLocation.UIPageViewControllerSpineLocationNone, "spineLocation"))
        controller._owner = owner;
        return controller;
    }

    viewDidLoad() {

        super.viewDidLoad();

        this.dataSource = this;
        
        var firstViewController = this.createViewController(this.owner.position);
		var direction = UIPageViewControllerNavigationDirection.UIPageViewControllerNavigationDirectionForward;
        this.setViewControllersDirectionAnimatedCompletion (new NSArray(firstViewController), direction, false, (arg1) => {});
    }

    public createViewController(position: number) : UIViewController 
   {
       var item;
        if (this.owner.itemsSource != null)
            item = this.owner.itemsSource.getItem(position);

        var view = this.owner.templateSelector.OnSelectTemplate(position, item);
        var obj = <any>view;
        //obj._onAttached();

        var viewController = new ViewContainer();
        viewController.tag = position;
        //viewController.view = obj.ios;

        return viewController;
    }

    pageViewControllerViewControllerBeforeViewController(pageViewController: UIPageViewController, viewController: UIViewController): UIViewController
    {
        var controller = <ViewContainer>viewController;
        var position = controller.tag;

        // Determine if we are on the first page
        if (position == 0)
        {
            // We are on the first page, so there is no need for a controller before that
            return null;
        }
        else {
            var previousPageIndex = position - 1;
            return this.owner.createViewController(previousPageIndex);
        }
    }

    pageViewControllerViewControllerAfterViewController(pageViewController: UIPageViewController, viewController: UIViewController): UIViewController
    {
        var controller = <ViewContainer>viewController;
        var position = controller.tag;

        // Determine if we are on the last page
        var count = this.presentationCountForPageViewController(pageViewController);
        if (position == count - 1)
        {
            // We are on the last page, so there is no need for a controller after that
            return null;
        }
        else {
            var nextPageIndex = position + 1;
            return this.owner.createViewController(nextPageIndex);
        }
    }

    presentationCountForPageViewController?(pageViewController: UIPageViewController): number
    {
        // FIX: populate the carousel with data after being loaded in UI
        if (this.owner.itemsSource == null)
            return 0;
        return this.owner.itemsSource.length;
    }

    presentationIndexForPageViewController?(pageViewController: UIPageViewController): number
    {
        return this.owner.position;
    }
}*/

export class ViewContainer extends UIViewController
{
    public tag: number;

    constructor() {
        super();
    }
}