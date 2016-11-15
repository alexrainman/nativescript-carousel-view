import { EventData } from "data/observable";
var frame = require('ui/frame');
import { CarouselView } from "nativescript-carousel-view";

export function onLoaded(args: EventData) {
    console.log('slide loaded');
}

export async function buttonTap(args: EventData) {    
    var page = frame.topmost().currentPage;
    var slider = <CarouselView>page.getViewById("carouselView");
    await slider.removePage(slider.position);
}

export function labelTap(args: EventData) {
    console.log('label tap from code behind');
}

export function stackTap(args: EventData) {
    console.log('stack tap from code behind');
}