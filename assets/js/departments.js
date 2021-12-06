   // departments js
   $(document).ready(function() 
   {
       LoadTable();
       $.ajax({
           url:"https://api.mominov.site/api/get-staff",
           type:"POST",
           success:function(response)
           {
               response.success.staff.forEach(function(item)
               {
                   $('select[name="employees[]"]').append(`
                       <option value="${item.id}">${item.name} ${item.surname}</option>
                       `)
               })
               $('.js-example-basic-single').select2();
           }
       })
   });

   
   $('.btn-success-departments').click(function()
   {
       var user_mass =[];
       $('select[name="employees[]"]').find(':selected').each(function()
       {
           user_mass.push($(this).val());
       })
       var departmant_name = $('input[name="departmant_name"]').val().trim();
       $.ajax({
           url:"https://api.mominov.site/api/add-departmant",
           type:"POST",
           headers: {
               Accept: 'application/json',
               Authorization: 'Bearer ' + token,
           },
           data:{'name':departmant_name,'staff':user_mass},
           success:function(response)
           {
               LoadTable();
           },
           error:function(response)
           {
               console.log(response)
           }
       })
   })

   function LoadTable()
{
   $.ajax({
           url:"https://api.mominov.site/api/get-departmant",
           type:"POST",
           success:function(response)
           {
               $('.departments-tbody').html('')
               response.success.departmans.forEach(function(item,indexNum)
               {
                   $('.departments-tbody').append(`
                       <tr>
                           <td>${indexNum + 1}</td>
                           <td>${item.name}</td>
                           <td></td>
                       </tr>`)
                   var mass = JSON.parse(item.employees)
                   names = '';
                   mass.forEach(function(user)
                   {
                       names = names + user.name+', '
                   })
                   $('.departments-tbody tr').last().find('td:eq(2)').text(names)
                   console.log(mass)
               })
           }
       })
}