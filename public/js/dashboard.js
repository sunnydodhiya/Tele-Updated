	var id='';
	var rownumber,jaddress,eaddress;
	function deleteData(ids){
		id=ids;
	}

	function editData(ids,row,jabberAddress,externalAddress){
		id=ids;
		rownumber=row;
		jaddress=jabberAddress;
		eaddress= externalAddress;
	}
	//get all mapping
	function getallMapping(){

		$.ajax({
			url:"/api/allmapping",
			type:"get",
			success(result){
				console.log("i ma in",result.mapping);
				
				console.log(result.length);
				if(typeof result != 'undefined' && result.mapping.length>0){
					var htmldata='';
					for(var i in result.mapping){
						htmldata=htmldata+`

    								<tr>
							            <td>`+(parseInt(i)+1)+`</td>
							            <td>`+result.mapping[i].id+`</td>
							            <td>`+result.mapping[i].jabberAddress+`</td>
							            <td>`+result.mapping[i].externalAddress+`</td>
							            <td>
							            	<span class="btn btn-sm btn-warning" data-toggle="modal" data-target="#editModal">
							            		Edit
							            	</span>
							            	<span class="btn btn-sm btn-danger" data-toggle="modal" data-target="#deleteModal" onclick="deleteData('`+result.mapping[i].id+`')">
							            		Delete
							            	</span>
							            </td>
							        </tr>
    					`;
					}

					$('#mappingTable > tbody ').empty().html(htmldata);	
				} 
			}
		})
	}
	$(document).ready( function () {
   var  table= $('#mappingTable').DataTable();
   $("#createMappingError").hide();
   $("#editMappingError").hide();
   //onclick create mapping
    $('#addMapping').on('click',function(){
    	console.log("i am in click");
    	var address=$("#newjabberAddress").val();
    	var number=$('#newrcnumber').val();
    	console.log(address,number);
    	$.ajax({
    		url:'/mapping/add',
    		data:{jabberAddress:address,externalAddress:number},
    		type:"post",
    		success(result){
    			console.log(result)
    			var totalrow=$("#mappingTable tr").length+1;
    			if(typeof result.error == 'undefined'){
					//console.log(typeof result.error != undefined);
					// $('#mappingTable tr:last').after(`

    	// 							<tr id="`+result.id+`">
					// 		            <td>`+($("#mappingTable tr").length+1)+`</td>
					// 		            <td>`+result.id+`</td>
					// 		            <td>`+result.jabberAddress+`</td>
					// 		            <td>`+result.externalAddress+`</td>
					// 		            <td>
					// 		            	<span class="btn btn-sm btn-warning" data-toggle="modal" data-target="#editModal">
					// 		            		Edit
					// 		            	</span>
					// 		            	<span class="btn btn-sm btn-danger" data-toggle="modal" data-target="#deleteModal" onclick="deleteData('`+result.id+`')">
					// 		            		Delete
					// 		            	</span>
					// 		            </td>
					// 		        </tr>
    	// 			`);
    			getallMapping();
				$('#createModal').modal('hide');
				$("#newjabberAddress").val("");
				$("#newrcnumber").val("");
				$("#createMappingError").hide();
				}else{
					
					$("#createMappingError").show();
				}    			
    		}
    	});

    	
    });

//logout control
$('#logoutbtn').on('click',function(response){
    console.log("i am in logout section");
	response.redirect('/index');	
		});
    

//editmapping control
    $('#editMapping').on('click',function(){
    	console.log("i am in click");
    	var address=$("#editjabberAddress").val();
    	var number=$('#editrcnumber').val();
    	console.log(address,number);
    	$.ajax({
    		url:'/mapping/edit',
    		data:{id:id,jabberAddress:address,externalAddress:number},
    		type:"post",
    		success(result){
    			if(typeof result.error == 'undefined'){
					//console.log(typeof result.error != undefined);

					$('#'+id).empty().html(`

							            <td>`+rownumber+`</td>
							            <td>`+result.id+`</td>
							            <td>`+result.jabberAddress+`</td>
							            <td>`+result.externalAddress+`</td>
							            <td>
							            	<span class="btn btn-sm btn-warning" data-toggle="modal" data-target="#editModal onclick="editData('`+result.id+`',`+rownumber+`)">
							            		Edit
							            	</span>
							            	<span class="btn btn-sm btn-danger" data-toggle="modal" data-target="#deleteModal" onclick="deleteData('`+result.id+`')">
							            		Delete
							            	</span>
							            </td>
    				`);

				
				$("#editjabberAddress").val("");
				$("#editrcnumber").val("");
				$("#editMappingError").hide();

    			$('#editModal').modal('hide');
				}else{
					
					$("#editMappingError").show();
				}    			
    		}
    	});


    });

    $('#deleteMapping').on('click',function(){
    //	console.log("i am in click");
    	$.ajax({
			url:"./mapping/delete",
			type:"post",
			data:{id:id},
			success(result){
				console.log(result);
				
				getallMapping();
				$('#deleteModal').modal('hide');
			}
		});
    	
    	
    });


    //resetting the fields
    $('#createModal').on('hidden.bs.modal',function(e){
    	console.log("in hidden modal");
    	$("#newjabberAddress").val("");
		$("#newrcnumber").val("");
		$("#createMappingError").hide();
    });

    $('#editModal').on('hidden.bs.modal',function(e){
    	
    	$("#editjabberAddress").val("");
		$("#editrcnumber").val("");
		$("#editMappingError").hide();
	});
	
    $('#editModal').on('show.bs.modal',function(e){
    	
    	$("#editjabberAddress").val(jaddress);
		$("#editrcnumber").val(eaddress);
		$("#editMappingError").hide();
    });
} );

