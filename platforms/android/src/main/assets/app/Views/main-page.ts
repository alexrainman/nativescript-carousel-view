import { EventData } from "data/observable";
import { Page } from "ui/page";
import { HelloWorldModel } from "../ViewModels/main-view-model";
import { Person } from "../ViewModels/main-view-model";
import { Label } from "ui/label";
import gestures = require("ui/gestures");
import { CarouselView } from "carousel-view";
var frame = require('ui/frame');

// Event handler for Page "navigatingTo" event attached in main-page.xml
export function navigatingTo(args: EventData) {
    // Get the event sender
    var page = <Page>args.object;
    page.bindingContext = new HelloWorldModel();

    var slider = <CarouselView>page.getViewById("carouselView");

    slider.on("positionSelected", function(eventData){
        console.log(eventData.eventName + " has been raised! by: " + eventData.object);
    });

    var addpage = <Label>page.getViewById("addPage");

    var observer = addpage.on(gestures.GestureTypes.tap, async function (args: gestures.GestureEventData) {
        //console.log("Tap");
        //var slider = <CarouselView>page.getViewById("carouselView");

        var person = new Person();
        person.first = "Alex";
        person.last = "Rainman";

        await slider.insertPage(3, person);
        slider.setCurrentPage(3);
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