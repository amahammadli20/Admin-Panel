// position js
$(document).ready(function()
{
    $.ajax({
        url:"https://api.mominov.site/api/get-positions",
        type:"POST",
        success:function(response)
        {
            // console.log('response.success.positions: ', response.success.positions);
            //positions array-i ve icindeki hem bir json item-i
            response.success.positions.forEach(function(item){
                $('.positions-tbody').append(`
                        <tr data-id="${item.id}">
                            <td></td>
                            <td>${item.position}</td>
                            <td>
                                <button class="btn btn-primary">
                                    <i class="fa fa-pencil"></i>
                                </button>
                                <button class="btn btn-danger">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `)
            });
            SortNum()
            console.log(response)
        }
    })
});


//Thead-deki "yeni" buttona basdiqda, gotur tbody-e yeni tr elave ele
$('.positions-thead').on('click','.btn-success',function()
{
    $('.positions-tbody').append(`
        <tr>
            <td></td>
            <td><input type="text" class="form-control" name="new_position"/></td>
            <td>
                <button class="btn btn-success add-position">
                    <i class="fa fa-save"></i>
                </button>
                <button class="btn btn-warning cancel">
                    <i class="fa fa-times"></i>
                </button>
            </td>
        </tr>
        `)
    SortNum(); 
})


//sari rengli x(cancel) duymesine basdiqda, basdigin cancel duymesinin tr parents-ini tamamile sil ve sildikden sonra yeniden 0-dan
$('.C:\Users\Aytac Mahammadli\Desktop\AdminPanel\departmans.html-tbody').on('click','.cancel',function()
{
    $(this).parents('tr').remove();
    SortNum();
})

// 1) yasil duymeye basdiqda, basdigimiz hemin duymenin tr parent-ini gotururuk
// 2) hemintr-in input tag-nin name attr-u new_position olanin deyerini gotururuk (qisaca inputa daxil olan/yazilan deyeri/texti)
// 3) 'new_position' keyword-u ile aldigimiz deyeri sorguyla data uzerinden gonderirik
// 4) eger sorgu ugurla bas tutarsa, onun tutdugu id-ni tr-in data-id attr-na veririk ve hemin id-li tr-in 1-ci td-sine yeni psoition-u, 2-ci td-ne ise mavi, qirmizi btns
$('.positions-tbody').on('click','.add-position',function()
{
    var tr = $(this).parents('tr');
    var new_position = tr.find('input[name="new_position"]').val().trim();

    $.ajax({
        url:"https://api.mominov.site/api/add-position",
        type:"POST",
        headers:{
            'Accept':'application/json',
            'Authorization': 'Bearer '+ token
        },
        data:{
            'new_position':new_position
        },
        success:function(response){
            var id = response.success.id;
            tr.attr('data-id',id)
            tr.find('td:eq(1)').text(new_position);
            tr.find('td:eq(2)').html(`
                    <button class="btn btn-primary">
                        <i class="fa fa-pencil"></i>
                    </button>
                    <button class="btn btn-danger">
                        <i class="fa fa-trash"></i>
                    </button>
                `)
            console.log(response)
        },
        error:function(response)
        {
            console.log(response);
        }
    })

})


//siralama funskiyasi
function SortNum()
{
    var k = 0;
    $('.positions-tbody tr').each(function()
    {
        //her tr-de(yeni row-da) td 0-ci cell-i bir vahid artirib textine yaz
        $(this).find('td:eq(0)').text(++k)
    })
}



//qirmizi - silmek btn-a basdiqda:
// 1) basdigimiz btn-nun tr parent-inin data-id attr-dan id-ni aliriq
// 2) hemin id-ni sorguda gonderirik ve hemin id-li tr-i silirik ve yeniden siralayiriq
$('.positions-tbody').on('click','.btn-danger',function()
{
    var tr = $(this).parents('tr');
    var id = tr.attr('data-id');
    $.ajax({
        url:"https://api.mominov.site/api/delete-position",
        type:"POST",
        headers:{
            'Accept':'application/json',
            'Authorization': 'Bearer '+ token
        },
        data:{
            id
        },
        success:function(response)
        {
            
            tr.remove();
            SortNum();
            console.log(response)
        },
        error:function(response)
        {
            console.log(response)
        }
    })
})


// edit - mavi duymesine basdiqda:
// 1) basdigimizin tr parentin-deki 1-ci td-nin deyerini/textini aliriq, old_position deyisenine menimsedirik
// 2) hemin tr-in 1-ci td-nin html-ni 
$('.positions-tbody').on('click','.btn-primary',function()
{
    var tr = $(this).parents('tr');
    var old_position = tr.find('td:eq(1)').text().trim();
    tr.find('td:eq(1)').html(`<input type="text" class="form-control" name="edit_position" value="${old_position}" />`);
    tr.find('td:eq(1)').attr('old-position',old_position);
    tr.find('td:eq(2)').html(`
        <button class="btn btn-success edit-position"><i class="fa fa-save"></i>
        </button>
        <button class="btn btn-warning reset"><i class="fa fa-times"></i>
        </button>`)
})	


//cancel-i reset-le evez etmisik burda
$('.positions-tbody').on('click','.reset',function()
{
    var tr = $(this).parents('tr');
    var old_position = tr.find('td:eq(1)').attr('old-position');
    tr.find('td:eq(1)').text(old_position)
    tr.find('td:eq(2)').html(`
                    <button class="btn btn-primary"><i class="fa fa-pencil"></i>
                    </button>
                    <button class="btn btn-danger"><i class="fa fa-trash"></i>
                    </button>`);

})


//edit - yasil duymesine basdiqda:
$('.positions-tbody').on('click','.edit-position',function()
{
    var tr = $(this).parents('tr');
    var id = tr.attr('data-id');
    var new_position_name = tr.find('input[name="edit_position"]').val().trim();
    $.ajax({
        url:"https://api.mominov.site/api/edit-position",
        type:"POST",
        headers:{
            'Accept':'application/json',
            'Authorization': 'Bearer '+ token
        },
        data:{'id':id,'new_position':new_position_name},
        success:function(response)
        {
            tr.find('td:eq(1)').text(new_position_name);
            tr.find('td:eq(2)').html(`
                    <button class="btn btn-primary"><i class="fa fa-pencil"></i>
                    </button>
                    <button class="btn btn-danger"><i class="fa fa-trash"></i>
                    </button>`);
            console.log(response)
        },
        error:function(response)
        {
            console.log(response)
        }
    });
})