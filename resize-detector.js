'use strict';
!function(EMSarray, factory) {
  if ("object" == typeof exports && "undefined" != typeof module) {
    factory(exports);
  } else {
    if ("function" == typeof define && define.amd) {
      define(["exports"], factory);
    } else {
      factory(EMSarray.resizeDetector = {});
    }
  }
}(this, function(window) {
  /**
   * @param {string} name
   * @param {number} x
   * @return {?}
   */
  function el(name, x) {
    if (void 0 === x) {
      x = {};
    }
    /** @type {!Element} */
    var t = document.createElement(name);
    return Object.keys(x).forEach(function(k) {
      t[k] = x[k];
    }), t;
  }
  /**
   * @param {!Object} obj
   * @param {string} name
   * @param {string} value
   * @return {?}
   */
  function getStyle(obj, name, value) {
    return (window.getComputedStyle(obj, value || null) || {
      display : "none"
    })[name];
  }
  /**
   * @param {!Object} handle
   * @return {?}
   */
  function load(handle) {
    if (!document.documentElement.contains(handle)) {
      return {
        detached : true,
        rendered : false
      };
    }
    /** @type {!Object} */
    var element = handle;
    for (; element !== document;) {
      if ("none" === getStyle(element, "display")) {
        return {
          detached : false,
          rendered : false
        };
      }
      element = element.parentNode;
    }
    return {
      detached : false,
      rendered : true
    };
  }
  /**
   * @return {undefined}
   */
  function init() {
    var delete_class_form;
    var i;
    var content = this;
    resetTriggers(this);
    if (this.__resize_raf__) {
      delete_class_form = this.__resize_raf__;
      if (!$) {
        $ = (window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || function(e) {
          clearTimeout(e);
        }).bind(window);
      }
      $(delete_class_form);
    }
    this.__resize_raf__ = (i = function() {
      var el;
      var _ref;
      var width;
      var height;
      var w;
      var h;
      /** @type {(null|{height: ?, width: ?})} */
      var tagString = (_ref = (el = content).__resize_last__, width = _ref.width, height = _ref.height, w = el.offsetWidth, h = el.offsetHeight, w !== width || h !== height ? {
        width : w,
        height : h
      } : null);
      if (tagString) {
        content.__resize_last__ = tagString;
        resolve(content);
      }
    }, add || (add = (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(_nextEventFunc) {
      return setTimeout(_nextEventFunc, 16);
    }).bind(window)), add(i));
  }
  /**
   * @param {!Object} comment
   * @return {undefined}
   */
  function resolve(comment) {
    if (comment && comment.__resize_listeners__) {
      comment.__resize_listeners__.forEach(function(r) {
        r.call(comment);
      });
    }
  }
  /**
   * @param {!Object} element
   * @return {undefined}
   */
  function resetTriggers(element) {
    var e = element.__resize_triggers__;
    var elem = e.expand;
    var expandChild = e.expandChild;
    var data = e.contract;
    var c = data.scrollWidth;
    var last = data.scrollHeight;
    var triggerWidth = elem.offsetWidth;
    var height = elem.offsetHeight;
    var width = elem.scrollWidth;
    var scrollHeight = elem.scrollHeight;
    data.scrollLeft = c;
    data.scrollTop = last;
    /** @type {string} */
    expandChild.style.width = triggerWidth + 1 + "px";
    /** @type {string} */
    expandChild.style.height = height + 1 + "px";
    elem.scrollLeft = width;
    elem.scrollTop = scrollHeight;
  }
  /** @type {null} */
  var add = null;
  /** @type {null} */
  var $ = null;
  /** @type {string} */
  var iframe_template = '.resize-triggers{visibility:hidden;opacity:0}.resize-contract-trigger,.resize-contract-trigger:before,.resize-expand-trigger,.resize-triggers{content:"";position:absolute;top:0;left:0;height:100%;width:100%;overflow:hidden}.resize-contract-trigger,.resize-expand-trigger{background:#eee;overflow:auto}.resize-contract-trigger:before{width:200%;height:200%}';
  /** @type {number} */
  var o = 0;
  /** @type {null} */
  var d = null;
  /**
   * @param {!Object} el
   * @param {?} inputEl
   * @return {undefined}
   */
  window.addListener = function(el, inputEl) {
    var content;
    var node;
    if (el.__resize_mutation_handler__ || (el.__resize_mutation_handler__ = function() {
      var anchor = load(this);
      var host = anchor.rendered;
      var pathname = anchor.detached;
      if (host !== this.__resize_rendered__) {
        if (!pathname && this.__resize_triggers__) {
          resetTriggers(this);
          this.addEventListener("scroll", init, true);
        }
        this.__resize_rendered__ = host;
        resolve(this);
      }
    }.bind(el)), !el.__resize_listeners__) {
      if (el.__resize_listeners__ = [], window.ResizeObserver) {
        var w = el.offsetWidth;
        var h = el.offsetHeight;
        var onmount = new ResizeObserver(function() {
          if (el.__resize_observer_triggered__ || (el.__resize_observer_triggered__ = true, el.offsetWidth !== w || el.offsetHeight !== h)) {
            resolve(el);
          }
        });
        var data = load(el);
        var method = data.detached;
        var url = data.rendered;
        /** @type {boolean} */
        el.__resize_observer_triggered__ = false === method && false === url;
        el.__resize_observer__ = onmount;
        onmount.observe(el);
      } else {
        if (el.attachEvent && el.addEventListener) {
          /**
           * @return {undefined}
           */
          el.__resize_legacy_resize_handler__ = function() {
            resolve(el);
          };
          el.attachEvent("onresize", el.__resize_legacy_resize_handler__);
          document.addEventListener("DOMSubtreeModified", el.__resize_mutation_handler__);
        } else {
          if (o || (content = iframe_template, (node = document.createElement("style")).type = "text/css", node.styleSheet ? node.styleSheet.cssText = content : node.appendChild(document.createTextNode(content)), (document.querySelector("head") || document.body).appendChild(node), d = node), function(node) {
            var s = getStyle(node, "position");
            if (!(s && "static" !== s)) {
              /** @type {string} */
              node.style.position = "relative";
            }
            node.__resize_old_position__ = s;
            node.__resize_last__ = {};
            var input = el("div", {
              className : "resize-triggers"
            });
            var tr = el("div", {
              className : "resize-expand-trigger"
            });
            var thead = el("div");
            var name = el("div", {
              className : "resize-contract-trigger"
            });
            tr.appendChild(thead);
            input.appendChild(tr);
            input.appendChild(name);
            node.appendChild(input);
            node.__resize_triggers__ = {
              triggers : input,
              expand : tr,
              expandChild : thead,
              contract : name
            };
            resetTriggers(node);
            node.addEventListener("scroll", init, true);
            node.__resize_last__ = {
              width : node.offsetWidth,
              height : node.offsetHeight
            };
          }(el), el.__resize_rendered__ = load(el).rendered, window.MutationObserver) {
            /** @type {!MutationObserver} */
            var observer = new MutationObserver(el.__resize_mutation_handler__);
            observer.observe(document, {
              attributes : true,
              childList : true,
              characterData : true,
              subtree : true
            });
            /** @type {!MutationObserver} */
            el.__resize_mutation_observer__ = observer;
          }
        }
      }
    }
    el.__resize_listeners__.push(inputEl);
    o++;
  };
  /**
   * @param {!Node} element
   * @param {?} callback
   * @return {?}
   */
  window.removeListener = function(element, callback) {
    if (element.detachEvent && element.removeEventListener) {
      return element.detachEvent("onresize", element.__resize_legacy_resize_handler__), void document.removeEventListener("DOMSubtreeModified", element.__resize_mutation_handler__);
    }
    var events = element.__resize_listeners__;
    if (events) {
      events.splice(events.indexOf(callback), 1);
      if (!events.length) {
        if (element.__resize_observer__) {
          element.__resize_observer__.unobserve(element);
          element.__resize_observer__.disconnect();
          /** @type {null} */
          element.__resize_observer__ = null;
        } else {
          if (element.__resize_mutation_observer__) {
            element.__resize_mutation_observer__.disconnect();
            /** @type {null} */
            element.__resize_mutation_observer__ = null;
          }
          element.removeEventListener("scroll", init);
          element.removeChild(element.__resize_triggers__.triggers);
          /** @type {null} */
          element.__resize_triggers__ = null;
        }
        /** @type {null} */
        element.__resize_listeners__ = null;
      }
      if (!--o && d) {
        d.parentNode.removeChild(d);
      }
    }
  };
  Object.defineProperty(window, "__esModule", {
    value : true
  });
});
