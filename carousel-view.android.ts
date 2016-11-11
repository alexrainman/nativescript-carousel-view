
import * as application from 'application';
import common = require("./carousel-view-common");
import observable= require("data/observable");

var VIEWS_STATES = "_viewStates";

export class CarouselView extends common.CarouselView
{
    // Using RelativeLayout to be able to add indicators in upcoming release
    private _android: android.widget.RelativeLayout;

    get android(): android.widget.RelativeLayout{
        return this._android;
    }

    private _viewPager: android.support.v4.view.ViewPager;

    public _createUI() {

        this._android = new android.widget.RelativeLayout(application.android.currentContext);
        
    }

    public onLoaded() {

        if (this.orientation == 0)
            this._viewPager = new android.support.v4.view.ViewPager(this._context);
        else {
            ensureVerticalViewPagerClass();
            this._viewPager = new VerticalViewPagerClass(application.android.currentContext);
        }

        var res = android.content.res.Resources;
        var margin = this.interPageSpacing * res.getSystem().getDisplayMetrics().density;
        this._viewPager.setPageMargin(margin);

        var that = new WeakRef(this);
        ensurePagerAdapterClass();
        this._viewPager.setAdapter(new PagerAdapterClass(this));
        ensurePageChangedListenerClass();
        this._viewPager.setOnPageChangeListener(new PageChangedListenerClass(this));

        this._viewPager.setCurrentItem(this.position, false);

        var layoutParams = new android.widget.RelativeLayout.LayoutParams(android.widget.RelativeLayout.LayoutParams.MATCH_PARENT, android.widget.RelativeLayout.LayoutParams.MATCH_PARENT);
        this._android.addView(this._viewPager, layoutParams);

        var eventData: observable.EventData = {
            eventName: "positionSelected",
            object: this
        }
        this.notify(eventData);
    }

    public async insertPage(position: number, bindingContext: any) {
        if (this._viewPager != null) {

            if (position > this.itemsSource.length)
				throw new Error("Index out of bounds (position > itemsSource length).");

            if (position < 0)
                throw new Error("Index out of bounds (position < 0).");

            if (position == this.itemsSource.length)
				this.itemsSource.push(bindingContext);
			else
                this.itemsSource.splice(position, 0, bindingContext);
            
            if (position > 1)
                this._viewPager.getAdapter().notifyDataSetChanged ();
            else
                this._viewPager.setAdapter(new PagerAdapterClass(this));

             await this.delay(100);
        }
    }

    public async removePage(position: number) {
        if (this._viewPager != null) {

            if (position > this.itemsSource.length - 1)
				throw new Error("Index out of bounds (position > itemsSource length - 1).");

            if (position < 0)
                throw new Error("Index out of bounds (position < 0).");

            if (position == this.position) {

                var newPos = position - 1;
                if (newPos == -1)
                    newPos = 0;

                if (position == 0) {

                    this._viewPager.setCurrentItem (1, true);

                    await this.delay(100);

                    this.itemsSource.splice(position,1);            
                    
                    //this._viewPager.setAdapter(new PagerAdapterClass(this));
                    this._viewPager.getAdapter().notifyDataSetChanged (); 
                    
                    this._viewPager.setCurrentItem (0, false);  

                    this.position = 0;            

                } else {

                    this._viewPager.setCurrentItem (newPos, true);

                    await this.delay(100);

                    this.itemsSource.splice(position,1);
                    if (position == 1)
                        this._viewPager.setAdapter(new PagerAdapterClass(this));                        
                    else
                        this._viewPager.getAdapter().notifyDataSetChanged ();                 
                    this.position = newPos;
                }

            } else {

                this.itemsSource.splice(position,1);
                if (position == 1)
                    this._viewPager.setAdapter(new PagerAdapterClass(this));                        
                else
                    this._viewPager.getAdapter().notifyDataSetChanged ();
            }
        }
    }

    public setCurrentPage(position: number): void {
        if (this._viewPager != null) {

            if (position > this.itemsSource.length - 1)
		        throw new Error("Index out of bounds (position > itemsSource length - 1).");

            if (position < 0)
                throw new Error("Index out of bounds (position < 0).");

            this.position = position;
            this._viewPager.setCurrentItem (position, true);
        }
    }

    public itemsSourceChanged(): void {
        
        if (this.position > this.itemsSource.length - 1)
			this.position = this.itemsSource.length - 1;
			
        ensurePagerAdapterClass();
        this._viewPager.setAdapter(new PagerAdapterClass(this));

        this._viewPager.setCurrentItem(this.position, false);

        var eventData: observable.EventData = {
            eventName: "positionSelected",
            object: this
        }
        this.notify(eventData);
    }

