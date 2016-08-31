/**
 * Created by zhanghuan on 2016/8/12.
 */

/**
 * Created by zhanghuan on 2016/08/10.
 * 日期范围工具类
 */
var dateUtil = {
    /**
     * 获取系统当前时间
     * @returns {string}
     */
    getCurrentDate:function () {
        return new Date();
    },
    /**
     * 获取当前日期前面几天或者后面几天
     * @returns {string}
     */
    getCurrDayPreOrNextDay:function(flag,dayParamater){
        var d = this.getCurrentDate();
        if(flag == "prev"){  //前面几天
            //当前日期的毫秒数 - 天数 * 一天的毫秒数
            var n = d.getTime() - dayParamater * 24 * 60 * 60 * 1000;
        }else if(flag == "next"){  //后面几天
            //当前日期的毫秒数 + 天数 * 一天的毫秒数
            var n = d.getTime() + dayParamater * 24 * 60 * 60 * 1000;
        }
        var result = new Date(n);
        return result.getFullYear() + "-" + this.parseDate(result.getMonth() + 1) + "-" + this.parseDate(result.getDate());
    },
    /***
     * 获得本周起止时间
     */
    getCurrentWeek:function () {
        //起止日期数组
        var startStop = new Array();
        //获取当前时间
        var currentDate = this.getCurrentDate();
        //返回date是一周中的某一天
        var week = currentDate.getDay();
        //返回date是一个月中的某一天
        var month = currentDate.getDate();

        //一天的毫秒数
        var millisecond = 1000 * 60 * 60 * 24;
        //减去的天数
        var minusDay = week != 0 ? week - 1 : 6;
        //alert(minusDay);
        //本周 周一
        var monday = new Date(currentDate.getTime() - (minusDay * millisecond));
        //本周 周日
        var sunday = new Date(monday.getTime() + (6 * millisecond));
        //添加本周时间
        startStop.push(monday); //本周起始时间
        //添加本周最后一天时间
        startStop.push(sunday); //本周终止时间
        //返回
        return startStop;
    },
    /**
     * 获得上一周的起止日期
     * **/
    getPreviousWeek:function () {
        //起止日期数组
        var startStop = new Array();
        //获取当前时间
        var currentDate = this.getCurrentDate();
        //返回date是一周中的某一天
        var week = currentDate.getDay();
        //返回date是一个月中的某一天
        var month = currentDate.getDate();
        //一天的毫秒数
        var millisecond = 1000 * 60 * 60 * 24;
        //减去的天数
        var minusDay = week != 0 ? week - 1 : 6;
        //获得当前周的第一天
        var currentWeekDayOne = new Date(currentDate.getTime() - (millisecond * minusDay));
        //上周最后一天即本周开始的前一天
        var priorWeekLastDay = new Date(currentWeekDayOne.getTime() - millisecond);
        //上周的第一天
        var priorWeekFirstDay = new Date(priorWeekLastDay.getTime() - (millisecond * 6));

        //添加至数组
        startStop.push(priorWeekFirstDay);
        startStop.push(priorWeekLastDay);

        return startStop;
    },
    /***
     * 获得本月的起止时间
     */
    getCurrentMonth:function () {
        //起止日期数组
        var startStop = new Array();
        //获取当前时间
        var currentDate = this.getCurrentDate();
        //获得当前月份0-11
        var currentMonth = currentDate.getMonth();
        //获得当前年份4位年
        var currentYear = currentDate.getFullYear();
        //求出本月第一天
        var firstDay = new Date(currentYear, currentMonth, 1);


        //当为12月的时候年份需要加1
        //月份需要更新为0 也就是下一年的第一个月
        if (currentMonth == 11) {
            currentYear++;
            currentMonth = 0; //就为
        } else {
            //否则只是月份增加,以便求的下一月的第一天
            currentMonth++;
        }

        //一天的毫秒数
        var millisecond = 1000 * 60 * 60 * 24;
        //下月的第一天
        var nextMonthDayOne = new Date(currentYear, currentMonth, 1);
        //求出上月的最后一天
        var lastDay = new Date(nextMonthDayOne.getTime() - millisecond);

        //添加至数组中返回
        startStop.push(firstDay);
        startStop.push(lastDay);
        //返回
        return startStop;
    },
    /**
     * 返回上一个月的第一天Date类型
     * @param year 年
     * @param month 月
     **/
    getPriorMonthFirstDay:function (year, month) {
        //年份为0代表,是本年的第一月,所以不能减
        if (month == 0) {
            month = 11; //月份为上年的最后月份
            year--; //年份减1
            return new Date(year, month, 1);
        }
        //否则,只减去月份
        month--;
        return new Date(year, month, 1); ;
    },
    /**
     * 获得上一月的起止日期
     * ***/
    getPreviousMonth:function () {
        //起止日期数组
        var startStop = new Array();
        //获取当前时间
        var currentDate = this.getCurrentDate();
        //获得当前月份0-11
        var currentMonth = currentDate.getMonth();
        //获得当前年份4位年
        var currentYear = currentDate.getFullYear();
        //获得上一个月的第一天
        var priorMonthFirstDay = this.getPriorMonthFirstDay(currentYear, currentMonth);
        //获得上一月的最后一天
        var priorMonthLastDay = new Date(priorMonthFirstDay.getFullYear(), priorMonthFirstDay.getMonth(), this.getMonthDays(priorMonthFirstDay.getFullYear(), priorMonthFirstDay.getMonth()));
        //添加至数组
        startStop.push(priorMonthFirstDay);
        startStop.push(priorMonthLastDay);
        //返回
        return startStop;
    },
    /**
     * 获得该月的天数
     * @param year年份
     * @param month月份
     * */
    getMonthDays:function (year, month) {
        //本月第一天 1-31
        var relativeDate = new Date(year, month, 1);
        //获得当前月份0-11
        var relativeMonth = relativeDate.getMonth();
        //获得当前年份4位年
        var relativeYear = relativeDate.getFullYear();

        //当为12月的时候年份需要加1
        //月份需要更新为0 也就是下一年的第一个月
        if (relativeMonth == 11) {
            relativeYear++;
            relativeMonth = 0;
        } else {
            //否则只是月份增加,以便求的下一月的第一天
            relativeMonth++;
        }
        //一天的毫秒数
        var millisecond = 1000 * 60 * 60 * 24;
        //下月的第一天
        var nextMonthDayOne = new Date(relativeYear, relativeMonth, 1);
        //返回得到上月的最后一天,也就是本月总天数
        return new Date(nextMonthDayOne.getTime() - millisecond).getDate();
    },
    /**
     * 得到本季度开始的月份
     * @param month 需要计算的月份
     ***/
    getQuarterSeasonStartMonth:function (month) {
        var quarterMonthStart = 0;
        var spring = 0; //春
        var summer = 3; //夏
        var fall = 6;   //秋
        var winter = 9; //冬
        //月份从0-11
        if (month < 3) {
            return spring;
        }

        if (month < 6) {
            return summer;
        }

        if (month < 9) {
            return fall;
        }

        return winter;
    },
    /**
     * 获得本季度的起止日期
     */
    getCurrentSeason:function () {
        //起止日期数组
        var startStop = new Array();
        //获取当前时间
        var currentDate = this.getCurrentDate();
        //获得当前月份0-11
        var currentMonth = currentDate.getMonth();
        //获得当前年份4位年
        var currentYear = currentDate.getFullYear();
        //获得本季度开始月份
        var quarterSeasonStartMonth = this.getQuarterSeasonStartMonth(currentMonth);
        //获得本季度结束月份
        var quarterSeasonEndMonth = quarterSeasonStartMonth + 2;

        //获得本季度开始的日期
        var quarterSeasonStartDate = new Date(currentYear, quarterSeasonStartMonth, 1);
        //获得本季度结束的日期
        var quarterSeasonEndDate = new Date(currentYear, quarterSeasonEndMonth, this.getMonthDays(currentYear, quarterSeasonEndMonth));
        //加入数组返回
        startStop.push(quarterSeasonStartDate);
        startStop.push(quarterSeasonEndDate);
        //返回
        return startStop;
    },
    /**
     * 得到上季度的起始日期
     * year 这个年应该是运算后得到的当前本季度的年份
     * month 这个应该是运算后得到的当前季度的开始月份
     * */
    getPriorSeasonFirstDay:function (year, month) {
        var quarterMonthStart = 0;
        var spring = 0; //春 0,1,2
        var summer = 3; //夏 3,4,5
        var fall = 6;   //秋 6,7,8
        var winter = 9; //冬 9,10,11
        //月份从0-11
        switch (month) {//季度的其实月份
            case 0:
            case 1:
            case 2:
                //如果是第一季度则应该到去年的冬季
                year--;
                month = winter;
                break;
            case 3:
            case 4:
            case 5:
                month = spring;
                break;
            case 5:
            case 6:
            case 7:
                month = summer;
                break;
            case 9:
            case 10:
            case 11:
                month = fall;
                break;

        };

        return new Date(year, month, 1);
    },
    /**
     * 得到上季度的起止日期
     * **/
    getPreviousSeason:function(){
        //起止日期数组
        var startStop = new Array();
        //获取当前时间
        var currentDate = this.getCurrentDate();
        //获得当前月份0-11
        var currentMonth = currentDate.getMonth();
        //获得当前年份4位年
        var currentYear = currentDate.getFullYear();
        //上季度的第一天
        var priorSeasonFirstDay = this.getPriorSeasonFirstDay(currentYear, currentMonth);
        //上季度的最后一天
        var priorSeasonLastDay = new Date(priorSeasonFirstDay.getFullYear(), priorSeasonFirstDay.getMonth() + 2, this.getMonthDays(priorSeasonFirstDay.getFullYear(), priorSeasonFirstDay.getMonth() + 2));
        //添加至数组
        startStop.push(priorSeasonFirstDay);
        startStop.push(priorSeasonLastDay);
        return startStop;
    },
    /***
     * 得到本年的起止日期
     *
     */
    getCurrentYear:function () {
        //起止日期数组
        var startStop = new Array();
        //获取当前时间
        var currentDate = this.getCurrentDate();
        //获得当前年份4位年
        var currentYear = currentDate.getFullYear();

        //本年第一天
        var currentYearFirstDate = new Date(currentYear, 0, 1);
        //本年最后一天
        var currentYearLastDate = new Date(currentYear, 11, 31);
        //添加至数组
        startStop.push(currentYearFirstDate);
        startStop.push(currentYearLastDate);
        //返回
        return startStop;
    },
    /**
     * //如果数据小于10.加一个0
     * @param date
     * @returns {*}
     */
    parseDate:function(date) {
        if (date < 10) {
            date = '0' + date;
        }
        return date;
    }
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
/*
 调用：
 var time1 = new Date().format("yyyy-MM-dd");
 var time2 = new Date().format("yyyy-MM-dd HH:mm:ss");
 */
Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//两种调用方式
//var template1="我是{0}，今年{1}了";
//var template2="我是{name}，今年{age}了";
//var result1=template1.format("loogn",22);
//var result2=template2.format({name:"loogn",age:22});
//两个结果都是"我是loogn，今年22了"
//字符串格式化
String.prototype.format = function(args) {
  var result = this;
  if (arguments.length > 0) {    
      if (arguments.length == 1 && typeof (args) == "object") {
          for (var key in args) {
              if(args[key]!=undefined){
                  var reg = new RegExp("({" + key + "})", "g");
                  result = result.replace(reg, args[key]);
              }
          }
      }
      else {
          for (var i = 0; i < arguments.length; i++) {
              if (arguments[i] != undefined) {
                  var reg = new RegExp("({[" + i + "]})", "g");
                  result = result.replace(reg, arguments[i]);
              }
          }
      }
  }
  return result;
}


/**
 * 动态编辑表格数据转换
 * 可编辑的表格提交时，转换数组成键值对对象，方便后台对接与验证
 * @param list 数据对象
 * @param listName 与后台接口对应的参数名称
 * @returns {___anonymous624_625}
 */
function tableArrayFormatter(list,listName){
	var result={};
	listName = listName ? listName : 'list';
	if(list && list.length){
		for(var i=0;i<list.length;i++){
			var obj = list[0];
			for(var attr in obj){
				var resultAttrName = listName + "[" + i + "]." + attr ;
				result[resultAttrName] = obj[attr];
			}
		}
		return result;
	}
}

//提示语句的公共类
var tipUtil = {
	/**
	* 是否选择行数据
	*/
	isSelectRows:function(datagridId){
		var _this = this;
		if($("#"+datagridId).datagrid("getSelections").length <= 0){
            _this.messageShowTip("请选择行数据！");
            return false;
        }else{
            return true;
        }
	},
	/**
	* ajax返回提示
	* @param data    返回的数据
	* @param msg     提示语句
	* @param dg datagrid
	* @param d    弹窗
	* @returns {Boolean} ajax是否成功
	*/
	successTip:function(msg,data,dg,d) {
	    var _this = this;
	    //成功
	    if (data.status == 'success') {
	      _this.messageShowTip(msg);
	      if (dg != null) {
	        dg.datagrid('reload');
	      }
	      if (d != null) {
	        d.panel('destroy');
	      }
	        return true;
	    }else {
	        _this.messageShowTip(msg);
	        return false;
	    }
	},
	/**
	 * 提示语句 show 1.5秒后自动关闭
	 * @param msg
	 */
	messageShowTip:function(msg){
		$.messager.show({
          title: "提示",
          msg: msg,
          position: "topCenter",
          timeout: 1500,
          showType: 'slide',
          style:{
      		right:'',
      		top:document.body.scrollTop + document.documentElement.scrollTop + 50,
      		bottom:''
      	}
      });
	},
	/**
	 * 提示语句 alert 需点击关闭
	 * @param msg
	 */
	messageAlertTip:function(msg){
		$.messager.alert("提示", msg);
	},
	/**
	* 提写公共的show方法
	* 
	* @param msg 消息
	*/
	psmaMessageShowOne:function(msg) {
	  $.messager.show({
	      title: "提示",
	      msg: msg,
	      position: "topCenter",
	      timeout: 1500,
	      showType: 'slide'
	  });
	},
	/**
	* 提写公共的show方法
	*
	* @param title 标题
	* @param msg 消息
	*/
	psmaMessageShowTwo:function(title, msg) {
	  $.messager.show({
	      title: title,
	      msg: msg,
	      position: "topCenter",
	      timeout: 1500,
	      showType: 'slide'
	  });
	},
	/**
	* 提写公共的show方法
	* 
	* @param title 标题
	* @param msg 消息
	* @param position 显示位置
	*/
	psmaMessageShowThree:function(title, msg, position) {
	  $.messager.show({
	      title: title,
	      msg: msg,
	      position: position,
	      timeout: 1500,
	      showType: 'slide'
	  });
	},
	/**
	* 提写公共的show方法
	* 
	* @param title 标题
	* @param icon 图标 info error 默认info
	* @param msg 消息
	* @param position 显示位置 默认topCenter
	*/
	psmaMessageShowFour:function(title, icon, msg, position) {
	  $.messager.show({
	      title: title,
	      icon: icon,
	      msg: msg,
	      position: position,
	      timeout: 1500,
	      showType: 'slide'
	  });
	}
}

//表单序列化为对象
$.fn.serializeObject = function(){  
  var serializeObj={};  
  var array = this.serializeArray();  
  var str = this.serialize();  
  $(array).each(function(){  
      if(serializeObj[this.name]){  
          if($.isArray(serializeObj[this.name])){  
              serializeObj[this.name].push(this.value);  
          }else{  
              serializeObj[this.name] = [serializeObj[this.name],this.value];  
          }  
      }else{  
          serializeObj[this.name] = this.value;   
      }  
  });  
  return serializeObj;  
};

//根据id去除数组重复元素
Array.prototype.unique = function(){
	 var res = [];
	 var json = {};
	 for(var i = 0; i < this.length; i++){
		  if(!json[this[i].id]){
			   res.push(this[i]);
			   json[this[i].id] = 1;
		  }
	 }
	 return res;
}


//删除obj数组中元素，通过id删除
Array.prototype.removeObj = function(val){
	var _this = this;
	this.forEach(function(item,index){
		if(val.id == item.id){
			 _this.splice(index, 1);
		}
	});
}

//删除普通数据元素
Array.prototype.removeArr = function(val){
	var _this = this;
	var index = this.indexOf(val);
	if(index > -1){
		_this.splice(index,1);
	}
}