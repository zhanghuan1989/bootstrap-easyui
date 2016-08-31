//datagrid Id
datagridUtil.datagridId = "index-datagrid";

var editRowIndex = undefined;      //光标所在当前行
var editField = undefined;      //光标所在当前列

$(function(){
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
		//border : false,
		idField : 'id',
		//striped:true,
		//pagination:false,
		rownumbers:true,
		showFooter:true,
		columns:[[
		    {field:"id",title:'id',checkbox : true},
		  	{field:'name',title:'单品名称',sortable:false,width:250,editor:{type:'textbox'},
                formatter : function(value, row,index) {
                    var str = "";
                    if(row.isFooter){
                        str = '<div>合计</div>';
                    }else{
                    	str = value;
                    }
                    return str;
                }
            },
		  	{field:'barCode',title:'单品条码',sortable:false,width:200,editor:{type:'textbox'}},
		  	{field:'styleCode',title:'单品款码',sortable:false,width:200,editor:{type:'textbox'}},
		  	{field:'goodsAttr',title:'单品属性',sortable:false,width:200,editor:{type:'textbox'}},
		  	{field:'price',title:'单价',sortable:false,width:200,editor:{type:'numberbox',options:{min:0,max:999999999,precision:2}}},
		  	{field:'largeNum',title:'箱数',width:100,align:'center',
                editor:{
                    type:'numberbox',
                    options:{
                        min:0,
                        precision:0,
                    }
                },
            },
            {field:'isGift',title:'是否赠品',width:100,align:'center',
                formatter:function(value,row){
                    if(row.isFooter){
                        return;
                    }
                    return value=='1'?'是':(value=='0'?'否':'');
                },
                editor:{
                    type:'combobox',
                    options:{
                        valueField: 'id',
                        textField: 'text',
                        data: [{
                            "id":'1',
                            "text":"是"
                        },{
                            "id":'0',
                            "text":"否",
                        }],
                    }
                }
            },
            {field:'goodsCreateDate',title:'生产日期',width:100,align:'center',
                formatter : function(value, row,index) {
                    if(row.isFooter){
                        return;
                    }
                    return value;
                },
                editor:{
                    type:'datebox',
                },
            },
		  	{field:'operator',title:'操作',sortable:false,align:'center',width:150,
		  		formatter : function(value, rowData, rowIndex) {
		  			if(rowData.isFooter){
		  				return "";
		  			}else{
		  				var operateHtml = $("#index-operator").html();
			  			operateHtml = operateHtml.replace("addLineHandel()","addLineHandel('"+rowIndex+"')");
			  			operateHtml = operateHtml.replace("delLineHandel()","delLineHandel('"+rowIndex+"')");
		                return operateHtml;
		  			}
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
			onChangeDatagridEdit(rowIndex);
        },
		enableHeaderClickMenu: false,
		enableHeaderContextMenu: false,
	    enableRowContextMenu: false,
	    toolbar:'#index-toolbar',
	    onLoadSuccess:function(data){
            updateFooter();
        }
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

//编辑一行时触发事件
function onChangeDatagridEdit(rowIndex){
    var priceNum = $('#'+datagridUtil.datagridId).datagrid('getEditor', {index:rowIndex,field:"price"});
    var edLargeNum =$('#'+datagridUtil.datagridId).datagrid('getEditor', { index: rowIndex, field: 'largeNum' });
    //监听价格改变事件
    $(priceNum.target).numberbox({ onChange: function (newV,oldV) {
	        updateFooter();
	    }
    });
    //监听箱数值改变事件
    $(edLargeNum.target).numberbox({ onChange: function (newV,oldV) {
	        //$(edRealNum.target).numberbox('setValue',newV);
	        updateFooter();
    	}
    });
}

//合计
function updateFooter(){
    var price = 0.0;
    var largeNum = 0;
    var rows = $('#'+datagridUtil.datagridId).datagrid("getRows");
    if($('#'+datagridUtil.datagridId).datagrid('getEditors') && editRowIndex){
        var obj = {
        	price:datagridUtil.getNumberboxFieldValue(editRowIndex,'price') || 0,
            largeNum:datagridUtil.getNumberboxFieldValue(editRowIndex,'largeNum') || 0  
        };
        rows.push(obj);
    }
    $.each(rows,function(i,row){
        price += parseFloat(row["price"] ? row["price"] : 0.0);
        largeNum += parseInt(row["largeNum"] ? row["largeNum"] : 0);
    });
    $('#'+datagridUtil.datagridId).datagrid('reloadFooter',[
        {
            "isFooter":true,
            "price":price,
            "largeNum":largeNum.toFixed(2),
        }
    ]);
}