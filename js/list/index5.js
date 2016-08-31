//datagrid Id
datagridUtil.datagridId = "index-datagrid";

$(function(){
    //初始化列表
    initDataGrid();
});

function initDataGrid() {
	//创建datagrid
	$('#'+datagridUtil.datagridId).datagrid({
		method: "get",
		data: [{"rows":[]}],
	    fit : true,
		fitColumns : true,
		border : false,
		idField : 'id',
		striped:true,
		rownumbers:true,
		columns:[[
		    {field:"id",title:'id',checkbox : true},
		  	{field:'name',title:'单品名称',sortable:false,width:50},
		  	{field:'barCode',title:'单品条码',sortable:false,width:60,editor:{type:'textbox'}},
		  	{field:'styleCode',title:'单品款码',sortable:false,width:30},
		  	{field:'goodsAttr',title:'单品属性',sortable:false,width:30},
		  	{field:'operator',title:'操作',sortable:false,align:'center',
		  		formatter : function(value, rowData, rowIndex) {
		  			var operateHtml = $("#index-operator").html();
		  			operateHtml = operateHtml.replace("delLineHandel()","delLineHandel('"+rowIndex+"')");
	                return operateHtml;
				}
		  	}
		]],
		enableHeaderClickMenu: false,
		enableHeaderContextMenu: false,
	    enableRowContextMenu: false,
	    toolbar:'#index-toolbar'
	});
}

//点击商品选择
function selectGoods(){
	new selectGoodsService(function(newData){
		//合并选择后的数据到当前datagrid数据中，并去掉重复数据
		datagridUtil.mergeDataGridData(newData);
	});
}

//商品选择公共类
function selectGoodsService(callback){
	var d = $("<div style='position:relative;'/>").dialog({
        title: '商品选择',
        top:20,
        width: 700,
        height: 600,
        href: 'tree-dialog.html',
        maximizable: false,
        modal: true,
        buttons: [{
            text: '确定',
            handler: function () {
            	var rows = $("#gridGoods").datagrid("getSelections");
            	//回调函数
            	callback(rows);
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

//删除多条
function delGoods(){
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

//删除一行
function delLineHandel(rowIndex){
	$.messager.confirm('提示','数据删除后将无法恢复，确认是否删除？',function(r){
        if (r){
            //确定删除，调用后台删除方法
            datagridUtil.deleteSingleRow(rowIndex);
        }
    });
}

