//datagrid Id
datagridUtil.datagridId = "index-datagrid";

$(function(){
	initCombox();
	initDataGrid();
});

//创建combox
function initCombox(){
	createCombox("smallCommunityId_search",{ 
		method: "get",
		url:'../../json/combox_data.json', 
		valueField:'id', 
		textField:'name',
		height:20,
		width:150,
		required: false,
		onLoadSuccess : function(data) {
			//初始化设置下拉图标的高度
			//$(".textbox-icon").css("height","20px");
			clickScorll("smallCommunityId_search");
		}
	});
}

//创建datagrid
function initDataGrid(){
	$('#'+datagridUtil.datagridId).datagrid({
		method: "get",
		url:'../../json/datagrid_data.json', 
	    fit : true,
		fitColumns : true,
		border : false,
		idField : 'id',
		striped:true,
		pagination:true,
		rownumbers:true,
		pageNumber:1,
		pageSize : 10,
		pageList : [ 10, 20, 30, 40, 50 ],
		columns:[[
		    {field:"id",title:'id',checkbox : true},
		  	{field:'name',title:'单品名称',sortable:false,width:50},
		  	{field:'barCode',title:'单品条码',sortable:false,width:60},
		  	{field:'styleCode',title:'单品款码',sortable:false,width:30},
		  	{field:'goodsAttr',title:'单品属性',sortable:false,width:30},
		  	{field:'operator',title:'操作',sortable:false,align:'center',
		  		formatter : function(value, rowData, rowIndex) {
		  			var operateHtml = $("#index-operator").html();
		  			var rowId = rowData.id;
		  			operateHtml = operateHtml.replace("viewOneData()","viewIndexOneRow('"+rowId+"')");
		  			operateHtml = operateHtml.replace("editOneData()","editIndexOneRow('"+rowId+"')");
		  			operateHtml = operateHtml.replace("delOneData()","delIndexOneRow('"+rowIndex+"')");
	                return operateHtml;
				}
		  	}
		]],
		onBeforeLoad:function(){
			//显示正在加载状态
			$('#'+datagridUtil.datagridId).datagrid("loading");
			//隐藏正在加载状态
			//$('#'+datagridUtil.datagridId).datagrid("loaded");
		},
		enableHeaderClickMenu: false,
		enableHeaderContextMenu: false,
	    enableRowContextMenu: false,
	    toolbar:'#index-toolbar'
	});
}
//添加
function addDialog(){
	var d = $("<div style='position:relative;'/>").dialog({
        title: '添加',
        top:20,
        width: 600,
        height: 400,
        href: 'dialog.html',
        maximizable: false,
        modal: true,
        buttons: [{
            text: '确定',
            handler: function () {
            	submitForm(d);
            }
        },
        {
            text: '返回',
            handler: function () {
                d.panel('destroy');
            }
        }]
    });
}

//编辑单条
function editIndexOneRow(id) {
   var d = $("<div />").dialog({
        title: '详情',
        top:20,
        width: 600,
        height: 600,
        href: '',
        maximizable: false,
        modal: true,
        content:"asdfsdf",
        buttons: [{
            text: '确定',
            handler: function () {
                d.panel('destroy');
            }
        },
        {
            text: '返回',
            handler: function () {
                d.panel('destroy');
            }
        }]
    });
}

//查看单条
function viewIndexOneRow(id) {
   var d = $("<div />").dialog({
        title: '详情',
        top:20,
        width: 600,
        height: 600,
        href: '',
        maximizable: false,
        modal: true,
        content:"asdfsdf",
        buttons: [{
            text: '确定',
            handler: function () {
                d.panel('destroy');
            }
        },
        {
            text: '返回',
            handler: function () {
                d.panel('destroy');
            }
        }]
    });
}

//删除单条
function delIndexOneRow(rowIndex){
    $.messager.confirm('提示','数据删除后将无法恢复，确认是否删除？',function(r){
        if (r){
            //确定删除，调用后台删除方法
            datagridUtil.deleteSingleRow(rowIndex);
        }
    });
}

//删除多条
function delMultipleData(){
	//是否选择的datagrid的行，选择为true，未选择为false，则提示用户选择
    if(datagridUtil.isSelectRows()){
        $.messager.confirm('提示','数据删除后将无法恢复，确认是否删除？',function(r){
            if (r){
                //确定删除，调用后台删除方法
                datagridUtil.deleteMoreRow();
            }
        });
    }
}
