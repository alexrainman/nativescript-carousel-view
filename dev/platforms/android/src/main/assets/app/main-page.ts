import * as observable from 'data/observable';
import * as pages from 'ui/page';
import { MainViewModel } from './ViewModels/main-view-model';
import { Person } from './ViewModels/main-view-model';
var frame = require('ui/frame');
var gestures = require("ui/gestures");

// Event handler for Page 'loaded' event attached in main-page.xml
export function navigatingTo(args: observable.EventData) {
    // Get the event sender
    let page = <pages.Page>args.object;
    page.bindingContext = new MainViewModel();
    var slider = <any>page.getViewById("carouselView");
    slider.on("positionSelected", function (eventData) {
        console.log(eventData.eventName + " has been raised! by: " + eventData.object);
        var prev = page.getViewById("prevLbl");
        var next = page.getViewById("nextLbl");
        prev.visibility = slider.position > 0 ? "visible" : "collapsed";
        next.visibility = slider.position < slider.itemsSource.length - 1 ? "visible" : "collapsed";
    });
    var addpage = page.getViewById("addPage");
    addpage.on(gestures.GestureTypes.tap, async function (args) {
        if (slider.itemsSource != null) {
            var person = new Person();
            person.first = "Alex";
            person.last = "Rainman"; //Date.now().toString();
            await slider.insertPage(slider.itemsSource.length, person);
            if (slider.itemsSource.length > 1)
                slider.position = slider.itemsSource.length - 1;
        }
    });
}

export function onPrev(args) {
    var page = frame.topmost().currentPage;
    var slider = page.getViewById("carouselView");
    if (slider.itemsSource != null) {
        if (slider.position > 0)
            slider.position--;
    }
}

export function onNext(args) {
    var page = frame.topmost().currentPage;
    var slider = page.getViewById("carouselView");
    if (slider.itemsSource != null) {
        if (slider.position < slider.itemsSource.length - 1)
            slider.position++;
    }
}
