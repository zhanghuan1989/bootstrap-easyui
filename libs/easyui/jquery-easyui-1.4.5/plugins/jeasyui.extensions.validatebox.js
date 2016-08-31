/**
* jQuery EasyUI 1.3.6
* Copyright (c) 2009-2014 www.jeasyui.com. All rights reserved.
*
* Licensed under the GPL or commercial licenses
* To use it on other terms please contact author: info@jeasyui.com
* http://www.gnu.org/licenses/gpl.txt
* http://www.jeasyui.com/license_commercial.php
*
* jQuery EasyUI validatebox Extensions 1.0 beta
* jQuery EasyUI validatebox 组件扩展
* jeasyui.extensions.validatebox.js
* 二次开发 流云
* 最近更新：2014-06-18
*
* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*
* Copyright (c) 2013-2014 ChenJianwei personal All rights reserved.
* http://www.chenjianwei.org
* 
* 		required: "必选字段",
        remote: "请修正该字段",
        email: "请输入正确格式的电子邮件",
        url: "请输入合法的网址",
        date: "请输入合法的日期",
        dateISO: "请输入合法的日期 (ISO).",
        number: "请输入合法的数字",
        digits: "只能输入整数",
        creditcard: "请输入合法的信用卡号",
        equalTo: "请再次输入相同的值",
        accept: "请输入拥有合法后缀名的字符串",
        maxlength: jQuery.format("请输入一个长度最多是 {0} 的字符串"),
        minlength: jQuery.format("请输入一个长度最少是 {0} 的字符串"),
        rangelength: jQuery.format("请输入一个长度介于 {0} 和 {1} 之间的字符串"),
        range: jQuery.format("请输入一个介于 {0} 和 {1} 之间的值"),
        max: jQuery.format("请输入一个最大为 {0} 的值"),
        min: jQuery.format("请输入一个最小为 {0} 的值")

		data-options="required:false,validType:'email'" //非必填项，验证邮箱
		data-options="required:true,validType:'length[1,3]'" //必填项，输入字符长度1-3位
		data-options="required:true,validType:['name','length[6,16]']" //必填项，验证用户名，输入字符长度6-16位
		boolen b = $('#txt_Name').validatebox("isValid");//单个元素验证结果
		//表单验证效果 onSubmit
		var isValid = $("#formId").form('validate');
		if (!isValid){
			$.messager.progress('close');	
		}
		return isValid;	
*/
(function ($, undefined) {
	

    $.fn.validatebox.extensions = {};


    var rules = {
    	//  去除前后空格不为空
		notBlank: {
            validator: function (value) { return $.string.trim(value) != '' },
            message: '该输入项为必填项'
        },
        //  只允许输入英文字母或数字
        engNum: {
            validator: function (value) {
                return /^[0-9a-zA-Z]*$/.test(value);
            },
            message: '请输入英文字母或数字'
        },
        //  只允许汉字、英文字母或数字
        chsEngNum: {
            validator: function (value, param) {
                return /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9])*$/.test(value);
            },
            message: '只允许汉字、英文字母或数字。'
        },
        //  只允许汉字、英文字母、数字及下划线
        code: {
            validator: function (value, param) {
                return /^[\u0391-\uFFE5\w]+$/.test(value);
            },
            message: '只允许汉字、英文字母、数字及下划线.'
        },
        //  验证是否为合法的用户名
        name: {
            validator: function (value) { return value.isUserName(); },
            message: "用户名不合法(字母开头，允许6-16字节，允许字母数字下划线)"
        },
        //  指定字符最小长度  data-options="required:true,validType:'minLength[2]'"
        minLength: {
            validator: function (value, param) { return $.string.trim(value).length >= param[0]; },
            message: "最少输入 {0} 个字."
        },
        // 指定字符最大长度
        maxLength : {
            validator: function (value, param) { return $.string.trim(value).length <= param[0]; },
            message: "最多输入 {0} 个字."
        },
        //  最多输入8位整数，2位小数
        floatNumber: {
            validator: function (value, param) 
            {  
            	return /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/.test(value);
            },
            message: "最多输入8位整数，2位小数."
        },
        //  必须包含指定的内容
        contains: {
            validator: function (value, param) { return $.string.contains(value, param[0]); },
            message: "输入的内容必须包含 {0}."
        },
        //  以指定的字符开头
        startsWith: {
            validator: function (value, param) { return $.string.startsWith(value, param[0]); },
            message: "输入的内容必须以 {0} 作为起始字符."
        },
        //  以指定的字符结束
        endsWith: {
            validator: function (value, param) { return $.string.endsWith(value, param[0]); },
            message: "输入的内容必须以 {0} 作为起始字符."
        },
        //  长日期时间(yyyy-MM-dd hh:mm:ss)格式
        longDate: {
            validator: function (value) { return $.string.isLongDate(value); },
            message: "输入的内容必须是长日期时间(yyyy-MM-dd hh:mm:ss)格式."
        },
        //  短日期(yyyy-MM-dd)格式
        shortDate: {
            validator: function (value) { return $.string.isShortDate(value); },
            message: "输入的内容必须是短日期(yyyy-MM-dd)格式."
        },
        //  长日期时间(yyyy-MM-dd hh:mm:ss)或短日期(yyyy-MM-dd)格式
        date: {
            validator: function (value) { return $.string.isDate(value); },
            message: "输入的内容必须是长日期时间(yyyy-MM-dd hh:mm:ss)或短日期(yyyy-MM-dd)格式."
        },
        //  电话号码(中国)格式
        tel: {
            validator: function (value) { return $.string.isTel(value); },
            message: "输入的内容必须是电话号码(中国)格式."
        },
        //  移动电话号码(中国)格式
        mobile: {
            validator: function (value) { return $.string.isMobile(value); },
        //	validator: function (value) {return /^(13|14|15|17|18)\d{9}$/i.test(value);},
        //	validator: function(value) { return /^(88888888888)|^1\d{10}$/i.test(value); },
            message: "手机号码格式错误"
        },
        //  电话号码(中国)或移动电话号码(中国)格式
        telOrMobile: {
        //  validator: function (value) { return $.string.isTelOrMobile(value); },
        	validator: function(value) { return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value) || /^1\d{10}$/i.test(value); },
            message: "输入的内容必须是电话号码(中国)或移动电话号码(中国)格式."
        },
        //  传真号码(中国)格式
        fax: {
            validator: function (value) { return $.string.isFax(value); },
            message: "输入的内容必须是传真号码(中国)格式."
        },
        //  邮政编码(中国)格式
        zipCode: {
            validator: function (value) { return $.string.isZipCode(value); },
            message: "输入的内容必须是邮政编码(中国)格式."
        },
        //  必须包含中文汉字
        existChinese: {
            validator: function (value) { return $.string.existChinese(value); },
            message: "输入的内容必须是包含中文汉字."
        },
        //  必须是纯中文汉字
        chinese: {
            validator: function (value) { return $.string.isChinese(value); },
            message: "输入的内容必须是纯中文汉字."
        },
        //  必须是纯英文字母
        english: {
            validator: function (value) { return $.string.isEnglish(value); },
            message: "输入的内容必须是纯英文字母."
        },
        //  必须是合法的文件名(不能包含字符 \\/:*?\"<>|)
        fileName: {
            validator: function (value) { return $.string.isFileName(value); },
            message: "输入的内容必须是合法的文件名(不能包含字符 \\/:*?\"<>|)."
        },
        //  必须是正确的 IP地址v4 格式
        ip: {
            validator: function (value) { return $.string.isIPv4(value); },
            message: "输入的内容必须是正确的 IP地址v4 格式."
        },
        //  必须是正确的 url 格式
        url: {
            validator: function (value) { return $.string.isUrl(value); },
            message: "输入的内容必须是正确的 url 格式."
        },
        //  必须是正确的 IP地址v4 或 url 格式
        ipurl: {
            validator: function (value) { return $.string.isUrlOrIPv4(value); },
            message: "输入的内容必须是正确的 IP地址v4 或 url 格式."
        },
        //  必须是正确的货币金额(阿拉伯数字表示法)格式
        currency: {
            validator: function (value) { return $.string.isCurrency(value); },
            message: "输入的内容必须是正确的货币金额(阿拉伯数字表示法)格式."
        },
        //  必须是正确 QQ 号码格式
        qq: {
            validator: function (value) { return $.string.isQQ(value); },
            message: "输入的内容必须是正确 QQ 号码格式."
        },
        //  必须是正确 MSN 账户名格式
        msn: {
            validator: function (value) { return $.string.isMSN(value); },
            message: "输入的内容必须是正确 MSN 账户名格式."
        },
        unNormal: {
            validator: function (value) { return $.string.isUnNormal(value); },
            message: "输入的内容必须是不包含空格和非法字符Z."
        },
        //  必须是合法的汽车车牌号码格式
        carNo: {
            validator: function (value) { return $.string.isCarNo(value); },
            message: "输入的内容必须是合法的汽车车牌号码格式."
        },
        // 验证传真
        faxNo: {
            validator: function (value) {
                //            return /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/i.test(value);
                return /^((\d2,3)|(\d{3}\-))?(0\d2,3|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
            },
            message: '传真号码不正确'
        },
        //  必须是合法的汽车发动机序列号格式
        carEngineNo: {
            validator: function (value) { return $.string.isCarEngineNo(value); },
            message: "输入的内容必须是合法的汽车发动机序列号格式."
        },
        //  必须是合法的身份证号码(中国)格式
        idCard: {
            validator: function (value) { return $.string.isIDCard(value); },
            message: "输入的内容必须是合法的身份证号码(中国)格式."
        },
        //  必须是合法的整数格式
        integer: {
            validator: function (value) { return $.string.isInteger(value); },
            message: "请输入正整数."
        },
        //  必须是合法的整数格式且值介于 {0} 与 {1} 之间
        integerRange: {
            validator: function (value, param) {
                //return $.string.isInteger(value) && ((param[0] || value >= param[0]) && (param[1] || value <= param[1]));
                return $.string.isInteger(value) && ((value >= param[0]) && (value <= param[1]));
            },
            message: "输入的内容必须是合法的整数格式且值介于 {0} 与 {1} 之间."
        },
        //  必须是指定类型的数字格式
        numeric: {
            validator: function (value, param) { return $.string.isNumeric(value, param ? param[0] : undefined); },
            message: "输入的内容必须是指定类型的数字格式."
        },
        //  必须是指定类型的数字格式且介于 {0} 与 {1} 之间
        numericRange: {
            validator: function (value, param) {
                //return $.string.isNumeric(value, param ? param[2] : undefined) && ((param[0] || value >= param[0]) && (param[1] || value <= param[1]));
                return $.string.isNumeric(value, param ? param[2] : undefined) && ((value >= param[0]) && (value <= param[1]));
            },
            message: "输入的内容必须是指定类型的数字格式且介于 {0} 与 {1} 之间."
        },
        //  必须是正确的 颜色(#FFFFFF形式) 格式
        color: {
            validator: function (value) { return $.string.isColor(value); },
            message: "输入的内容必须是正确的 颜色(#FFFFFF形式) 格式."
        },
        //  必须是安全的密码字符(由字符和数字组成，至少 6 位)格式
        password: {
            validator: function (value) {
            	    var reg = new RegExp(/^(\w){6,18}$/);
            	    return value.match(reg);
            	    //return $.string.isSafePassword(value); 
            	},
            //message: "输入的内容必须是安全的密码字符(由字符和数字组成，至少 6 位)格式." 
              message: "输入的内容必须是安全的密码字符(密码由字母、数字、下划线组成的6-18位字符)格式."
        },
        //  输入的字符必须是指定的内容相同  data-options="required:true,validType:'equals[\'#pass1\',\'dom\']'"
        equals: {
            validator: function (value, param) {
                var val = param[0], type = param[1];
                if (type) {
                    switch (String(type).toLowerCase()) {
                        case "jquery":
                        case "dom":
                            val = $(val).val();
                            break;
                        case "id":
                            val = $("#" + val).val();
                            break;
                        case "string":
                        default:
                            break;
                    }
                }
                return value === val;
            },
            message: "输入的内容不匹配."
        },
        //通过给param[2]赋值来展示展示message
		//必须有return值，同时也必须是boolean值
		borrowUserName:{
		    validator:function(value, param){
			    var result = false;
			    if(value.length >= param[0] && value.length <= param[1]){
				    $.ajax({
				        type: "POST",
		                url:"user.html",  
		                dataType:"json",  
		                data:{"username":value},
		                success: function(data){ 
		                    result = !data;  
		                } 
				    });
			    }else{
			       param[2] = "请输入"+param[0]+"-"+param[1]+"位字符.";  
			       return false;  
			    }
			    param[2] = "输入的借款人用户名不存在";  
			    return result;
		    },     
		   message: "{2}"   
		},
		//demo2；param获取传入的实际参数
		zyp_remote:{
		    validator:function(value,param){
		        var flag = true;
		        if($(param[1]) && value == $(param[1]).val()){
		            param[2] = "邀请人与被邀请人不能一样";
		            flag = false;
		            return false;
		        }
		        $.ajax({
		            type: "POST",
		            async:false, 
		            url:"/modules/checkInvitedUser.html?userName="+value +"&type="+param[0],
		            dataType:"json",  
		            data:{"username":value},
		            success: function(data){
		                if(param[0] == 1 && !data.result){
		                    param[2] = "该用户不存在";
		                    flag = data.result;
		                    return flag;
		                }else if(param[0] == 2 && !data.result){
		                    param[2] = "该用户不存在或者已经被邀请了";
		                    flag = data.result;
		                    return flag;
		                }
		            }
		        });
		        
		        return flag;
		    },
		    message: "{2}"
		}

    };
    $.extend($.fn.validatebox.defaults.rules, rules);




    function initialize(target) {
        var t = $(target);
        var opts = t.validatebox("options");
        if (!opts._initialized) {
            t.addClass("validatebox-f").change(function () {
                opts.value = $(this).val();
                if ($.isFunction(opts.onChange)) {
                    opts.onChange.call(target, opts.value);
                }
            });
            opts.originalValue = opts.value;
            if (opts.value) {
                setValue(target, opts.value);
            }
            if (opts.width && !t.parent().is("span.combo,span.spinner,span.searchbox")) {
                resize(target, opts.width);
            }
            setPrompt(target, opts.prompt, opts);
            if (opts.autoFocus) {
                $.util.exec(function () { t.focus(); });
            }
            if (!opts.autovalidate) {
                t.validatebox("disableValidation").validatebox("enableValidation");
            }
            if (opts.defaultClass) {
                t.addClass(opts.defaultClass);
            }
            setDisabled(target, opts.disabled);
            opts._initialized = true;
        }
    };

    function setPrompt(target, prompt, opts) {
        var t = $(target);
        opts = opts || t.validatebox("options");
        opts.prompt = prompt;
        if ($.html5.testProp("placeholder", t[0].nodeName)) {
            t.attr("placeholder", prompt);
        } else {
            if (!$.isFunction(opts.promptFocus)) {
                opts.promptFocus = function () {
                    if (t.hasClass("validatebox-prompt")) {
                        t.removeClass("validatebox-prompt");
                        if (t.val() == opts.prompt) { t.val(""); }
                    }
                };
                t.focus(opts.promptFocus);
            }
            if (!$.isFunction(opts.promptBlur)) {
                opts.promptBlur = function () {
                    if ($.string.isNullOrEmpty(t.val())) { t.addClass("validatebox-prompt").val(opts.prompt); }
                }
                t.blur(opts.promptBlur);
            }
            if ($.string.isNullOrEmpty(t.val()) && !$.string.isNullOrEmpty(opts.prompt)) {
                $.util.exec(function () {
                    t.addClass("validatebox-prompt").val(opts.prompt);
                });
            }
        }
    }

    var _validate = $.fn.validatebox.methods.isValid;
    function validate(target) {
        var t = $(target);
        if (t.hasClass("validatebox-prompt")) {
            t.removeClass("validatebox-prompt").val("");
        }
        return _validate.call(t, t);
    };


    function setValue(target, value) {
        var t = $(target), opts = t.validatebox("options"), val = t.val();
        if (val != value) {
            t.val(opts.value = (value ? value : ""));
        }
        validate(target);
    };

    function getValue(target) {
        return $(target).val();
    };

    function clear(target) {
        var t = $(target), opts = t.validatebox("options");
        t.validatebox("setValue", "");
    };

    function reset(target) {
        var t = $(target), opts = t.validatebox("options");
        t.validatebox("setValue", opts.originalValue ? opts.originalValue : "");
    };

    function resize(target, width) {
        var t = $(target), opts = t.validatebox("options");
        t._outerWidth(opts.width = width);
    };

    function setDisabled(target, disabled) {
        var t = $(target), state = $.data(target, "validatebox");
        if (disabled) {
            if (state && state.options) { state.options.disabled = true; }
            t.attr("disabled", true);
        } else {
            if (state && state.options) { state.options.disabled = false; }
            t.removeAttr("disabled");
        }
    };


    var _validatebox = $.fn.validatebox;
    $.fn.validatebox = function (options, param) {
        if (typeof options == "string") {
            return _validatebox.apply(this, arguments);
        }
        options = options || {};
        return this.each(function () {
            var jq = $(this), hasInit = $.data(this, "validatebox") ? true : false,
                opts = hasInit ? options : $.extend({}, $.fn.validatebox.parseOptions(this), $.parser.parseOptions(this, [
                    "prompt", { autoFocus: "boolean" }
                ]), options);
            opts.value = opts.value || jq.val();
            _validatebox.call(jq, opts);
            initialize(this);
        });
    };
    $.union($.fn.validatebox, _validatebox);


    var methods = $.fn.validatebox.extensions.methods = {
        //  扩展 easyui-validatebox 的自定义扩展方法；设置当前 easyui-validatebox 控件的 prompt 值；该方法的参数 prompt 表示将被设置的 prompt 值；
        //  返回值：返回表示当前 easyui-validatebox 的 jQuery 链式对象。
        setPrompt: function (jq, prompt) { return jq.each(function () { setPrompt(this, prompt); }); },

        //  重写 easyui-validatebox 的原生方法；以支持相应扩展功能或属性。
        //  返回值：返回表示当前 easyui-validatebox 的 jQuery 链式对象。
        validate: function (jq) { return jq.each(function () { validate(this); }) },

        //  重写 easyui-validatebox 的原生方法；以支持相应扩展功能或属性。
        isValid: function (jq) { return validate(jq[0]); },

        setValue: function (jq, value) { return jq.each(function () { setValue(this, value); }); },

        getValue: function (jq) { return getValue(jq[0]); },

        clear: function (jq) { return jq.each(function () { clear(this); }); },

        reset: function (jq) { return jq.each(function () { reset(this); }); },

        resize: function (jq, width) { return jq.each(function () { resize(this, width); }); },

        enable: function (jq) { return jq.each(function () { setDisabled(this, false); }); },

        disable: function (jq) { return jq.each(function () { setDisabled(this, true); }); }
    };
    var defaults = $.fn.validatebox.extensions.defaults = {
        //  增加 easyui-validatebox 的扩展属性 prompt，该属性功能类似于 easyui-searchbox 的 prompt 属性。
        //  表示该验证输入框的提示文本；String 类型值，默认为 null。
        prompt: null,

        //  增加 easyui-validatebox 的扩展属性 autoFocus，该属性表示在当前页面加载完成后，该 easyui-validatebox 控件是否自动获得焦点。
        //  Boolean 类型值，默认为 false。
        autoFocus: false,

        //  增加 easyui-validatebox 的扩展属性 value，表示其初始化时的值
        value: null,

        //  增加 easyui-validatebox 的扩展属性 width，表示其初始化时的宽度值
        width: null,

        //  增加 easyui-validatebox 的扩展属性 autovalidate，表示是否在该控件初始化完成后立即进行一次验证；默认为 true。
        autovalidate: true,

        //  增加 easyui-validatebox 的扩展属性 disabled，表示该控件在初始化完成后是否设置其为禁用状态(disabled)；默认为 false。
        disabled: false,

        //  增加 easyui-validatebox 的扩展属性 defaultClass，表示 easyui-validatebox 初始化时默认需要加载的样式类名；
        //  该值将会被作为 html-class 属性在 easyui-validatebox 初始化完成后加载至 html 标签上。
        defaultClass: "textbox",

        //  增加 easyui-validatebox 的扩展事件 onChange，表示输入框在值改变时所触发的事件
        onChange: function (value) { }
    };

    $.extend($.fn.validatebox.defaults, defaults);
    $.extend($.fn.validatebox.methods, methods);


    if ($.fn.form && $.isArray($.fn.form.otherList)) {
        $.fn.form.otherList.push("validatebox");
        //$.array.insert($.fn.form.otherList, 0, "validatebox");
    }



    //  修改 jQuery 本身的成员方法 val；使之支持 easyui-validatebox 的扩展属性 prompt。
    var core_val = $.fn.val;
    $.fn.val = function (value) {
        if (this.length > 0 && this.is(".validatebox-text.validatebox-prompt") && !$.html5.testProp("placeholder", this[0].nodeName)) {
            var val, opts = this.validatebox("options");
            if (arguments.length == 0) {
                val = core_val.apply(this, arguments);
                return val == opts.prompt ? "" : val;
            }
            if (value && value != opts.prompt) {
                this.removeClass("validatebox-prompt");
            }
        }
        return core_val.apply(this, arguments);
    };


})(jQuery);