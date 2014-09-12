

$(document).on('pageinit','#orders', function(){
	

	

	$("#orders").on('pagebeforeshow', function(){
		$.ajax({
		type : 'GET',
		url : "http://192.168.2.22:8080/server/getOrders/1",
		}).done(function(data){
			getOrdersForVendor(data);
		}).fail(function(){
		
		});
	});
	
	$('#orders-list').on('click', 'li', function() {
        var orderId = $(this).attr('data-id');
		var userGcmKey = $(this).attr('data-key');
		sessionStorage.userGcmKey = userGcmKey;
		sessionStorage.currentOrderId = orderId;
		$.ajax({
		type : 'GET',
		//url : "http://192.168.2.22:8080/server/getOrderItems/"+orderId,
		url : "http://192.168.2.22:8080/server/getOrderItems/"+orderId,
		}).done(function(data){
			getOrderItems(data);
		}).fail(function(){
		
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
		url : "http://192.168.2.22:8080/server/orderready/",
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
		url : "http://192.168.2.22:8080/server/ordercomplete/",
		data : {"completedOrderId" : completedOrderId}
		}).done(function(){
			$.mobile.changePage('#orders');
		}).fail(function(){
		
		});
	
	
}


function getOrdersForVendor(data){
	var list ="";
	var orders = data;
	//alert("creating");
	$.each(orders,function(i, value){
	list += '<li class="row" data-key='+value.userGcmKey+' data-id ='+value.orderid+'><h3>'+value.status+'</h3></li>';
	});
	$('#orders-list').html(list).trigger('create');
	$('#orders-list').listview('refresh');

}

function getOrderItems(data){
	var orderDiv = "";
	var orderItems = data;
	
	$.each(orderItems, function(i,value){
	orderDiv += '<p>'+value.productName+'</p><br />'
	});
	$.mobile.changePage('#orderDesc');
	
	console.log(orderDiv);
	$('#orderContent').html(orderDiv);
}