$(function(){
	initTreeGrid();
	initDatagrid();
});

//创建treegrid
function initTreeGrid(){
	$('#index-treegrid').treegrid({
		method: "get",
		url:'../../json/treegrid_data.json', 
	    fit : true,
		fitColumns : true,
		border : false,
		idField : 'id',
		treeField:'name',
		iconCls: 'icon',
		rownumbers:true,
		singleSelect:true,
		striped:true,
	    columns:[[    
	        {field:'id',title:'id',hidden:true,width:100},    
	        {field:'name',title:'名称',width:150}
	    ]],
	    enableHeaderClickMenu: false,
	    enableHeaderContextMenu: false,
	    enableRowContextMenu: false,
	    dataPlain: true,
	    onClickRow:function(row){
	    	console.log("row",row);
	    	alert("id="+row.id);
	    }
	});
}

//初始化表格
function initDatagrid(){
    $("#index-datagrid").datagrid({
        method: "get",
		url:'../../json/datagrid_data.json', 
	    fit : true,
		fitColumns : true,
		border : false,
		idField : 'id',
		striped:true,
		pagination:true,
		rownumbers:true,
		columns:[[
		    {field:"id",title:'id',checkbox : true},
		  	{field:'name',title:'单品名称',sortable:false,width:50},
		  	{field:'barCode',title:'单品条码',sortable:false,width:60,editor:{type:'textbox'}},
		  	{field:'styleCode',title:'单品款码',sortable:false,width:30}
		]]
    });
}