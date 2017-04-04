
import * as application from 'application';
import common = require("./carousel-view-common");
import observable= require("data/observable");
import { Color } from "color";

var VIEWS_STATES = "_viewStates";

export class CarouselView extends common.CarouselView
{
    // Using RelativeLayout to be able to add indicators in upcoming release
    private _android: android.widget.RelativeLayout;

    get android(): android.widget.RelativeLayout{
        return this._android;
    }

    private _viewPager: android.support.v4.view.ViewPager;
    private _indicators: any;

    public _createUI() {

        this._android = new android.widget.RelativeLayout(application.android.currentContext);
        
    }

    public onLoaded() {

        switch(this.orientation)
        {
            case "horizontal":
                this._viewPager = new android.support.v4.view.ViewPager(this._context);
                break;
            case "vertical":
                ensureVerticalViewPagerClass();
                this._viewPager = new VerticalViewPagerClass(application.android.currentContext);
                break;
            default:
                throw new Error("CarouselView " + this.orientation + " orientation is not supported.");
        }

        var res = android.content.res.Resources;
        var margin = this.interPageSpacing * res.getSystem().getDisplayMetrics().density;
        this._viewPager.setPageMargin(margin);

        // Property for the user set the margin color (to avoid seeing a view in the background)
        //this._viewPager.setBackgroundColor(android.graphics.Color.parseColor("#FFFFFFFF"));
        this._viewPager.setBackgroundColor(new Color(this.interPageSpacingColor).android);

        //var that = new WeakRef(this);
        ensurePagerAdapterClass();
        this._viewPager.setAdapter(new PagerAdapterClass(this));
        
        var layoutParams = new android.widget.RelativeLayout.LayoutParams(android.widget.RelativeLayout.LayoutParams.MATCH_PARENT, android.widget.RelativeLayout.LayoutParams.MATCH_PARENT);
        this._android.addView(this._viewPager, layoutParams);

        ensureCirclePageIndicatorClass();
        this._indicators = new CirclePageIndicatorClass(application.android.currentContext, this);

        switch(this.orientation)
        {
            case "horizontal":
                layoutParams = new android.widget.RelativeLayout.LayoutParams(android.widget.RelativeLayout.LayoutParams.MATCH_PARENT, android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT);
                layoutParams.addRule(android.widget.RelativeLayout.ALIGN_PARENT_BOTTOM);
                break;
            case "vertical":
                this._indicators.mOrientation = 1;
                layoutParams = new android.widget.RelativeLayout.LayoutParams(android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT, android.widget.RelativeLayout.LayoutParams.MATCH_PARENT);
                layoutParams.addRule(android.widget.RelativeLayout.ALIGN_PARENT_RIGHT);
                break;
        }

        this._indicators.SetViewPager(this._viewPager, this.position);
        
        this.configurePosition();

        this._android.addView(this._indicators, layoutParams);

        this._indicators.setVisibility(this.showIndicators ? android.view.View.VISIBLE : android.view.View.GONE);

        ensurePageChangedListenerClass();
        this._viewPager.setOnPageChangeListener(new PageChangedListenerClass(this, this._indicators));
        this._viewPager.setCurrentItem(this.position, false);

        var eventData: observable.EventData = {
            eventName: "positionSelected",
            object: this
        }
        this.notify(eventData);

        this.on(observable.Observable.propertyChangeEvent, function(propertyChangeData){
            switch((<any>propertyChangeData).propertyName)
            {
                case "itemsSource":
                    if (this._viewPager != null) {
        
                        this.configurePosition();
                            
                        ensurePagerAdapterClass();
                        this._viewPager.setAdapter(new PagerAdapterClass(this));

                        this._viewPager.setCurrentItem(this.position, false);

                        this._indicators.SetViewPager(this._viewPager, this.position);

                        var eventData: observable.EventData = {
                            eventName: "positionSelected",
                            object: this
                        }
                        this.notify(eventData);
                    }
                    break;
                case "showIndicators":
                    this._indicators.setVisibility((<any>propertyChangeData).value ? android.view.View.VISIBLE : android.view.View.GONE);
                    break;

            }
        }, this);
    }

    configurePosition() : void {
        if (this.itemsSource != null) {       
            if (this.position > this.itemsSource.length - 1)
                this.position = this.itemsSource.length - 1;
        }
        else {
            this.position = 0;
        }

        if (this.position == -1)
            this.position = 0;

        this._indicators.mSnapPage = this.position;
    }

