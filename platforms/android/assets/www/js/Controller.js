

$(document).on('pageinit','#orders', function(){
	
//	$.ajax({
//		type : 'POST',
//		url : "http://192.168.2.22:8080/server/orderready?regId=APA91bETBcMWeWBhN_dVdbN-194g1VuvMBE-nscj8DxrgYxo0MdxQJBBM7sxtsovhZp5b6oBWeQFhnaSXhw3Uxki_7OtTxYbv9g9bD9LUnA1ZUYAD_Wg6zEn0VmxKCfq3RYG2MfQAt4HTVR6xqwjwQtVSb6ThKmY_QRuI57aTPNPxEYvEI3b9MQ"
//		}).done(function(data){
//			console.log("done");
//		}).fail(function(){
//		
//		});
	

	$("#orders").on('pagebeforeshow', function(){
		$.ajax({
		type : 'GET',
		url : "http://192.168.2.22:8080/server/getOrders/1",
		}).done(function(data){
			getOrdersForVendor(data);
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

function getOrdersForVendor(data){
	var list ="";
	var orders = data;
	//alert("creating");
	$.each(orders,function(i, value){
	list += '<li class="row" data-id ='+value.orderid+'><h3>'+value.status+'</h3></li>';
	});
	$('#orders-list').html(list).trigger('create');
	$('#orders-list').listview('refresh');

}