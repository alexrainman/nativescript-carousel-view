
import * as application from 'application';
import common = require("./carousel-view-common");
import observable= require("data/observable");

export class CarouselView extends common.CarouselView
{
    private _android: android.support.v4.view.ViewPager ;

    get android(): android.support.v4.view.ViewPager {
        return this._android;
    }

    public _createUI() {

        this._android = new android.support.v4.view.ViewPager(this._context);
        //this._android = new verticalViewPager(this._context);
    }

    public onLoaded() {

        var that = new WeakRef(this);
        ensurePagerAdapterClass();
        this._android.setAdapter(new PagerAdapterClass(this));
        ensurePageChangedListenerClass();
        this._android.setOnPageChangeListener(new PageChangedListenerClass(this));

        var eventData: observable.EventData = {
            eventName: "positionSelected",
            object: this
        }
        this.notify(eventData);
    }

    public async insertPage(position: number, bindingContext: any) {
        if (this._android != null) {
				
            if (position == -1)
                this.itemsSource.push (bindingContext);
            else
                this.itemsSource.splice(position, 0, bindingContext);
            
            if (position > 2)
                this._android.getAdapter().notifyDataSetChanged ();
            else
                this._android.setAdapter(new PagerAdapterClass(this));

             await this.delay(100);
        }
    }

    public async removePage(position: number) {
        if (this._android != null) {

            if (position == this.position) {

                var newPos = position - 1;
                if (newPos == -1)
                    newPos = 0;

                if (position == 0) {

                    this._android.setCurrentItem (1, true);

                    await this.delay(100);

                    this.itemsSource.splice(position,1);            
                    
                    this._android.setAdapter(new PagerAdapterClass(this));
                    //this._android.getAdapter().notifyDataSetChanged (); 
                    this._android.setCurrentItem (0, false);  

                    this.position = 0;            

                } else {

                    this._android.setCurrentItem (newPos, true);

                    await this.delay(100);

                    this.itemsSource.splice(position,1);
                    if (position == 1)
                        this._android.setAdapter(new PagerAdapterClass(this));                        
                    else
                        this._android.getAdapter().notifyDataSetChanged ();                 
                    this.position = newPos;
                }

            } else {

                this.itemsSource.splice(position,1);
                if (position == 1)
                    this._android.setAdapter(new PagerAdapterClass(this));                        
                else
                    this._android.getAdapter().notifyDataSetChanged ();

            }
        }
    }

    public setCurrentPage(position: number): void {
        if (this._android != null) {
            this.position = position;
            this._android.setCurrentItem (position, true);
        }
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
            var obj = <any>view;
            obj._onAttached(application.android.currentContext);

            obj.android.tag = position;

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

/*export class verticalViewPager extends android.support.v4.view.ViewPager
{
    constructor(context: android.content.Context)
    {
        super(context);
        this.setPageTransformer(false, new DefaultTransformer());
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

export class DefaultTransformer implements android.support.v4.view.ViewPager.PageTransformer
{
    public transformPage(page : android.view.View, position: number)
    {
        page.setTranslationX(page.getWidth() * -position);
        var yPosition = position * page.getHeight();
        page.setTranslationY(yPosition);
    }
}*/
