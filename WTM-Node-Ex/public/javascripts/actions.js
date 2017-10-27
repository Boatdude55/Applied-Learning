$(function(){
	//TODO: Add page interactions for "Compute" card
	
	$("#setSplash").click(function(){
		updateSplash($("#splashContent").val());
	});
});

function updateSplash(htmlContent, callback) {
	$.post(
		"/actions/splash",
		{content: htmlContent},
		function(result){
			if (typeof callback === 'function') callback();
		}
	);
}

//TODO: Add function to interact with "Compute" feature of server