//datagrid Id
datagridUtil.datagridId = "jsexcel-datagrid";

$(function(){
	initDataGrid();
});

//创建datagrid
function initDataGrid(){
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
		  	{field:'barCode',title:'单品条码',sortable:false,width:60},
		  	{field:'price',title:'单品价格',sortable:false,width:30},
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

//删除多条
function delMoreData(){
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

//下载excel模板
function downExcel(){
	var url = $("#down-excel").attr("url");
	var downloadUrl = [url];
    $(downloadUrl).multiDownload({"source":"local"});
}

//导入excel
function importExcelDialog(){
	var d = $("<div style='position:relative;'/>").dialog({
        title: '导入选择文件',
        top:20,
        width: 380,
        height: 135,
        href: 'jsexcel-dialog.html',
        maximizable: false,
        modal: true,
        buttons: [{
            text: '导入',
            handler: function () {
            	postExcel(d);
            }
        },
        {
            text: '取消',
            handler: function () {
                d.panel('destroy');
            }
        }]
    });
}

//导出excel
function exportExcel(){
	//动态创建table，并且将table导出为excel格式
	var tableId = "jsexcel-export-table";
	createExcelTabel(datagridUtil.datagridId,tableId);
}



