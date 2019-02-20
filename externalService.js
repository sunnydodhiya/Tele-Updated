
const externalServiceRequest = require('request');

module.exports={
	ext: function(){},

	extServiceAddMapping:function (username,btoa,phoneNumber,friendlyName){
		console.log("in external service");
		var endPointUrl="https://cloud.restcomm.com/restcomm/2012-04-24/Accounts/"+username+"/IncomingPhoneNumbers.json";
		var data={
			"PhoneNumber":phoneNumber,
			"SmsUrl":"https://cloud-xmpp-service.restcomm.com/xmpp/messages/sms",
			"isSIP":"true",
			"FriendlyName":friendlyName
		};
		externalServiceRequest.post({
			url:url,
			body:data,
			headers:{
				'Content-Type': 'application/json',
      			"Authorization": "Basic " +btoa
	      	},
	      	method:"POST",
	      	json:true

			},(exterror,extres)=>{
				if(exterror){
					console.log("ext call while adding mapping failed with error ",exterror);
					return false;
				}else{
					
					if(extres.statusCode==200){
						console.log("call successful");
						return true;
					}else{
						console.log("ext call failed ",extres);
						return false;
					}
				}
			});
	},

	extServiceGetSid: function(username,btoa,phoneNumber){
		var endPointUrl="https://cloud.restcomm.com/restcomm/2012-04-24/Accounts/"+username+"/IncomingPhoneNumbers.json";
		var data={
			"PhoneNumber":phoneNumber
		};
		externalServiceRequest.get({
			url:url,
			body:data,
			headers:{
				'Content-Type': 'application/json',
      			"Authorization": "Basic " +btoa
	      	},
	      	method:"GET",
	      	json:true

			},(exterror,extres)=>{
				if(exterror){
					console.log("ext call while getting sid with ",exterror);
					return null;
				}else{
					
					return extres.incomingPhoneNumbers;
				}
			});
	},

	extServiceDeleteMapping:function(username,btoa,sid){
		var endPointUrl="https://cloud.restcomm.com/restcomm/2012-04-24/Accounts/"+username+"/IncomingPhoneNumbers/PN5369cbaf5e6f48d2954446717be59206";
		var data={
		};
		externalServiceRequest.delete({
			url:url,
			body:data,
			headers:{
				'Content-Type': 'application/json',
				"Authorization": "Basic " +btoa
	      	},
	      	json:true

			},(exterror,extres)=>{
				if(exterror){
					console.log("ext call while adding mapping failed with error ",exterror);
					return false;
				}else{
					
					return true;
				}
			});
	}

}
