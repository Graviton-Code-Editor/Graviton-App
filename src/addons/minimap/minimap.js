(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
        mod(require("codemirror"));
    else if (typeof define == "function" && define.amd) // AMD
        define(["codemirror"], mod);
    else // Plain browser env
        mod(CodeMirror)
})((CodeMirror) => {
    'use strict';
    let ActiveMinimap,
        ActiveMinimapViewFrame,
        ActiveMinimapViewFrameSize,
        ActiveMinimapCM,
        ActiveCM,
        isVisible = false;
    /**
     *
     *
     * @class MiniMap
     */
    class MiniMap {
        constructor(cm) {
            this.cm = cm;
            this.pos = 0;
            this.node = create("div", "map");
            this.node__code = CodeMirror(this.node);
            this.node__view = this.node.appendChild(create("div", "map__view faded "));
            this.node__scrollbar = this.node__code.getWrapperElement().appendChild(create("div", "map__scrollbar"));
            this.editor_view = this.node_view_size = this.editor_total = 0;
            this.init(cm);
        }
        init(cm) {
            this.node__code.swapDoc(this.cm.linkedDoc());
            this.wrapper = this.cm.getWrapperElement();
            this.width = this.cm.getOption("miniMapWidth");
            this.scroller = this.cm.getScrollerElement();
            for (var i = 1; i < this.wrapper.childNodes.length; i++) {
                this.wrapper.childNodes[i].style.marginRight = this.width;
            }
            if (this.wrapper.querySelector(".CodeMirror-simplescroll-vertical") !== null) {
                this.wrapper.querySelector(".CodeMirror-simplescroll-vertical").style.visibility = "hidden";
            }
            this.wrapper.insertBefore(this.node, this.wrapper.firstChild.nextElementSibling);
            this.node.style.width = this.width;
            this.events(this.cm);
            this.changeOptions(cm);
            ActiveCM = this.cm;
            ActiveMinimap = ActiveCM.getWrapperElement().querySelector(".map");
            ActiveMinimapCM = this.node__code;
            ActiveMinimapViewFrame = ActiveCM.getWrapperElement().querySelector(".map__view");
            this.refreshViewFrameSize(this.cm)
            this.show(this, this.hide(this.cm));

        }
        events(cm) {
            const that = this;
            CodeMirror.on(cm, "mousedown", () => {
                ActiveCM = that.cm = cm;
                ActiveMinimap = ActiveCM.getWrapperElement().querySelector(".map");
                ActiveMinimapCM = that.node__code;
                ActiveMinimapViewFrame = ActiveCM.getWrapperElement().querySelector(".map__view");
                that._scrollTop(that.scroller.scrollTop);
                that.show(that, that.hide(self));
            });
            CodeMirror.on(that.cm, "focus", function() {
                ActiveMinimapCM = that.node__code;
                that.show(that, that.hide(self));
                that.applyViewFrameSize(cm);
            });
            CodeMirror.on(that.cm, "scroll", function() {
                that._moveViewFrame(that.scroller.scrollTop)
                that.show(that, that.hide(self));
            });
            
            CodeMirror.on(that.cm, "refresh", function() {
                //if(ActiveCM.getWrapperElement().querySelector(".map")==undefined) return;
                setTimeout(() => {
                    that.changeOptions(that.cm);
                    that.applyViewFrameSize(cm)
                    ActiveCM = that.cm;
                    ActiveMinimap = ActiveCM.getWrapperElement().querySelector(".map");
                    ActiveMinimapCM = that.node__code;
                    ActiveMinimapViewFrame = ActiveCM.getWrapperElement().querySelector(".map__view");
                    that.refreshViewFrameSize(that.cm)
                    that.show(that, that.hide(that.cm));
                    that.cm.setOption("scrollbarStyle",null)
                });
            });
        }
        changeOptions(cm) {
            this.node__code.setSize(this.cm.getScrollInfo().clientWidth);
            this.node__code.setOption("scrollbarStyle", null);
            this.node__code.setOption("readOnly", true);
            this.node__code.setOption("theme", this.cm.getOption("theme"));
            this.node__code.setOption("mode", this.cm.getOption("mode"));
            this.node__code.setOption("vieportMargin", "infinity");
            this.node__code.getWrapperElement().style.fontSize = cm.defaultTextHeight() / 4 + "px";
            this.node__code.getWrapperElement().style.lineHeight = cm.defaultTextHeight() / 4 + "px";
            this.node__code.getWrapperElement().style.width = cm.getWrapperElement().offsetWidth / 4 + "px";
        }
        show(self, callback) {
            if (isVisible == false) {
                self.node__view.classList.remove("transition");
                self.node__view.classList.remove("faded");
                self.node__view.classList.add("active");
                self._events(self);
                self._moveViewFrame(ActiveCM.getScrollerElement().scrollTop);
                isVisible = true;
            }
            callback
        }
        hide(self) {
            if (isVisible == true) {
                let active = document.querySelector(".map__view.active");
                if (active) {
                    document.querySelector(".map__view.active").classList.add("faded");
                    document.querySelector(".map__view.active").classList.remove("active");
                }
                isVisible = false
            }
        }
        applyViewFrameSize(cm) {
            if (ActiveCM) {
                this.refreshViewFrameSize(ActiveCM);
                this._scrollTop(this.scroller.scrollTop);
                ActiveCM.focus();
            }
        }
        refreshViewFrameSize(cm) {
            let editor_total, editor_view, map_total, factor;
            editor_total = cm.getScrollInfo().height;
            editor_view = cm.getScrollInfo().clientHeight;
            map_total = ActiveMinimapCM.getScrollInfo().height;
            factor = editor_view / editor_total;
            if (editor_total !== this.editor_total || editor_view !== this.editor_view || map_total !== this.map_total) {
                this.editor_total = editor_total;
                this.editor_view = editor_view;
                this.map_total = map_total;
                this.factor = factor;
                this.node_view_size = map_total * factor;
                this._topFactor(this);
                this._minimapScrollFactor(this);
                this.node__code.getScrollerElement().style.maxHeight = this.editor_view;
                if (ActiveMinimapViewFrame !== undefined) {
                    var lineLength = this.editor_view / cm.defaultTextHeight(),
                        viewSize = this.node__code.defaultTextHeight() * lineLength;
                    ActiveMinimapViewFrame.style.height = viewSize + "px";
                }
                this._moveViewFrame(this.pos, ActiveMinimapViewFrameSize !== this.size);
            }
            return true;
        }
        _topFactor(self) {
            var scrollSize = self.editor_view > self.map_total ? self.map_total : self.editor_view;
            ActiveMinimapViewFrameSize = self.node_view_size;
            return self.topfactor = scrollSize / self.editor_total;
        }
        _minimapScrollFactor(self) {
            var scroll, mapscroll;
            scroll = self.editor_total - self.editor_view;
            mapscroll = self.map_total - self.editor_view > 0 ? self.map_total - self.editor_view : 0;
            return self.scrollFactor = mapscroll / scroll;
        }
        _scrollTop(pos) {
            if (this._moveViewFrame(pos)) {
                this.scroller.scrollTop = pos;
            }
        }
        _moveViewFrame(pos, force) {
            let maxScroll = this.editor_total - this.editor_view;
            let posTop = pos * this.topfactor;
            let offsetBottom = 0;
            if (this.cm.getWrapperElement().querySelector(".CodeMirror-simplescroll-horizontal") !== null) {
                offsetBottom = this.cm.getWrapperElement().querySelector(".CodeMirror-simplescroll-horizontal").offsetHeight;
            }
            if (pos >= maxScroll) return false;
            if (!force && pos == this.pos) return false;
            this.pos = pos;
            this.viewFrame_pos = this.node__view.getBoundingClientRect().y;
            this.node__code.getScrollerElement().scrollTop = pos * this.scrollFactor;
            this.node__view.style.transform = "translateY(" + ((posTop <= 0 ? 0 : posTop) - offsetBottom) + "px)"; //set minimap view position top
            return true;
        }
        _events(self) {
            var _map = ActiveMinimapCM.getWrapperElement()
            CodeMirror.on(ActiveMinimapViewFrame, "mousedown", function(e) {
                if (e.which != 1) return;
                CodeMirror.e_preventDefault(e);
                let pos,
                    start = e.pageY,
                    startpos = self.pos;
                function done() {
                    CodeMirror.off(ActiveMinimap, "mousemove", move);
                    CodeMirror.off(document, "mouseup", done);
                }
                function move(e) {
                    pos = startpos + (e.pageY - start) / self.topfactor;
                    self._scrollTop(pos);
                }
                CodeMirror.on(ActiveMinimap, "mousemove", move);
                CodeMirror.on(document, "mouseup", done);
            });
            CodeMirror.on(_map, "mousedown", function(e) {
                if (e.which != 1) return;
                CodeMirror.e_preventDefault(e);
                let pos,
                    start = ActiveMinimapViewFrame.getBoundingClientRect().top,
                    startpos = self.pos,
                    centered = ActiveMinimapViewFrame.offsetHeight / 2;
                function done() {
                    CodeMirror.off(_map, "mousedown", move);
                    CodeMirror.off(_map, "mouseup", done);
                }
                function move(e) {
                    pos = startpos + (e.pageY - start - centered) / self.topfactor;
                    self._scrollTop(pos);
                };
                CodeMirror.on(_map, "click", move);
                CodeMirror.on(_map, "mouseup", done);
            });
        }
    }
    CodeMirror.defineOption("miniMap", false, function(cm, val, old) {
        if (old && old != CodeMirror.Init) {
            return;
        }
        if (old == CodeMirror.Init) old = false;
        if (!old == !val) {
            return;
        }
        if (val) {
            var minimap = new MiniMap(cm)
        }
    });
    CodeMirror.defineOption("miniMapWidth", 135);
    CodeMirror.defineOption("miniMapPosition", "right");
    function create(tag, className, id, styles) {
        var element = document.createElement(tag);
        var attr = className || id || styles;
        if (attr !== undefined && attr !== null) {
            if (typeof attr == "object") {
                var styleName = attr;
                for (var key in attr) {
                    element.style[key] = styleName[key]
                }
            } else {
                attr = [className, id]
                if (className !== undefined) element.className = attr[0];
                if (id !== undefined) element.id = attr[1];
            }
        }
        return element;
    }
    function applyToAll(selector) {}
    /**
     * mouse wheel event handle
     * getting from https://developer.mozilla.org/en-US/docs/Web/Events/wheel
     */
    (function() {
        var prefix = "",
            _addEventListener, support;
        // detect event model
        if (window.addEventListener) {
            _addEventListener = "addEventListener";
        } else {
            _addEventListener = "attachEvent";
            prefix = "on";
        }
        // detect available wheel event
        support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
            document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
            "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox
        window.addWheelListener = function(elem, callback, useCapture) {
            _addWheelListener(elem, support, callback, useCapture);
            // handle MozMousePixelScroll in older Firefox
            if (support == "DOMMouseScroll") {
                _addWheelListener(elem, "MozMousePixelScroll", callback, useCapture);
            }
        };
        function _addWheelListener(elem, eventName, callback, useCapture) {
            elem[_addEventListener](prefix + eventName, support == "wheel" ? callback : function(originalEvent) {
                !originalEvent && (originalEvent = window.event);
                // create a normalized event object
                var event = {
                    // keep a ref to the original event object
                    originalEvent: originalEvent,
                    target: originalEvent.target || originalEvent.srcElement,
                    type: "wheel",
                    deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
                    deltaX: 0,
                    deltaY: 0,
                    deltaZ: 0,
                    preventDefault: function() {
                        originalEvent.preventDefault ?
                            originalEvent.preventDefault() :
                            originalEvent.returnValue = false;
                    }
                };
                // calculate deltaY (and deltaX) according to the event
                if (support == "mousewheel") {
                    event.deltaY = -1 / 40 * originalEvent.wheelDelta;
                    // Webkit also support wheelDeltaX
                    originalEvent.wheelDeltaX && (event.deltaX = -1 / 40 * originalEvent.wheelDeltaX);
                } else {
                    event.deltaY = originalEvent.deltaY || originalEvent.detail;
                }
                // it's time to fire the callback
                return callback(event);
            }, useCapture || false);
        }
    })();
})