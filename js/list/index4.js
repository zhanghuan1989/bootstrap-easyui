//datagrid Id
datagridUtil.datagridId = "index-datagrid";

var editRowIndex = undefined;      //光标所在当前行
var editField = undefined;      //光标所在当前列

$(function(){
	//开始和结束时间
    $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",30));
    $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
    
    //初始化列表
    initDataGrid();
});

function initDataGrid() {
	//创建datagrid
	$('#'+datagridUtil.datagridId).datagrid({
		method: "get",
		url:'../../json/datagrid_data.json', 
	    //fit : true,
		//fitColumns : true,
		border : false,
		idField : 'id',
		striped:true,
		pagination:false,
		rownumbers:true,
		columns:[[
		    {field:"id",title:'id',checkbox : true},
		  	{field:'name',title:'单品名称',sortable:false,width:250,editor:{type:'textbox'}},
		  	{field:'barCode',title:'单品条码',sortable:false,width:200,editor:{type:'textbox'}},
		  	{field:'styleCode',title:'单品款码',sortable:false,width:200,editor:{type:'textbox'}},
		  	{field:'goodsAttr',title:'单品属性',sortable:false,width:200,editor:{type:'textbox'}},
		  	{field:'price',title:'单价',sortable:false,width:200,editor:{type:'numberbox',options:{min:0,max:999999999,precision:2}}},
		  	{field:'operator',title:'操作',sortable:false,align:'center',width:150,
		  		formatter : function(value, rowData, rowIndex) {
		  			var operateHtml = $("#index-operator").html();
		  			operateHtml = operateHtml.replace("addLineHandel()","addLineHandel('"+rowIndex+"')");
		  			operateHtml = operateHtml.replace("delLineHandel()","delLineHandel('"+rowIndex+"')");
	                return operateHtml;
				}
		  	}
		]],
		onClickCell:function(rowIndex,field,value){
            $('#'+datagridUtil.datagridId).datagrid('endEdit', editRowIndex);     //结束之前的编辑
            $('#'+datagridUtil.datagridId).datagrid('selectRow', rowIndex).datagrid('beginEdit', rowIndex);
            editRowIndex = rowIndex;
            editField = field;
            var ed = $('#'+datagridUtil.datagridId).datagrid('getEditor', {index:rowIndex,field:editField});
            if(!ed || !ed.target){
                ed = $('#'+datagridUtil.datagridId).datagrid('getEditor', {index:rowIndex,field:"name"});
                editField = "name";
            }
			$(ed.target).textbox('textbox').focus();
       },
		enableHeaderClickMenu: false,
		enableHeaderContextMenu: false,
	    enableRowContextMenu: false,
	    toolbar:'#index-toolbar'
	});
	
	$('#'+datagridUtil.datagridId).datagrid({}).datagrid("keyCtr");
}

//底部添加一行
function addRows(){
	var rowIndex = $("#"+datagridUtil.datagridId).datagrid("getRows").length;
	rowIndex = parseInt(rowIndex) - 1;
	datagridUtil.addSingleRow(rowIndex);
}

//删除多行
function delRows(){
	//是否选择的datagrid的行，选择为true，未选择为false，则提示用户选择
    if(datagridUtil.isSelectRows()){
        datagridUtil.deleteMoreRow();
    }
}

//保存
function saveRows(){
	var rows = $("#"+datagridUtil.datagridId).datagrid("getRows");
	var rowsStrs = JSON.stringify(rows);
	console.log("保存的数据==",rowsStrs);
}

//插入一行
function addLineHandel(rowIndex){
    datagridUtil.addSingleRow(rowIndex);
}

//删除一行
function delLineHandel(rowIndex){
    datagridUtil.deleteSingleRow(rowIndex);
}

//改变日期
function changeDate(index){
    switch (index){
        case 0: //今天
            $("#txtStartDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            break;
        case 1: //昨天
            $("#txtStartDate").val(dateUtil.getCurrDayPreOrNextDay("prev",1));
            $("#txtEndDate").val(dateUtil.getCurrDayPreOrNextDay("prev",1));
            break;
        case 2: //本周
            $("#txtStartDate").val(dateUtil.getCurrentWeek()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            break;
        case 3: //上周
            $("#txtStartDate").val(dateUtil.getPreviousWeek()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getPreviousWeek()[1].format("yyyy-MM-dd"));
            break;
        case 4: //本月
            $("#txtStartDate").val(dateUtil.getCurrentMonth()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            break;
        case 5: //上月
            $("#txtStartDate").val(dateUtil.getPreviousMonth()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getPreviousMonth()[1].format("yyyy-MM-dd"));
            break;
        case 6: //本季
            $("#txtStartDate").val(dateUtil.getCurrentSeason()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            break;
        case 7: //上季
            $("#txtStartDate").val(dateUtil.getPreviousSeason()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getPreviousSeason()[1].format("yyyy-MM-dd"));
            break;
        case 8: //今年
            $("#txtStartDate").val(dateUtil.getCurrentYear()[0].format("yyyy-MM-dd"));
            $("#txtEndDate").val(dateUtil.getCurrentDate().format("yyyy-MM-dd"));
            break;
        default :
            break;
    }
}

//调价
function modifyDialog(){
	//所有editor失去焦点,结束之前的编辑
    datagridUtil.setEditorBlur();

    var d = $("<div style='position:relative;'/>").dialog({
        title: '公式应用',
        top:20,
        width: 600,
        height: 220,
        href: 'modify-dialog.html',
        maximizable: false,
        modal: true,
        buttons: [{
            text: '确定',
            handler: function () {
               setModifyPrice(d);
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
