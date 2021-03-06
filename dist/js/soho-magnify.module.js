/**
 *
 * Picture magnifying glass
 * 圖片放大鏡
 * @see https://www.sohophp.com/soho-magnify
 * @author ZHAI Peng
 * @version 1.1.0
 * @dependencies jQuery
 */

export default class SohoMagnify { 
    constructor(element, options) {

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
            this.$element.parent('.soho-magnify')
                .append('<div class="soho-magnify-large" />');
        }

        this.$magnify = this.$element.parent('.soho-magnify');
        this.$magnify_large = this.$element.siblings('.soho-magnify-large');

        let large = this.$element.attr('src');
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

        this.$magnify_large.css('background', `url('${large}') no-repeat`);

        this.$magnify
            .on(`${this.event}.${this.namespace}`, jQuery.proxy(this.check, this))
            .on(`${this.eventOut}.${this.namespace}`, jQuery.proxy(this.check, this))
            .on(`touchmove.${this.namespace}`, jQuery.proxy(this.check, this))
            .on(`touchend.${this.namespace}`, jQuery.proxy(this.check, this));

    }

    getOptions(options = {delay: 0, zoom: 1}) {
        options = jQuery.extend({}, {delay: 0, zoom: 1, glass: 1, cursor: 'none'}, options, this.$element.data());
        if (options.delay && typeof options.delay === 'number') {
            options.delay = {
                show: options.delay,
                hide: options.delay
            };
        }
        return options;
    }

    check(e) {

        let container = jQuery(e.currentTarget);
        let self = container.children('img');
        let mag = container.children('.soho-magnify-large');
        if (!this.nativeWidth && !this.nativeHeight) {
            let image = new Image();
            image.src = self.data('large') ? self.data('large') : self.attr('src');
            image.addEventListener('load', () => {
                this.nativeWidth = image.width;
                this.nativeHeight = image.height;
                if (this.nativeWidth <= container.width()) {
                    this.nativeWidth = container.width() * this.options.zoom;
                    this.nativeHeight = container.height() * this.options.zoom;
                }
            }, false);
        } else {
            let magnifyOffset = container.offset();
            let mx = e.pageX - magnifyOffset.left;
            let my = e.pageY - magnifyOffset.top;

            if (mx < container.width() && my < container.height() && mx > 0 && my > 0) {
                mag.fadeIn(100);
            } else {
                mag.fadeOut(100);
            }

            if (mag.is(':visible')) {

                if (this.options.glass === 1) {
                    let rx = Math.round(mx / container.width() * this.nativeWidth - mag.width() / 2) * -1,
                        ry = Math.round(my / container.height() * this.nativeHeight - mag.height() / 2) * -1,
                        bgp = `${rx}px ${ry}px`,
                        px = mx - mag.width() / 2,
                        py = my - mag.height() / 2,
                        bs = `${this.nativeWidth}px ${this.nativeHeight}px`;

                    mag.css({
                        left: px,
                        top: py,
                        backgroundPosition: bgp,
                        backgroundSize: bs
                    });

                } else {

                    mag.css({
                        width: this.nativeWidth,
                        height: this.nativeHeight,
                    });

                    let
                        maxleft = 0,
                        maxtop = 0,
                        minleft = (mag.width() - container.width()) * -1,
                        mintop = (mag.height() - container.height()) * -1,
                        left = Math.round((mx / container.width() * this.nativeWidth - container.width() / 2)) * -1,
                        top = Math.round((my / container.height() * this.nativeHeight - container.height() / 2)) * -1,
                        bs = `${this.nativeWidth}px ${this.nativeHeight}px`;

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
                        backgroundSize: bs
                    });

                }


            }
        }
        return e.preventDefault();

    }

    destroy() {
        this.$element
            .parent('.soho-magnify')
            .off(`${this.event}.${this.namespace}`, jQuery.proxy(this.check, this))
            .off(`${this.eventOut}.${this.namespace}`, jQuery.proxy(this.check, this))
            .off(`touchmove.${this.namespace}`, jQuery.proxy(this.check, this))
            .off(`touchend.${this.namespace}`, jQuery.proxy(this.check, this));
        this.$element.siblings('.soho-magnify-large').remove();
        this.$element.unwrap();
        this.$element.removeData('soho-magnify');
    }

}


jQuery.fn.SohoMagnify = function (option) {
    'use strict';
    return this.each(function () {
        let $this = jQuery(this),
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

jQuery.fn.SohoMagnify.Constructor = SohoMagnify;

jQuery(window).on('load', function () {
    'use strict';
    jQuery(`[data-toggle='soho-magnify']`).each(function () {
        jQuery(this).SohoMagnify();
    });
});

