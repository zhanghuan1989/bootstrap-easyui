var comboboxList = [];//combobox全局变量
// key: combobox Dom的id 
function isHashCombox(key){
   if(comboboxList){
   		for(var i = 0 ; i < comboboxList.length; i++){
   			var comboboxObj = comboboxList[i];
   			if(comboboxObj.key == key ){
   				return true;
   			}
   		}
   }
   return false;
}

//删除重复的combobox页面元素
function destroyCombox(ids){
	try{
		if(comboboxList && ids){
			var list=[];
			for(var i = 0;i < comboboxList.length ; i++){
				var combobox= comboboxList[i];
				var flag = false;
				for(var j = 0 ; j < ids.length; j ++){
				    var boxkey = combobox.key;
				    var id = ids[j];
				    var objId = $("#"+id).attr("id");
					if(objId && combobox && combobox.key ==  id){
					    combobox.value.panel("destroy");
					    flag = true;
					}
				}
				if(!flag){
					list.push(combobox);
				}
			}
			comboboxList = list;
		}
	}catch(e){
		console.log("main.jsp comboxList Exception："+e);
	}
}
//创建 combobox组件
function createCombox(id,obj){
    //远程搜索模式
    var vField = obj.valueField;
	obj = $.extend({
	    mode:"remote",
	    pageSize:30,
	    lastpage:false, //是否是最后一页，最后一页为true
	    pageNum:1,//当前页
	    onSelFlag:false, //text是否有默认值     true是由于默认值 （实用于编辑页面combobox有默认值时 该属性置为true）
	    onBeforeLoad:function(param){
	    	param.pageNum = 1;
	    	param.pageSize = 30;
	    	//重置panel的滚动条距离，重置为0
	    	$("#"+id).combobox("panel").scrollTop(0);
	    },
	    onSelect:function(record){
	    	//选择面板下的一项数据时 把 onSelFlag属性置为true 当前页pageNum置为0  程序会把当前的text去后台搜索 
	    	//那么在面板显示的时候 会 把后台返回的数据进行和 一个空的 [] 数组进行 concat拼接 ,实现
	    	//选择一项时 下拉面板后只有当前选择的数据 
	    	$("#"+id).combobox('options').lastpage = false; 
	    	$("#"+id).combobox('options').pageNum = 0;
	    	$("#"+id).combobox('options').onSelFlag = true; 
	    	
	    },
	    onShowPanel:function(){
	    	var getText = $("#"+id).combobox("getText");
	    	var getValue = $("#"+id).combobox("getValue");
	    	var valFile = $('#'+id).combobox('options').valueField;
	    	var textFile = $('#'+id).combobox('options').textField;
	    	if($("#"+id).combobox('options').onSelFlag){
	    		var searcV = $("#"+id).combobox("getText").toString();
				var pageObj = {pageNum:1,pageSize:$('#'+id).combobox('options').pageSize,q:searcV};
				var url = $('#'+id).combobox('options').url;
				var temLoadD = loadComboxData(url,pageObj,id);
				var newData = null;
				if(temLoadD.length <= 0){//当后台搜索返回的数据是空的时候 把当前数据加上 避免面板不显示 onchange时间不触发
					var tem_obj={};
					tem_obj[valFile]=getValue;
					tem_obj[textFile]=getText;
					newData = setNewJsonData([tem_obj],temLoadD);
				}else{
					newData = setNewJsonData([],temLoadD);
				}
			    $('#'+id).combobox('loadData',newData);
	    	}
	    	$("#"+id).combobox('setText',getText);
	    },
	    loadFilter:function(data){
	       if(data.list == undefined){
	          return data;
	       }else{
	    	   //2016-05-03 后台数据json已没有bool字段 
	          /*if(!data.bool && data.pageNum==1){//解决先选 再清空 滚动分页失败问题
		        $("#"+id).combobox('options').lastpage = false;
		      }*/
	    	  $("#"+id).combobox('options').lastpage = data.lastpage;
	          return data.list;
	       }
	    	
	    }
	},obj);
	var idMsg = "#"+id;
	var objId = $(idMsg).attr("id");
	if(objId){//页面元素存在 才创建
		$(idMsg).combobox(obj);
		if(!isHashCombox(id)){
			comboboxList.push({value:$(idMsg).combobox("panel"),key:id});
		}
	}
	
}

/*combobox搜索下来面板注册 scroll 事件 */
function clickScorll(domId){
    
    $("#"+domId).combobox("panel").show(function(){
    	        
		var nScrollHight = 0; //滚动距离总长(注意不是滚动条的长度)
		var nScrollTop = 0; //滚动到的当前位置
		var nDivHight = $("#"+domId).combobox('options').panelHeight;//$(".combo-panel").height();
		//滚动事件
		var pan = $("#"+domId).combobox("panel");
		$(pan).scroll(function(){
			nScrollHight = $(this)[0].scrollHeight * 0.9 ;
			nScrollTop = $(this)[0].scrollTop;
			if(nScrollTop + nDivHight >= nScrollHight)
			{
				$("#"+domId).combobox('options').onSelFlag = false;
				var getCurrpage = parseInt($('#'+domId).combobox('options').pageNum);//当前页
				var isLastPage = $('#'+domId).combobox('options').lastpage;//是否是最后一页
				if(!isLastPage)
				{
				    getCurrpage = parseInt(getCurrpage) + 1;
					var searcV = $("#"+domId).combobox("getText").toString();
					var pageObj = {pageNum:getCurrpage,pageSize:$('#'+domId).combobox('options').pageSize,q:searcV};
				    $(this).append("<p class='combobox-item comload'><span class='comloading'>正在加载数据....</span></p>");
				    var newData = setNewJsonData($('#'+domId).combobox('getData'),loadComboxData($('#'+domId).combobox('options').url,pageObj,domId));
					$('#'+domId).combobox('loadData',newData);
					$(this).children("p").remove();
				}
			}
		}); 
	});
}

//组合成新的数组
function setNewJsonData(oldJsonData,newJsonData){
    oldJsonData = oldJsonData.concat(newJsonData);
	return oldJsonData;
}

//加载后台json数据
function loadComboxData(url,pageObj,domId){
	//ajax请求数据
	var jsonData;
	$.ajax({
		url:url,		
		cache:false,
		data:pageObj,
	    dataType:"json",
		async : false,
		type:"post",
		success:function(data){
	        $("#"+domId).combobox('options').lastpage = data.pageNum==data.lastPage?true:false;
	        $("#"+domId).combobox('options').pageNum = data.pageNum;//当前页
			jsonData = data.list;
		},
		error:function(data){
			
		}
	});
	return jsonData;
}