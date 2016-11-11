import * as application from 'application';
import common = require("./carousel-view-common");
import observable = require("data/observable");
import dependencyObservable = require("ui/core/dependency-observable");
import proxy = require("ui/core/proxy");
import observableArrayModule = require("data/observable-array");

export class CarouselView extends common.CarouselView
{
    private _ios: UIView;

    get ios(): UIView {
        return this._ios;
    }

    // Thanks to NathanWalker for the _nativeView tip
    get _nativeView(): any {
        return this._ios;
    }

    private _pageController: UIPageViewController;

    constructor()
    {
        super();
        
        // As custom properties returns default value only here
        // Adding a container so we can build UIPageViewController onLoaded()
        this._ios = new UIView();
    }
    
    // Thanks to NathanWalker for the onLoaded tip
    public onLoaded() {

        let orientation;
        if (this.orientation == 0)
            orientation = UIPageViewControllerNavigationOrientation.UIPageViewControllerNavigationOrientationHorizontal;
        else
            orientation = UIPageViewControllerNavigationOrientation.UIPageViewControllerNavigationOrientationVertical;

        let objects = <any>[UIPageViewControllerSpineLocation.UIPageViewControllerSpineLocationNone, this.interPageSpacing];
        let keys = <any>[UIPageViewControllerOptionSpineLocationKey, UIPageViewControllerOptionInterPageSpacingKey];

        this._pageController = UIPageViewController.alloc().initWithTransitionStyleNavigationOrientationOptions(
            UIPageViewControllerTransitionStyle.UIPageViewControllerTransitionStyleScroll,
            orientation,
            NSDictionary.dictionaryWithObjectsForKeys(objects,keys));

        var that = new WeakRef(this);
        this._pageController.dataSource = DataSourceClass.initWithOwner(that);
        this._pageController.delegate = DelegateClass.initWithOwner(that);

        let firstViewController = this.createViewController(this.position);
        let direction = UIPageViewControllerNavigationDirection.UIPageViewControllerNavigationDirectionForward;
        this._pageController.setViewControllersDirectionAnimatedCompletion (<any>[firstViewController], direction, false, (arg1) => {});

        this._ios.addSubview(this._pageController.view);

        var eventData: observable.EventData = {
            eventName: "positionSelected",
            object: this
        }
        this.notify(eventData);
    }

    public async insertPage(position: number, bindingContext: any) {
        if (this._pageController != null) {

            if (position > this.itemsSource.length)
				throw new Error("Index out of bounds (position > itemsSource length).");

            if (position < 0)
                throw new Error("Index out of bounds (position < 0).");

            if (position == this.itemsSource.length)
				this.itemsSource.push(bindingContext);
			else
				this.itemsSource.splice(position, 0, bindingContext);

            let firstViewController = this._pageController.viewControllers[0];
            var direction = UIPageViewControllerNavigationDirection.UIPageViewControllerNavigationDirectionForward;

            // Using a standard JS Array here (just type-cast to any to suffice TypeScript)
            // {N} will auto-marshall this into a NSArray when making the call since the metadata knows its
            // supposed to be an NSArray :)
            // Thanks to NathanWalker for the auto-marshall tip for NSArray
			this._pageController.setViewControllersDirectionAnimatedCompletion(<any>[firstViewController], direction, false, (arg1) => {});

            await this.delay(100);
        }
    }

    public async removePage(position: number) {
        if (this._pageController != null) {

            if (position > this.itemsSource.length - 1)
				throw new Error("Index out of bounds (position > itemsSource length - 1).");

            if (position < 0)
                throw new Error("Index out of bounds (position < 0).");

            this.itemsSource.splice(position,1);

            if (position == this.position) {
				
                var newPos = position - 1;
                if (newPos == -1)
                    newPos = 0;

                await this.delay(100);

                var forward = UIPageViewControllerNavigationDirection.UIPageViewControllerNavigationDirectionForward;
                var reverse = UIPageViewControllerNavigationDirection.UIPageViewControllerNavigationDirectionReverse;
                let direction = position == 0 ? forward : reverse;
                
                let firstViewController = this.createViewController(newPos);
                this._pageController.setViewControllersDirectionAnimatedCompletion(<any>[firstViewController], direction, true, (arg1) => {});

                this.position = newPos;

            } else {

                let firstViewController = this._pageController.viewControllers[0];
                let direction = UIPageViewControllerNavigationDirection.UIPageViewControllerNavigationDirectionForward;
                this._pageController.setViewControllersDirectionAnimatedCompletion (<any>[firstViewController], direction, false, (arg1) => {});

            }

            var eventData: observable.EventData = {
                eventName: "positionSelected",
                object: this
            }
            this.notify(eventData);
        }
    }

