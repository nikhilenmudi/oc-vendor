
$(document).on('pageinit','#loginPage',function(){
	$('#loginBtn').on('click',function(){
				$.mobile.loading('show');
				var username = $("#username").val();
				var password = $("#password").val();
				var loginKey = username+" "+password;
				console.log(loginKey);
				$.ajax({
						type: 'POST',
						url: "http://orderchiefcloud-orderchief.rhcloud.com/login/",
                        data : {"loginKey":loginKey},
                        success: function(data) {
						$.mobile.loading('hide');
								if(data != 'FAIL'){
                                goToHome(data);
								}
								else{
								alert("Login failed");
								}
                            
                        },
                        error: function (request,error) {
                            // This callback function will trigger on unsuccessful action               
                            $.mobile.loading('hide');
							alert('Login Failed!');
                        }
                    });           
                
		
	});
});

function goToHome(vendorId){
sessionStorage.vendorId = vendorId;
$.mobile.changePage("#home");
}
$(document).on('pageinit','#orders', function(){
	

	
	var vendorId = sessionStorage.vendorId;
	$("#orders").on('pagebeforeshow', function(){
		$.ajax({
		type : 'GET',
		url : "http://orderchiefcloud-orderchief.rhcloud.com/getOrders/"+vendorId,
		}).done(function(data){
			getOrdersForVendor(data);
		}).fail(function(){
		
		});
	});
	
	$('#orders-list').on('click', 'li', function() {
        var orderId = $(this).attr('data-id');
		console.log(orderId);
		var userGcmKey = $(this).attr('data-key');
		console.log(userGcmKey);
		sessionStorage.userGcmKey = userGcmKey;
		sessionStorage.currentOrderId = orderId;
		console.log("ajaxing");
		$.mobile.loading('show');
		$.ajax({
		type : 'GET',
		//url : "http://192.168.2.22:8080/server/getOrderItems/"+orderId,
		url : "http://orderchiefcloud-orderchief.rhcloud.com/getOrderItems/"+orderId,
		}).done(function(data){
			$.mobile.loading('hide');
			getOrderItems(data);
		}).fail(function(){
			$.mobile.loading('hide');
			alert("Error while fetching orders");
		});
    });
//		$(document).on('click','#vendors-list li', function(){
//			sessionStorage.selectedVendorId = $(this).jqmData('id');
//			console.log('Selected id: ' + sessionStorage.selectedVendorId);
//			$.mobile.changePage('#Menu');
//			
//		});	
});

$(document).on('pageinit','#orderDesc', function(){

	var regId = sessionStorage.userGcmKey;
	$('#orderReady').on('click',function(){
		
		$.ajax({
		type : 'POST',
		//url : "http://192.168.2.22:8080/server/getOrderItems/"+orderId,
		url : "http://orderchiefcloud-orderchief.rhcloud.com/orderready/",
		data : {"regId" : regId}
		}).done(function(data){
			alert("userNotified");
			orderDone(sessionStorage.currentOrderId);
		}).fail(function(){
		
		});
	
	});
	
	

});

function orderDone(id){
	var completedOrderId = id;
	$.ajax({
		type : 'POST',
		//url : "http://192.168.2.22:8080/server/getOrderItems/"+orderId,
		url : "http://orderchiefcloud-orderchief.rhcloud.com/ordercomplete/",
		data : {"completedOrderId" : completedOrderId}
		}).done(function(){
			$.mobile.changePage('#orders');
		}).fail(function(){
		
		});
	
	
}


function getOrdersForVendor(data){
	var list ="";
	var orders = data;
	alert("creating");
	$.each(orders,function(i, value){
	list += '<li class="row" data-key='+value.userGcmKey+' data-id ='+value.orderid+'><h3> Order Id - '+value.orderid+''+value.stats+'</h3></li>';
	});
	$('#orders-list').html(list).trigger('create');
	$('#orders-list').listview('refresh');

}

function getOrderItems(data){
	var orderDiv = "";
	var orderItems = data;
	console.log("data"+data);
	$.each(orderItems, function(i,value){
	orderDiv += '<div><h2>'+value.productName+'</h2>';
		$.each(value.productOptions,function(i, val){
			orderDiv+='<span>Options - </span>';
			orderDiv+='<p>'+val+'</p>';
		});
		$.each(value.productSubOptions,function(i, val){
			orderDiv+='<span> Size :'+val+'</span>';
		});
	orderDiv+='</div>';
	});
	$.mobile.changePage('#orderDesc');
	
	console.log(orderDiv);
	$('#orderContent').html(orderDiv);
}