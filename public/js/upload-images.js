var product_id = $('#product_id').val();


function deleteImage(t){
  var p = t.parent();
  // $.ajax({
  //   type: "POST",
  //   url: '/admin/products/deleteImage',
  //   data: {
  //     id: product_id,
  //     name: p,
  //   },
  //   success: function(data){
  //     console.log(data);
  //   }
  // });
  $.post('/admin/products/deleteImage',
  { id: product_id, name: p.attr('data-name') },
  function(data, status){
    if(data == 'done'){
      console.log('hi');
      p.remove();
    }
  });
}

$(document).ready(function(){
  var images = document.querySelector('#images_input input[type=file]');
  images.onchange = () => {
    $('#images-div').html('');
    if(images.files.length > 0){
      var filename = document.querySelector('#images_input .file-name');
      var st = "";
      var fileslen = images.files.length;
      for (i = 0; i < fileslen; i++) {
        st += images.files[i].name + ", ";
        var reader = new FileReader();
        reader.onload = function(event){
          $($.parseHTML('<img>')).attr('src', event.target.result).appendTo($('#images-div'));
        }
        reader.readAsDataURL(images.files[i]);
      }
      st = st.slice(0, -2);
      filename.textContent = st;
    }
    else{
      $('#images_input .file-name').text('No File Uploaded');
      $('#images-div').html('<p>No files selected</p>');
    }
  }
  $('.delete').click(function(){
    deleteImage($(this));
  });
});
