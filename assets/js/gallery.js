var images = [];
        function image_select(){
            var image = document.getElementById('image').files;
            // console.log(image);
            for(var i = 0; i < image.length; i++){
                if(check_duplicate(image[i].name)){
                    images.push({
                        "name": image[i].name,
                        "url": URL.createObjectURL(image[i]),
                        "file": image[i]
                    })
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: image[i].name +' artiq elave olunub',
                        text: 'Something went wrong!',
                        footer: '<a href="">Yenisini sinayin</a>'
                    })
                    // alert(image[i].name + " artiq elave olunub")
                }
            }
            document.getElementById('form').reset();
            document.getElementById('container').innerHTML = image_show();
        }

        function image_show(){
            var image = "";
            images.forEach((i) => {
                console.log(i);

                image += `
                <div class="image_container col-lg-4 col-md-6 col-sm-12 d-flex justify-content-between">
                    <img src="`+ i.url +`" alt="Image">
                    <span class="position-absolute" onclick="delete_image(`+ images.indexOf(i) +`)">
                        &times;
                    </span>
                </div>`
            })

            return image;
        }

        function delete_image(e){
            images.splice(e, 1);
            document.getElementById('container').innerHTML = image_show();
        }

        function check_duplicate(name){
            var image = true;

            if(images.length > 0){
                for(var e = 0; e < images.length; e++){
                    if(images[e].name == name){
                        image = false;
                        break;
                    }
                }
            }

            return image;
        }