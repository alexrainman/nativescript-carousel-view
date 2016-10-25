# CarouselView plugin for NativeScript

#### Setup
* Available on npm: https://www.nuget.org/packages/CarouselView.FormsPlugin/ [![NuGet](https://img.shields.io/nuget/v/CarouselView.FormsPlugin.svg?label=NuGet)](https://www.nuget.org/packages/CarouselView.FormsPlugin/)

**Platform Support**

|Platform|Supported|Version|NativeView|
| ------------------- | :-----------: | :-----------: | :------------------: |
|iOS|Yes|iOS 8.1+|UIPageViewController|
|Android|Yes|API 15+|ViewPager|

#### Usage

First add the xmlns namespace:

```xml
xmlns:controls="nativescript-carousel-view"
```

Then add the control:

```xml
<controls:CarouselView id="carouselView" position="0" itemsSource="{{ itemsSource }}" templateSelector="{{ templateSelector }}"/>
```

**Bindable Properties**

```position```: selected page when carousel starts.

```interPageSpacing```: margin/space between pages.

```itemsSource```: collection of objects used as bindingContext of each page.

```templateSelector```: a class implementing the provided ITemplateSelector interface.

ViewModel example:
```
export class HelloWorldModel extends observable.Observable {

    public templateSelector: MyTemplateSelector;
    public itemsSource: observableArrayModule.ObservableArray<Person>;

    constructor() {
        super();
        
        this.templateSelector = new MyTemplateSelector();

        var items = [ 1, 2, 3, 4, 5 ];
        this.itemsSource = new observableArrayModule.ObservableArray<Person>(items);
    }
}
```

**Event Handlers**

```positionSelected```: called when the selected page changes.

**Methods**

```removePage (position)```: remove a view at given position (when you remove the current view it will slide to the previous one). This method will also remove the related item from the itemsSource).

```insertPage (position, bindingContext)```: insert a view at a given position.

```setCurrentPage (position)```: slide programmatically to a given position.

```itemsSourceChanged```: call this if you change the itemsSource.

#### Contributors
* [alexrainman](https://github.com/alexrainman)

Thanks!

#### License
Licensed under repo license
