/**
 * 用于下载各种文件
 */
(function($) {
    var methods = {
        _download: function(options) {
            var triggerDelay = (options && options.delay) || 100;
            var removeDelay = (options && options.removeDelay) || 1000;
            if (options.source === "server") {
                this.each(function(index, item) {
                    methods._createIFrame(item, index * triggerDelay, removeDelay);
                });
            };
            if (options.source === "local") {
                this.each(function(index, item) {
                    methods._createLink(item, index * triggerDelay, removeDelay);
                });
            };
 
 
        },
        _createIFrame: function(url, triggerDelay, removeDelay) {
            //动态添加iframe，设置src，然后删除
            setTimeout(function() {
                var frame = $('<iframe style="display: none;" class="multi-download"></iframe>');
                frame.attr('src', url);
                $(document.body).after(frame);
                setTimeout(function() {
                    frame.remove();
                }, removeDelay);
            }, triggerDelay);
        },
        //download属性设置
        _createLink: function(url, triggerDelay, removeDelay) {
            var aLink = document.createElement("a"),
                evt = document.createEvent("HTMLEvents"); //创建合适的事件对象
 
            evt.initEvent("click"); //初始化新创建的 Event 对象的属性
            //需要添加属性，不需要设置文件名，个人测试就是原文件名，设为空没有问题，具体情况具体分析
            aLink.download = "";
            aLink.href = url;
            aLink.dispatchEvent(evt); //dispatchEvent绑定事件,分派事件对象
        }
    };
 
    $.fn.multiDownload = function(options) {
        methods._download.apply(this, arguments);
    };
 
})(jQuery);