    public setCurrentPage(position: number): void {
        if (this._pageController != null) {

            if (position > this.itemsSource.length - 1)
		        throw new Error("Index out of bounds (position > itemsSource length - 1).");

            if (position < 0)
                throw new Error("Index out of bounds (position < 0).");

            var forward = UIPageViewControllerNavigationDirection.UIPageViewControllerNavigationDirectionForward;
            var reverse = UIPageViewControllerNavigationDirection.UIPageViewControllerNavigationDirectionReverse;
            var direction = position > this.position ? forward : reverse;

			this.position = position;

            var firstViewController = this.createViewController(position);
			this._pageController.setViewControllersDirectionAnimatedCompletion(<any>[firstViewController], direction, true, (arg1) => {});

            var eventData: observable.EventData = {
                eventName: "positionSelected",
                object: this
            }
            this.notify(eventData);
        }
    }

    public itemsSourceChanged(): void {
        
        if (this.position > this.itemsSource.length - 1)
			this.position = this.itemsSource.length - 1;
			
		let firstViewController = this.createViewController(this.position);
        let direction = UIPageViewControllerNavigationDirection.UIPageViewControllerNavigationDirectionForward;
        this._pageController.setViewControllersDirectionAnimatedCompletion (<any>[firstViewController], direction, false, (arg1) => {});

		var eventData: observable.EventData = {
            eventName: "positionSelected",
            object: this
        }
        this.notify(eventData);
    }

    public createViewController(position: number) : UIViewController 
    {
        var item;
        if (this.itemsSource != null)
            item = this.itemsSource.getItem(position);

        var view = this.templateSelector.OnSelectTemplate(position, item);
        view.onLoaded();
        var obj = <any>view;

        var viewController = new ViewContainer();
        viewController.tag = position;
        viewController.view = obj._view;
        viewController.owner = view;

        return viewController;
    }

    public delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class DataSourceClass extends NSObject implements UIPageViewControllerDataSource
{
    public static ObjCProtocols = [UIPageViewControllerDataSource];

    private _owner: WeakRef<CarouselView>;

    get owner(): CarouselView{
        return this._owner.get();
    }

    public static initWithOwner(owner: WeakRef<CarouselView>): DataSourceClass {
        let datasource = new DataSourceClass();
        datasource._owner = owner;
        return datasource;
    }

    pageViewControllerViewControllerBeforeViewController(pageViewController: UIPageViewController, viewController: UIViewController): UIViewController
    {
        var controller = <ViewContainer>viewController;
        var position = Number(controller.tag);

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
        var position = Number(controller.tag);

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

    presentationCountForPageViewController(pageViewController: UIPageViewController): number
    {
        // FIX: populate the carousel with data after being loaded in UI
        if (this.owner.itemsSource == null)
            return 0;
        return this.owner.itemsSource.length;
    }

    // TODO: implement this to show UIPageControl
    /*presentationIndexForPageViewController(pageViewController: UIPageViewController): number
    {
        return this.owner.position;
    }*/
}

class DelegateClass extends NSObject implements UIPageViewControllerDelegate
{
    public static ObjCProtocols = [UIPageViewControllerDelegate];

    private _owner: WeakRef<CarouselView>;

    get owner(): CarouselView{
        return this._owner.get();
    }

    public static initWithOwner(owner: WeakRef<CarouselView>): DelegateClass {
        let delegate = new DelegateClass();
        delegate._owner = owner;
        return delegate;
    }

    pageViewControllerDidFinishAnimatingPreviousViewControllersTransitionCompleted(pageViewController: UIPageViewController, finished: boolean, previousViewControllers: NSArray, completed: boolean): void
    {
        if (finished)
        {
            var controller = <ViewContainer>pageViewController.viewControllers[0];
			var position = controller.tag;
			this.owner.position = position;

            var eventData: observable.EventData = {
                eventName: "positionSelected",
                object: this.owner
            }
            this.owner.notify(eventData);
        }
    }
}

export class ViewContainer extends UIViewController
{
    public tag: number;
    public owner: any;
    
    // Thanks to tzraikov
    public viewDidLoad(): void {
        super.viewDidLoad();
        if (this.owner) {
            this.owner.onLoaded();
        }
    }

    // Thanks to tzraikov
    public viewDidLayoutSubviews(): void {
        if (this.owner) {
            var width = this.view.frame.size.width;
            var height = this.view.frame.size.height;
            this.owner.measure(width, height);
            this.owner.layout(0, 0, width, height);
            this.owner._updateLayout();
        }
    }
}