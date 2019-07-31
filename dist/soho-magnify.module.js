"use strict";

function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _typeof(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    _typeof = function _typeof(obj) {
      return _typeof2(obj);
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
/**
 *
 * Picture magnifying glass
 * 圖片放大鏡
 * @see https://www.sohophp.com/soho-magnify
 * @author ZHAI Peng
 * @version 1.1.0
 * @dependencies jQuery
 */


var SohoMagnify =
/*#__PURE__*/
function () {
  function SohoMagnify(element, options) {
    _classCallCheck(this, SohoMagnify);

    this.element = element;
    this.$element = $(element);
    this.event = 'mousemove';
    this.eventOut = 'mouseleave';
    this.namespace = 'soho-magnify';
    this.options = this.getOptions(options);
    this.nativeWidth = 0;
    this.nativeHeight = 0;

    if (!this.$element.parent().hasClass('soho-magnify')) {
      this.$element.wrap('<div class="soho-magnify" />');
      this.$element.parent('.soho-magnify').append('<div class="soho-magnify-large" />');
    }

    this.$magnify = this.$element.parent('.soho-magnify');
    this.$magnify_large = this.$element.siblings('.soho-magnify-large');
    var large = this.$element.attr('src');

    if (this.$element.data('large')) {
      large = this.$element.data('large');
    }

    this.$magnify.css({
      width: this.$element.width(),
      height: this.$element.height(),
      cursor: this.options.cursor
    });

    if (this.options.glass === 1) {
      this.$magnify_large.addClass('soho-magnify-large-glass');
    } else {
      this.$magnify.css({
        overflow: 'hidden'
      });
    }

    this.$magnify_large.css('background', "url('".concat(large, "') no-repeat"));
    this.$magnify.on("".concat(this.event, ".").concat(this.namespace), jQuery.proxy(this.check, this)).on("".concat(this.eventOut, ".").concat(this.namespace), jQuery.proxy(this.check, this)).on("touchmove.".concat(this.namespace), jQuery.proxy(this.check, this)).on("touchend.".concat(this.namespace), jQuery.proxy(this.check, this));
  }

  _createClass(SohoMagnify, [{
    key: "getOptions",
    value: function getOptions() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        delay: 0,
        zoom: 1
      };
      options = jQuery.extend({}, {
        delay: 0,
        zoom: 1,
        glass: 1,
        cursor: 'none'
      }, options, this.$element.data());

      if (options.delay && typeof options.delay === 'number') {
        options.delay = {
          show: options.delay,
          hide: options.delay
        };
      }

      return options;
    }
  }, {
    key: "check",
    value: function check(e) {
      var _this = this;

      var container = jQuery(e.currentTarget);
      var self = container.children('img');
      var mag = container.children('.soho-magnify-large');

      if (!this.nativeWidth && !this.nativeHeight) {
        var image = new Image();
        image.src = self.data('large') ? self.data('large') : self.attr('src');
        image.addEventListener('load', function () {
          _this.nativeWidth = image.width;
          _this.nativeHeight = image.height;

          if (_this.nativeWidth <= container.width()) {
            _this.nativeWidth = container.width() * _this.options.zoom;
            _this.nativeHeight = container.height() * _this.options.zoom;
          }
        }, false);
      } else {
        var magnifyOffset = container.offset();
        var mx = e.pageX - magnifyOffset.left;
        var my = e.pageY - magnifyOffset.top;

        if (mx < container.width() && my < container.height() && mx > 0 && my > 0) {
          mag.fadeIn(100);
        } else {
          mag.fadeOut(100);
        }

        if (mag.is(':visible')) {
          if (this.options.glass === 1) {
            var rx = Math.round(mx / container.width() * this.nativeWidth - mag.width() / 2) * -1,
                ry = Math.round(my / container.height() * this.nativeHeight - mag.height() / 2) * -1,
                bgp = "".concat(rx, "px ").concat(ry, "px"),
                px = mx - mag.width() / 2,
                py = my - mag.height() / 2,
                bs = "".concat(this.nativeWidth, "px ").concat(this.nativeHeight, "px");
            mag.css({
              left: px,
              top: py,
              backgroundPosition: bgp,
              backgroundSize: bs
            });
          } else {
            mag.css({
              width: this.nativeWidth,
              height: this.nativeHeight
            });

            var maxleft = 0,
                maxtop = 0,
                minleft = (mag.width() - container.width()) * -1,
                mintop = (mag.height() - container.height()) * -1,
                left = Math.round(mx / container.width() * this.nativeWidth - container.width() / 2) * -1,
                top = Math.round(my / container.height() * this.nativeHeight - container.height() / 2) * -1,
                _bs = "".concat(this.nativeWidth, "px ").concat(this.nativeHeight, "px");

            if (left > maxleft) {
              left = maxleft;
            }

            if (top > maxtop) {
              top = maxtop;
            }

            if (left < minleft) {
              left = minleft;
            }

            if (top < mintop) {
              top = mintop;
            }

            mag.css({
              left: left,
              top: top,
              backgroundSize: _bs
            });
          }
        }
      }

      return e.preventDefault();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.$element.parent('.soho-magnify').off("".concat(this.event, ".").concat(this.namespace), jQuery.proxy(this.check, this)).off("".concat(this.eventOut, ".").concat(this.namespace), jQuery.proxy(this.check, this)).off("touchmove.".concat(this.namespace), jQuery.proxy(this.check, this)).off("touchend.".concat(this.namespace), jQuery.proxy(this.check, this));
      this.$element.siblings('.soho-magnify-large').remove();
      this.$element.unwrap();
      this.$element.removeData('soho-magnify');
    }
  }]);

  return SohoMagnify;
}();

exports.default = SohoMagnify;

jQuery.fn.SohoMagnify = function (option) {
  'use strict';

  return this.each(function () {
    var $this = jQuery(this),
        data = $this.data('soho-magnify'),
        options = _typeof(option) === 'object' && option;

    if (!data) {
      $this.data('soho-magnify', data = new SohoMagnify(this, options));
    }

    if (typeof option === 'string') {
      data[option]();
    }
  });
};

jQuery.fn.SohoMagnify.Constructor = SohoMagnify;
jQuery(window).on('load', function () {
  'use strict';

  jQuery("[data-toggle='soho-magnify']").each(function () {
    jQuery(this).SohoMagnify();
  });
});
//# sourceMappingURL=soho-magnify.module.js.map