"use strict";
var builder = require("ui/builder");
var frame = require('ui/frame');
var MyTemplateSelector = (function () {
    function MyTemplateSelector() {
    }
    MyTemplateSelector.prototype.OnSelectTemplate = function (position, bindingContext) {
        var page = frame.topmost().currentPage;
        var view = builder.load({
            path: "~/Views/Slides",
            name: "slider-view",
            page: page
        });
        view.bindingContext = bindingContext;
        return view;
    };
    return MyTemplateSelector;
}());
exports.MyTemplateSelector = MyTemplateSelector;
//# sourceMappingURL=template-selector.js.map