function submitForm(d){
	var formObj = $("#dialog-form").serializeObject();
    console.log("formObj",formObj);
	$('#dialog-form').form('submit', {
	    url:"",
	    onSubmit: function(){
			var isValid = $(this).form('validate');
			alert("submit isValid="+isValid);
			if (!isValid){
				$.messager.progress('close');	
			}
			return isValid;	
	    },
	    success:function(data){
			alert("success");
			//销毁panel
			d.panel('destroy');
	    }
	});
}