    public delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

var PagerAdapterClass;
function ensurePagerAdapterClass() {

    if (PagerAdapterClass) {
        return;
    }

    class PagerAdapterInner extends android.support.v4.view.PagerAdapter
    {  
        private _owner: CarouselView;

        constructor(_owner: CarouselView)
        {
            super();

            this._owner = _owner;

            return global.__native(this);
        } 

        getCount ()
        {
            // FIX: populate the carousel with data after being loaded in UI
            if (this._owner.itemsSource == null)
                return 0;
            return this._owner.itemsSource.length;
        }

        isViewFromObject (view: android.view.View, objectValue: any)
        {
            return view === objectValue;
        }

        instantiateItem (container: android.view.ViewGroup, position: number)
        {
            // FIX: populate the carousel with data after being loaded in UI
            var item;
            if (this._owner.itemsSource != null)
                item = this._owner.itemsSource.getItem(position);

            var view = this._owner.templateSelector.OnSelectTemplate(position, item);
            view.onLoaded();
            var obj = <any>view;
            obj._onAttached(application.android.currentContext);

            obj.android.tag = position;

            if (this[VIEWS_STATES]) {
                obj.android.restoreHierarchyState(this[VIEWS_STATES]);
            }

            container.addView(obj.android);

            return obj.android;
        }

        destroyItem (container: android.view.ViewGroup, position: number, objectValue: any)
        {
            var pager = <android.support.v4.view.ViewPager>container;
			pager.removeView (<android.view.ViewGroup>objectValue);
        }

        getItemPosition (objectValue: any)
        {
            var tag = Number((<android.view.View>objectValue).getTag());
            var position = this._owner.position;
            if (tag == position)
                return tag;
            return android.support.v4.view.PagerAdapter.POSITION_NONE;
        }

        saveState(): android.os.Parcelable {
            
            if (!this[VIEWS_STATES]) {
                this[VIEWS_STATES] = new android.util.SparseArray<android.os.Parcelable>();
            }

            var mViewStates = this[VIEWS_STATES];
            var mViewPager = this._owner.android;
            var count = mViewPager.getChildCount();
            
            for (var i = 0; i < count; i++)
            {
                var c = mViewPager.getChildAt(i);
                if (c.isSaveFromParentEnabled())
                {
                    c.saveHierarchyState(mViewStates);
                }
            }

            var bundle = new android.os.Bundle();
            bundle.putSparseParcelableArray(VIEWS_STATES, mViewStates);
            return bundle;
        }

        restoreState(state: android.os.Parcelable, loader: java.lang.ClassLoader) {
            var bundle: android.os.Bundle = <android.os.Bundle>state;
            bundle.setClassLoader(loader);
            this[VIEWS_STATES] = bundle.getSparseParcelableArray(VIEWS_STATES);
        }
    }

    PagerAdapterClass = PagerAdapterInner;

}

var PageChangedListenerClass;
function ensurePageChangedListenerClass() {

    if (PageChangedListenerClass) {
        return;
    }

    class PageChangedListenerInner extends android.support.v4.view.ViewPager.SimpleOnPageChangeListener {
            
        private _owner: CarouselView;
            
        constructor(owner: CarouselView) {
            super();
            this._owner = owner;
            return global.__native(this);
        }

        public onPageSelected(position: number) {
            this._owner.position = position;
        }

        public onPageScrollStateChanged (state: number) {

            if (state == 0) {
                var eventData: observable.EventData = {
                    eventName: "positionSelected",
                    object: this._owner
                }
                this._owner.notify(eventData);
            }
        }
    }

    PageChangedListenerClass = PageChangedListenerInner;
}

var VerticalViewPagerClass;
function ensureVerticalViewPagerClass() {

    if (VerticalViewPagerClass) {
        return;
    }
    
    class VerticalViewPagerInner extends android.support.v4.view.ViewPager
    {
        constructor(context: android.content.Context, attrs?: android.util.IAttributeSet){
            super(context, attrs);

            global.__native(this).setPageTransformer(false, new android.support.v4.view.ViewPager.PageTransformer({
                transformPage(page: android.view.View, position: number): void {
                    page.setTranslationX(page.getWidth() * -position);
                    var yPosition = position * page.getHeight();
                    page.setTranslationY(yPosition);
                }})
            );

            return global.__native(this);
        }

        private swapTouchEvent(ev: android.view.MotionEvent)
        {
            var width = this.getWidth();
            var height = this.getHeight();

            var swappedX = (ev.getY() / height) * width;
            var swappedY = (ev.getX() / width) * height;

            ev.setLocation(swappedX, swappedY);

            return ev;
        }

        public onInterceptTouchEvent(ev: android.view.MotionEvent)
        {
            var intercept = super.onInterceptTouchEvent(this.swapTouchEvent(ev));
            //If not intercept, touch event should not be swapped.
            this.swapTouchEvent(ev);
            return intercept;
        }

        public onTouchEvent(ev: android.view.MotionEvent)
        {
            return super.onTouchEvent(this.swapTouchEvent(ev));
        }
    }

    VerticalViewPagerClass = VerticalViewPagerInner;
}

//@Interfaces([android.support.v4.view.ViewPager.PageTransformer])
/*export class DefaultTransformer extends java.lang.Object {
    transformPage(page: android.view.View, position: number): void {
        page.setTranslationX(page.getWidth() * -position);
        var yPosition = position * page.getHeight();
        page.setTranslationY(yPosition);
    }
}*/