    public async insertPage(position: number, bindingContext: any) {
        if (this._viewPager != null && this.itemsSource != null) {

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
        if (this._viewPager != null && this.itemsSource != null) {

            if (this.itemsSource.length > 0) {

                if (position > this.itemsSource.length - 1)
                    throw new Error("Index out of bounds (position > itemsSource length - 1).");

                if (position < 0)
                    throw new Error("Index out of bounds (position < 0).");

                if (position == this.position) {

                    var newPos = position - 1;
                    if (newPos == -1)
                        newPos = 0;

                    if (position == 0) {

                        this._viewPager.setCurrentItem (1, this.animateTransition);

                        await this.delay(100);

                        this.itemsSource.splice(position,1);            
                        
                        //this._viewPager.setAdapter(new PagerAdapterClass(this));
                        this._viewPager.getAdapter().notifyDataSetChanged (); 
                        
                        this._viewPager.setCurrentItem (0, false);  

                        this.position = 0;            

                    } else {

                        this._viewPager.setCurrentItem (newPos, this.animateTransition);

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
    }

    public setCurrentPage(position: number): void {
        if (this._viewPager != null && this.itemsSource != null) {

            if (this.itemsSource.length > 0) {

                if (position > this.itemsSource.length - 1)
                    throw new Error("Index out of bounds (position > itemsSource length - 1).");

                if (position < 0)
                    throw new Error("Index out of bounds (position < 0).");

                this.position = position;
                this._viewPager.setCurrentItem (position, this.animateTransition);

                if (!this.animateTransition) {
                    var eventData: observable.EventData = {
                        eventName: "positionSelected",
                        object: this
                    }
                    this.notify(eventData);
                }
            }
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
            if (this._owner.itemsSource != null) {
                if (this._owner.itemsSource.length > 0) {
                    item = this._owner.itemsSource.getItem(position);
                }
            }

            var view = this._owner.templateSelector.OnSelectTemplate(position, item);
            var obj = <any>view;
            //obj._onAttached(application.android.currentContext);
            this._owner._addView(obj);

            obj.android.tag = position;

            if (this[VIEWS_STATES]) {
                obj.android.restoreHierarchyState(this[VIEWS_STATES]);
            }

            container.addView(obj.android);

            obj.onLoaded();

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
        private _indicators: any;
            
        constructor(owner: CarouselView, indicators: any) {
            super();
            this._owner = owner;
            this._indicators = indicators;
            return global.__native(this);
        }

        public onPageScrolled(position: number, positionOffset: number, positionOffsetPixels: number): void
        {
            if (this._indicators != null)
            {
                this._indicators.mCurrentPage = position;
                this._indicators.mCurrentOffset = positionOffsetPixels;
                this._indicators.UpdatePageSize();
                this._indicators.invalidate();
            }
        }

        public onPageSelected(position: number) {
            
            if (this._indicators != null)
            {
                if (this._indicators.mSnap || this._indicators.mScrollState == android.support.v4.view.ViewPager.SCROLL_STATE_IDLE)
                {
                    this._indicators.mCurrentPage = position;
                    this._indicators.mSnapPage = position;
                    this._indicators.invalidate();
                }
            }

            this._owner.position = position;
        }

        public onPageScrollStateChanged (state: number) {

            if (this._indicators != null)
            {
                this._indicators.mScrollState = state;
            }

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

            // get rid of the overscroll drawing that happens on the left and right
            global.__native(this).setOverScrollMode(android.view.View.OVER_SCROLL_NEVER);

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

var CirclePageIndicatorClass;
function ensureCirclePageIndicatorClass() {

    if (CirclePageIndicatorClass) {
        return;
    }

    class CirclePageIndicatorInner extends android.view.View
    {
        private _owner: CarouselView;

        HORIZONTAL : number = 0;
        VERTICAL : number = 1;
        
        private mViewPager : android.support.v4.view.ViewPager;
        private mPageSize : number;

        public mCurrentPage : number;
        public mSnapPage : number;
        public mCurrentOffset : number;
        public mScrollState : number;

        public mCentered : boolean;
        public mPaintFill : android.graphics.Paint;
        public mPaintPageFill : android.graphics.Paint;
        public mOrientation : number;
        public mRadius : number;
        public mSnap : boolean;
        public mPaintStroke : android.graphics.Paint;

        constructor(context: android.content.Context, owner: CarouselView)
        {
            super(context, null);

            this._owner = owner;

            this.mCentered = true;

            this.mPaintPageFill = new android.graphics.Paint(android.graphics.Paint.ANTI_ALIAS_FLAG);
            this.mPaintPageFill.setStyle(android.graphics.Paint.Style.FILL);
            //this.mPaintPageFill.setColor(android.graphics.Color.parseColor("#c0c0c0"));
            this.mPaintPageFill.setColor(new Color(this._owner.indicatorsTintColor).android);

            this.mPaintFill = new android.graphics.Paint(android.graphics.Paint.ANTI_ALIAS_FLAG);
            this.mPaintFill.setStyle(android.graphics.Paint.Style.FILL);
            //this.mPaintFill.setColor(android.graphics.Color.parseColor("#808080"));
            this.mPaintFill.setColor(new Color(this._owner.indicatorsCurrentPageColor).android);

            this.mOrientation = this.HORIZONTAL;
            this.mRadius = this.dpToPx(3);
            this.mSnap = true;

            this.mPaintStroke = new android.graphics.Paint(android.graphics.Paint.ANTI_ALIAS_FLAG);
            this.mPaintStroke.setStyle(android.graphics.Paint.Style.STROKE);
            this.mPaintStroke.setColor(android.graphics.Color.parseColor("#FFFFFFFF"));
            this.mPaintStroke.setStrokeWidth(0);

            let p = this.dpToPx(14);
            global.__native(this).setPadding(p,p,p,p);
            global.__native(this).setBackgroundColor(android.graphics.Color.TRANSPARENT);

            return global.__native(this);
        }

        public SetViewPager(view: android.support.v4.view.ViewPager, initialPosition: number) : void
        {
            if (view.getAdapter() == null)
            {
                throw new java.lang.IllegalStateException("ViewPager does not have adapter instance.");
            }
            this.mViewPager = view;
            this.UpdatePageSize();

            this.SetCurrentItem(initialPosition);
        }

        public SetCurrentItem(item: number) : void
        {
            if (this.mViewPager == null)
            {
                throw new java.lang.IllegalStateException("ViewPager has not been bound.");
            }
            this.mViewPager.setCurrentItem(item);
            this.mCurrentPage = item;
            this.invalidate();
        }

        public UpdatePageSize() : void
        {
            if (this.mViewPager != null)
            {
                this.mPageSize = (this.mOrientation == this.HORIZONTAL) ? this.mViewPager.getWidth() : this.mViewPager.getHeight();
            }
        }

        public dpToPx(dp: number) : number
        {
            var res = android.content.res.Resources;
            return dp * res.getSystem().getDisplayMetrics().density;
        }

        public SetPageColor(pageColor: android.graphics.Color): void
		{
			this.mPaintPageFill.setColor(Number(pageColor));
			this.invalidate();
		}

		public SetFillColor(fillColor: android.graphics.Color): void
		{
			this.mPaintFill.setColor(Number(fillColor));
			this.invalidate();
		}

        protected onDraw(canvas: android.graphics.Canvas): void
        {
            super.onDraw(canvas);

            if (this.mViewPager == null)
            {
                return;
            }
            let count = this.mViewPager.getAdapter().getCount();
            if (count == 0)
            {
                return;
            }

            if (this.mCurrentPage >= count)
            {
                this.SetCurrentItem(count - 1);
                return;
            }

            let longSize;
            let longPaddingBefore;
            let longPaddingAfter;
            let shortPaddingBefore;
            if (this.mOrientation == this.HORIZONTAL)
            {
                longSize = this.getWidth();
                longPaddingBefore = this.getPaddingLeft();
                longPaddingAfter = this.getPaddingRight();
                shortPaddingBefore = this.getPaddingTop();
            }
            else {
                longSize = this.getHeight();
                longPaddingBefore = this.getPaddingTop();
                longPaddingAfter = this.getPaddingBottom();
                shortPaddingBefore = this.getPaddingLeft();
            }

            let threeRadius = this.mRadius * 4; // indicators separation
            let shortOffset = shortPaddingBefore + this.mRadius;
            let longOffset = longPaddingBefore + this.mRadius;
            if (this.mCentered)
            {
                longOffset += ((longSize - longPaddingBefore - longPaddingAfter) / 2.0) - ((count * threeRadius) / 2.0);
            }

            let dX;
            let dY;

            let pageFillRadius = this.mRadius;
            if (this.mPaintStroke.getStrokeWidth() > 0)
            {
                pageFillRadius -= this.mPaintStroke.getStrokeWidth() / 2.0;
            }

            //Draw stroked circles
            for (var iLoop = 0; iLoop < count; iLoop++)
            {
                let drawLong = longOffset + (iLoop * threeRadius);
                if (this.mOrientation == this.HORIZONTAL)
                {
                    dX = drawLong;
                    dY = shortOffset;
                }
                else {
                    dX = shortOffset;
                    dY = drawLong;
                }
                // Only paint fill if not completely transparent
                if (this.mPaintPageFill.getAlpha() > 0)
                {
                    switch (this._owner.indicatorsShape)
					{
						case "Square":
                            // left = dX;
                            // top = dY;
                            // right = dX + (pageFillRadius * 2)
                            // bottom = dY + (pageFillRadius * 2)
							canvas.drawRect(dX, dY, dX + (pageFillRadius * 2), dY + (pageFillRadius * 2), this.mPaintPageFill);
							break;
                        case "Circle":
                            canvas.drawCircle(dX, dY, pageFillRadius, this.mPaintPageFill);
                            break;
						default:
							throw new Error("CarouselView " + this._owner.indicatorsShape + " indicators shape is not supported.");
					}
                }

                // Only paint stroke if a stroke width was non-zero
                if (pageFillRadius != this.mRadius)
                {
                    switch (this._owner.indicatorsShape)
					{
						case "Square":
                            // left = dX;
                            // top = dY;
                            // right = dX + (this.mRadius * 2)
                            // bottom = dY + (this.mRadius * 2)
							canvas.drawRect(dX, dY, dX + (this.mRadius * 2), dY + (this.mRadius * 2), this.mPaintStroke);
							break;
						default:
							canvas.drawCircle(dX, dY, this.mRadius, this.mPaintStroke);
							break;
					}
                }
            }

            //Draw the filled circle according to the current scroll
            let cx = (this.mSnap ? this.mSnapPage : this.mCurrentPage) * threeRadius;
            if (!this.mSnap && (this.mPageSize != 0))
            {
                cx += (this.mCurrentOffset * 1.0 / this.mPageSize) * threeRadius;
            }
            if (this.mOrientation == this.HORIZONTAL)
            {
                dX = longOffset + cx;
                dY = shortOffset;
            }
            else {
                dX = shortOffset;
                dY = longOffset + cx;
            }
            
            switch (this._owner.indicatorsShape)
            {
                case "Square":
                    // left = dX;
                    // top = dY;
                    // right = dX + (this.mRadius * 2)
                    // bottom = dY + (this.mRadius * 2)
                    canvas.drawRect(dX, dY, dX + (this.mRadius * 2), dY + (this.mRadius * 2), this.mPaintFill);
                    break;
                default:
                    canvas.drawCircle(dX, dY, this.mRadius, this.mPaintFill);
                    break;
            }
        }

        protected onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void
        {
            if (this.mOrientation == this.HORIZONTAL)
            {
                this.setMeasuredDimension(this.MeasureLong(widthMeasureSpec), this.MeasureShort(heightMeasureSpec));
            }
            else {
                this.setMeasuredDimension(this.MeasureShort(widthMeasureSpec), this.MeasureLong(heightMeasureSpec));
            }
        }

        private MeasureLong(measureSpec: number) : number
        {
            let result = 0;
            var specMode = android.view.View.MeasureSpec.getMode(measureSpec);
            var specSize = android.view.View.MeasureSpec.getSize(measureSpec);

            if ((specMode == android.view.View.MeasureSpec.EXACTLY) || (this.mViewPager == null) || (this.mViewPager.getAdapter() == null))
            {
                //We were told how big to be
                result = specSize;
            }
            else {
                //Calculate the width according the views count
                let count = this.mViewPager.getAdapter().getCount();
                result = <number>(this.getPaddingLeft() + this.getPaddingRight()
                        + (count * 2 * this.mRadius) + (count - 1) * this.mRadius + 1);
                //Respect AT_MOST value if that was what is called for by measureSpec
                if (specMode == android.view.View.MeasureSpec.AT_MOST)
                {
                    result = java.lang.Math.min(result, specSize);
                }
            }
            return result;
        }

        private MeasureShort(measureSpec : number) : number
        {
            let result = 0;
            var specMode = android.view.View.MeasureSpec.getMode(measureSpec);
            var specSize = android.view.View.MeasureSpec.getSize(measureSpec);

            if (specMode == android.view.View.MeasureSpec.EXACTLY)
            {
                //We were told how big to be
                result = specSize;
            }
            else {
                //Measure the height
                result = <number>(2 * this.mRadius + this.getPaddingTop() + this.getPaddingBottom() + 1);
                //Respect AT_MOST value if that was what is called for by measureSpec
                if (specMode == android.view.View.MeasureSpec.AT_MOST)
                {
                    result = java.lang.Math.min(result, specSize);
                }
            }
            return result;
        }

        protected onRestoreInstanceState(state: android.os.IParcelable) : void
        {
            try
            {
                var bundle = state as android.os.Bundle;
                if (bundle != null)
                {
                    var superState = <android.os.IParcelable>bundle.getParcelable("base");
                    if (superState != null)
                        super.onRestoreInstanceState(superState);
                    this.mCurrentPage = bundle.getInt("mCurrentPage", 0);
                    this.mSnapPage = bundle.getInt("mCurrentPage", 0);
                }
            }
            catch(e)
            {
                super.onRestoreInstanceState(state);
                // Ignore, this needs to support IParcelable...
            }

            this.requestLayout();
        }

        protected onSaveInstanceState() : android.os.IParcelable
        {
            var superState = super.onSaveInstanceState();
            var state = new android.os.Bundle();
            state.putParcelable("base", superState);
            state.putInt("mCurrentPage", this.mCurrentPage);

            return state;
        }
    }

    CirclePageIndicatorClass = CirclePageIndicatorInner;
}