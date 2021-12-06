    // staff js
	$(document).ready(function()
	{
		$.ajax({
			url:"https://api.mominov.site/api/get-positions",
			type:"POST",
			headers:{
				'Accept':'application/json',
				'Authorization': 'Bearer '+ token
			},
			success:function(response)
			{
				response.success.positions.forEach(function(item)
				{
					$('#staff-modal .modal-body select[name="position"]').append(`
						<option value="${item.id}">${item.position}</option>
						`)
				})
				console.log(response)
			}
		})


		$.ajax({
			url:"https://api.mominov.site/api/get-staff",
			type:"POST",
			headers:{
				'Accept':'application/json',
				'Authorization': 'Bearer '+ token
			},
			success:function(response)
			{
				response.success.staff.forEach(function(item)
				{
					$('.staff-tbody').append(`

						<tr data-id="${item.id}">

						<td></td>
						<td>${item.name}</td>
						<td>${item.surname}</td>
						<td>${item.birthday}</td>
						<td>
						<button class="btn btn-primary"><i class="fa fa-pencil"></i></button>
						<button class="btn btn-danger"><i class="fa fa-trash"></i></button>
						</td>
						</tr>
						`)
				})
				console.log(response);
				Nomrele();
			},
			error:function(response)
			{
				console.log(response)
			}
		})
	})

	function Nomrele()
	{
		var k = 0;
		$('.staff-tbody tr').each(function()
		{
			$(this).find('td:eq(0)').text(++k)
		})
	}


	$('.staff-thead').on('click','.btn-success',function()
	{
		$('#staff-modal').attr('user-id',0);
		$('#staff-modal .modal-body input').val('');
		$('#staff-modal').modal('show');
	})

	$('#staff-modal .modal-footer').on('click','.btn-success',function()
	{
		var id = $('#staff-modal').attr('user-id');
		var name = $('#staff-modal .modal-body input[name="name"]').val().trim();
		var surname = $('#staff-modal .modal-body input[name="surname"]').val().trim();
		var birthday = $('#staff-modal .modal-body input[name="birthday"]').val();
		var salary = $('#staff-modal .modal-body input[name="salary"]').val();
		var gender = $('#staff-modal .modal-body select[name="gender"]').find(':selected').val();
		var position_id = $('#staff-modal .modal-body select[name="position"]').find(':selected').val();
		$.ajax({
			url:"https://api.mominov.site/api/add-edit-staff",
			type:"POST",
			headers:{
				'Accept':'application/json',
				'Authorization': 'Bearer '+ token
			},
			data:{id,name,surname,gender,salary,birthday,position_id},
			success:function(response)
			{
				if (id ==0)
				 {
				 	$('.staff-tbody').append(`
				 		<tr>
				 			<td></td>
				 			<td>${name}</td>
				 			<td>${surname}</td>
				 			<td>${birthday}</td>
				 			<td>
							<button class="btn btn-primary"><i class="fa fa-pencil"></i></button>
							<button class="btn btn-danger"><i class="fa fa-trash"></i></button>
							</td>
				 		</tr>
				 		`)
				 	Nomrele();
				 }
				 else
				 {
				 	var tr = $('.staff-tbody tr[data-id="'+id+'"]');
				 	tr.find('td:eq(1)').text(name);
				 	tr.find('td:eq(2)').text(surname);
				 	tr.find('td:eq(3)').text(birthday);
				 }
				 $('#staff-modal .modal-body input').val('');
				 $('#staff-modal').modal('hide');
				console.log(response);
			},
			error:function(response)
			{
				console.log(response)
			}

		})
	})
	$('.staff-tbody').on('click','.btn-primary',function()
	{
		var tr = $(this).parents('tr');
		var id = tr.attr('data-id');
		$.ajax({
			url:"https://api.mominov.site/api/info-staff",
			type:"POST",
			headers:{
				'Accept':'application/json',
				'Authorization': 'Bearer '+ token
			},
			data:{id},
			success:function(response)
			{
				var staff_information = response.success.staff;
				$('#staff-modal').attr('user-id',staff_information.id)
				$('#staff-modal .modal-body input[name="name"]').val(staff_information.name);
				$('#staff-modal .modal-body input[name="surname"]').val(staff_information.surname);
				$('#staff-modal .modal-body input[name="salary"]').val(staff_information.salary);
				$('#staff-modal .modal-body input[name="birthday"]').val(staff_information.birthday);
				$('#staff-modal .modal-body select[name="gender"]')
				.find(`option[value="${staff_information.gender}"]`).attr('selected','selected');
				$('#staff-modal .modal-body select[name="position"]')
				.find(`option[value="${staff_information.position_id}"]`).attr('selected','selected');
				$('#staff-modal').modal('show');
				console.log(response);
			},
			error:function(response)
			{
				console.log(response)
			}

		})
	})

	$('.staff-tbody').on('click','.btn-danger',function(){
		var tr = $(this).parents('tr');
		var id = tr.attr('data-id')
		$.ajax({
			url:'https://api.mominov.site/api/delete-staff',
			type:'POST',
			data:{id},
			success:function(response){
				console.log(response);
				tr.remove();
                Nomrele();
			},
			error:function(response){
				console.log(response)
			}
		});
	})
