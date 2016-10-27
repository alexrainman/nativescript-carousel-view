import { EventData } from "data/observable";
import { Page } from "ui/page";
import { HelloWorldModel } from "../ViewModels/main-view-model";
import { Person } from "../ViewModels/main-view-model";
import { Label } from "ui/label";
import gestures = require("ui/gestures");
import { CarouselView } from "nativescript-carousel-view";
var frame = require('ui/frame');

// Event handler for Page "navigatingTo" event attached in main-page.xml
export function navigatingTo(args: EventData) {
    // Get the event sender
    var page = <Page>args.object;
    page.bindingContext = new HelloWorldModel();

    var carouselView = <CarouselView>page.getViewById("carouselView");

    carouselView.on("positionSelected", function(eventData){
        console.log(eventData.eventName + " has been raised! by: " + eventData.object);
    });

    var addpage = <Label>page.getViewById("addPage");

    var observer = addpage.on(gestures.GestureTypes.tap, async function (args: gestures.GestureEventData) {

        var person = new Person();
        person.first = "Alex";
        person.last = "Rainman";

        await carouselView.insertPage(carouselView.itemsSource.length, person);
        carouselView.setCurrentPage(carouselView.itemsSource.length - 1);
    });
}

export function onNext(args: EventData) {    
    var page = frame.topmost().currentPage;
    var slider = <CarouselView>page.getViewById("carouselView");
    if (slider.position < slider.itemsSource.length - 1)
        slider.setCurrentPage(slider.position + 1);
}

export function onPrev(args: EventData) {    
    var page = frame.topmost().currentPage;
    var slider = <CarouselView>page.getViewById("carouselView");
    if (slider.position > 0)
        slider.setCurrentPage(slider.position - 1);
}