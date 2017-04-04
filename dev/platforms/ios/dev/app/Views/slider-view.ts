var frame = require('ui/frame');

export function onLoaded(args) {
    console.log('slide loaded');
}

export async function buttonTap(args) {
    var page = frame.topmost().currentPage;
    var slider = page.getViewById("carouselView");
    await slider.removePage(slider.position);
}

export function labelTap(args) {
    console.log('label tap from code behind');
}

export function stackTap(args) {
    console.log('stack tap from code behind');
}