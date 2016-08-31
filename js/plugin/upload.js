$(function(){
	$('.cropme').simpleCropper();
	
	//图片上传
    uploadGoodsPicUpdate("uploadForm0","skuMainPicUpdate");
    uploadGoodsPicUpdate("uploadForm1","skuDeputyPicUpdate1");
    uploadGoodsPicUpdate("uploadForm2","skuDeputyPicUpdate2");
    uploadGoodsPicUpdate("uploadForm3","skuDeputyPicUpdate3");
    uploadGoodsPicUpdate("uploadForm4","skuDeputyPicUpdate4");
});

//图片上传
function uploadGoodsPicUpdate(id1,id2){
	 // 主图上传
    $('#'+id1).form({
        onSubmit: function(){
        	//是否存在img图片，只有上传啦才会创建img标签
        	var imgLength = $("#"+id1+" .cropme").children("img").length;
        	if(imgLength == 0){
        		$.messager.alert('提示','请选择需要上传的图片');
        		return false;
        	}
        	return true;
        },    
        success:function(data){
        	if(data == ''){
        		// 设置图片 上传失败
            	$.messager.alert('提示','上传失败');
        	}else{
        		// 设置图片 上传成功
            	$("#"+id2).val(data);
            	$.messager.alert('提示','上传成功');
        	}
        }    
    });
}
