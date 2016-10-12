import * as application from 'application';
import common = require("./carousel-view-common");
import observable= require("data/observable");

export class CarouselView extends common.CarouselView
{
    private _ios: UIPageViewController;

    get ios(): UIPageViewController{
        return this._ios;
    }

    constructor()
    {
        super();

        this._ios = new UIPageViewController(
            UIPageViewControllerTransitionStyle.UIPageViewControllerTransitionStyleScroll,
            UIPageViewControllerNavigationOrientation.UIPageViewControllerNavigationOrientationHorizontal,
            NSDictionary.dictionaryWithObjectForKey(UIPageViewControllerSpineLocation.UIPageViewControllerSpineLocationNone, "spineLocation"));

        /*this._ios = UIPageViewController.alloc().initWithTransitionStyleNavigationOrientationOptions(
            UIPageViewControllerTransitionStyle.UIPageViewControllerTransitionStyleScroll,
            UIPageViewControllerNavigationOrientation.UIPageViewControllerNavigationOrientationHorizontal,
            NSDictionary.dictionaryWithObjectForKey(UIPageViewControllerSpineLocation.UIPageViewControllerSpineLocationNone, "spineLocation"));*/

        var that = new WeakRef(this);
        this._ios.dataSource = DataSourceClass.initWithOwner(that);
        this._ios.delegate = new DelegateClass();
        
        var eventData: observable.EventData = {
            eventName: "positionSelected",
            object: this
        }
        this.notify(eventData);
    }

    public async insertPage(position: number, bindingContext: any) {
        if (this._ios != null) {
				
            if (position == -1)
				this.itemsSource.push (bindingContext);
			else
				this.itemsSource.splice(position, 0, bindingContext);

			var firstViewController = this._ios.viewControllers [0];
            var direction = UIPageViewControllerNavigationDirection.UIPageViewControllerNavigationDirectionForward;
			this._ios.setViewControllersDirectionAnimatedCompletion (new NSArray(firstViewController), direction, false, (arg1) => {});

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
                
                let firstViewController = this.createViewController (newPos);
                this._ios.setViewControllersDirectionAnimatedCompletion (new NSArray(firstViewController), direction, true, (arg1) => {});

                this.position = newPos;

            } else {

                let firstViewController = this._ios.viewControllers [0];
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

			var firstViewController = this.createViewController (position);
			this._ios.setViewControllersDirectionAnimatedCompletion (new NSArray(firstViewController), direction, true, (arg1) => {});
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

        var viewController = new ViewContainer();
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

    presentationCountForPageViewController?(pageViewController: UIPageViewController): number
    {
        let owner = this._owner.get();

        // FIX: populate the carousel with data after being loaded in UI
        if (owner.itemsSource == null)
            return 0;
        return owner.itemsSource.length;
    }

    presentationIndexForPageViewController?(pageViewController: UIPageViewController): number
    {
        let owner = this._owner.get();
        return owner.position;
    }
}

export class DelegateClass implements UIPageViewControllerDelegate
{
    pageViewControllerDidFinishAnimatingPreviousViewControllersTransitionCompleted?(pageViewController: UIPageViewController, finished: boolean, previousViewControllers: NSArray, completed: boolean): void
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
    tag: number;
}