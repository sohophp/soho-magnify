/**
 *
 * Picture magnifying glass
 * 圖片放大鏡
 * @see https://www.sohophp.com/soho-magnify
 * @author ZHAI Peng
 * @version 1.0.4
 * @dependencies jQuery
 */

!function (a, b) {
    'use strict';
    "object" == typeof exports && "object" == typeof module ? module.exports = b(jQuery) : "function" == typeof define && define.amd ? define(['jquery'], b)  : "object" == typeof exports ? exports.SohoMagnify = b(jQuery) : a.SohoMagnify = b(jQuery);

}(this, function ($ ) {
    'use strict';

    var SohoMagnify = function (element, options) {

        this.element = element;
        this.$element = $(element);
        this.options = this.getOptions(options);

        if (!this.$element.parent().hasClass('soho-magnify')) {
            this.$element.wrap('<div class="soho-magnify" />');
            this.$element.parent('.soho-magnify')
                .append('<div class="soho-magnify-large" />');
        }

        var large = this.$element.attr('src');
        if (this.$element.data('large')) {
            large = this.$element.data('large');
        }

        this.$element
            .siblings('.soho-magnify-large')
            .css('background', 'url(\'' + large+'\') no-repeat');

        this.$element
            .parent('.soho-magnify')
            .on(this.event + '.' + this.namespace, $.proxy(this.check, this))
            .on(this.eventOut + '.' + this.namespace, $.proxy(this.check, this))
            .on('touchmove.' + this.namespace, $.proxy(this.check, this))
            .on('touchend.' + this.namespace, $.proxy(this.check, this));
    };

    SohoMagnify.prototype = {
        element:null,
        $element:null,
        event: 'mousemove',
        eventOut: 'mouseleave',
        namespace: 'soho-magnify',
        nativeWidth: 0,
        nativeHeight: 0,

        getOptions:function(options) {

            options = $.extend({}, {delay: 0, zoom: 1}, options, this.$element.data());
            if (options.delay && typeof options.delay === 'number') {
                options.delay = {
                    show: options.delay,
                    hide: options.delay
                };
            }
            return options;
        },

        check:function(e) {

            var o=this,
                container = $(e.currentTarget),
                self = container.children('img'),
                mag = container.children('.soho-magnify-large');


            if (!this.nativeWidth && !this.nativeHeight) {
                var image = new Image();
                image.src = self.data('large') ? self.data('large') : self.attr('src');
                $(image).on('load', function (e) {
                    o.nativeWidth = image.width * o.options.zoom;
                    o.nativeHeight = image.height * o.options.zoom;
                    if (o.options.zoom === 1) {
                        if (o.nativeWidth <= container.width()) {
                            o.nativeWidth *= 1.5;
                            o.nativeHeight *= 1.5;
                        }
                    }
                });
            } else {
                var magnifyOffset = container.offset(),
                    mx = e.pageX - magnifyOffset.left,
                    my = e.pageY - magnifyOffset.top;

                if (mx < container.width() && my < container.height() && mx > 0 && my > 0) {
                    mag.fadeIn(100);
                } else {
                    mag.fadeOut(100);
                }

                if (mag.is(':visible')) {
                    let rx = Math.round(mx / container.width() * this.nativeWidth - mag.width() / 2) * -1,
                        ry = Math.round(my / container.height() * this.nativeHeight - mag.height() / 2) * -1,
                        bgp = rx + 'px ' + ry + 'px',
                        px = mx - mag.width() / 2,
                        py = my - mag.height() / 2,
                        bs = this.nativeWidth + 'px ' + this.nativeHeight + 'px';

                    mag.css({
                        left: px,
                        top: py,
                        backgroundPosition: bgp,
                        backgroundSize: bs
                    });
                }
            }

        },
        destroy:function () {
            this.$element
                .parent('.soho-magnify')
                .off(this.event + '.' + this.namespace, $.proxy(this.check, this))
                .off(this.eventOut + '.' + this.namespace, $.proxy(this.check, this))
                .off('touchmove.' + this.namespace, $.proxy(this.check, this))
                .off('touchend.' + this.namespace, $.proxy(this.check, this));

            this.$element.siblings('.soho-magnify-large').remove();
            this.$element.unwrap();
            this.$element.removeData('soho-magnify');
        }
    };


    $.fn.SohoMagnify = function (option) {
        'use strict';
        return this.each(function () {
            let $this = $(this),
                data = $this.data('soho-magnify'),
                options = typeof option === 'object' && option;
            if (!data) {
                $this.data('soho-magnify', (data = new SohoMagnify(this, options)));
            }
            if (typeof option === 'string') {
                data[option]();
            }
        });
    };

    $.fn.SohoMagnify.Constructor = SohoMagnify;

    $(window).on('load', function () {
        $('[data-toggle=\'soho-magnify\']').each(function () {
            $(this).SohoMagnify();
        });
    });

    return SohoMagnify;

});
