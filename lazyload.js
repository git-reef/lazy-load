/*
 * @author: sungaofei
 */
( function( root, factory ) {

    "use strict";

    if (typeof exports === "object") {
        module.exports = factory(root);
    } else if (typeof define === "function" && define.amd) {
        define([], factory(root));
    } else {
        root.LazyLoad = factory(root);
    }

} )( typeof global !== "undefined" ? global : this.window || this.global, function(root) {

    "use strict";

    var imgConfig = {
        selector: ".lazy-load",
        src: "img-src",
        srcset: "img-srcset",
        srcerror: "error-src",
        scrollElId: ''
    };

    /**
     * 合并对象，返回新对象，可配置深/浅复制
     */
    var extend = function ()  {
        var extended = {};
        var deep = false;
        var i = 0;
        var length = arguments.length;

        if (Object.prototype.toString.call(arguments[0]) === "[object Boolean]") {
            deep = arguments[0];
            i++;
        }
        for (; i < length; i++) {
            ( function (obj) {
                for (var prop in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                        if (deep && Object.prototype.toString.call(obj[prop]) === "[object Object]") {
                            extended[prop] = extend(true, extended[prop], obj[prop]);
                        } else {
                            extended[prop] = obj[prop];
                        }
                    }
                }
            })(arguments[i]);
        }

        return extended;
    };

    function LazyLoad(options) {
        this.settings = extend(imgConfig, options || {});
        this.images = document.querySelectorAll(this.settings.selector);
        this.observer = null;
        if(this.images.length){
            this.init();
        }
    }

    LazyLoad.prototype = {
        init: function() {
            if (root.IntersectionObserver) {
                this.lazyLoadByObserver();
            }else if(this.settings.scrollElId) {
                this.lazyLoadByScroll();
            }else {
                this.loadImages();
            }
        },
        // 使用IntersectionObserver交叉观察器监听图片
        lazyLoadByObserver: function() {
            var self = this;
            var observerConfig = {
                root: null,
                rootMargin: "0px",
                threshold: [0]
            };

            this.observer = new IntersectionObserver(function(entries) {
                entries.forEach(function (entry) {
                    if (entry.intersectionRatio > 0) {
                        self.observer.unobserve(entry.target);
                        self.renderImage.call(self, entry.target);
                    }
                });
            }, observerConfig);

            this.images.forEach(function (image) {
                self.observer.observe(image);
            });
        },
        // IntersectionObserver不被支持时，使用滚动事件监听，使用函数防抖和节流控制
        lazyLoadByScroll: function () {
            var self = this;
            var currentIndex = 0;   // 优化1
            var timer = null;
            var scrollEl = null;
            var iterationImage = function () {
                for(var i = currentIndex, len = self.images.length; i < len; i++){
                    var image = self.images[i];
                    if(!image.isCheck) {
                        if(image.offsetTop - scrollEl.scrollTop < scrollEl.clientHeight){
                            self.renderImage.call(self, image);
                            image.isCheck = true;
                            currentIndex = i;
                        }else{
                            break;
                        }
                    }
                    if(currentIndex === len - 1 && scrollEl.onscroll){
                        scrollEl.onscroll = null;
                    }
                }
            };
            if(self.images.length){
                scrollEl = document.getElementById(self.settings.scrollElId);
                iterationImage();
                // var temp = setTimeout(function () {
                //     iterationImage();
                //     clearTimeout(temp);
                // },300);
            }
            scrollEl.onscroll = function () {
                if(timer){
                    // 优化2
                    // 函数节流: 判断是否已空闲，如果在执行中，则直接return
                    return;
                }
                timer = setTimeout(function () {
                    iterationImage();
                    clearTimeout(timer);
                    timer = null;
                }, 150);
            }
        },
        // 直接加载图片
        loadImages: function () {
            if (!this.settings) { return; }
            var self = this;
            for(var i = 0, len = this.images.length; i < len; i++){
                this.renderImage.call(this, this.images[i]);
            }
        },
        // 添加图片路径，渲染
        renderImage: function (image) {
            var src = image.getAttribute(this.settings.src);
            var srcset = image.getAttribute(this.settings.srcset);
            var srcerror = image.getAttribute(this.settings.srcerror);
            if ("img" === image.tagName.toLowerCase()) {
                if (src) {
                    image.src = src;
                }
                if (srcset) {
                    image.srcset = srcset;
                }
                if(!src && !srcset && srcerror) {
                    image.src = srcerror;
                }
            } else {
                image.style.backgroundImage = "url(" + (src || srcerror) + ")";
            }
        },

        // 页面销毁时调用， 对象置空，监听关闭
        destroy: function () {
            if (!this.settings) { return; }
            if(this.observer){ this.observer.disconnect(); }
            this.settings = null;
        }
    }
    root.lazyload = function(options) {
        return new LazyLoad(options);
    };

    return LazyLoad;
})