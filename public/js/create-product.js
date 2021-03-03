$(document).ready(function(){
  $('#discount_checkbox').change(function(){
    if(this.checked){
      $('#discount_checkbox').val('1');
      $('#discount_field').addClass('active');
    }
    else{
      $('#discount_checkbox').val('0');
      $('#discounted_price').val(0);
      $('#discount_field').removeClass('active');
    }
  });

  $('#in_stock_checkbox').change(function(){
    if(this.checked){
      $('#in_stock_checkbox').val('1');
    }
    else{
      $('#in_stock_checkbox').val('0');
    }
  });

  // var images = document.querySelector('#images_input input[type=file]');
  // images.onchange = () => {
  //   $('#images-div').html('');
  //   if(images.files.length > 0){
  //     var filename = document.querySelector('#images_input .file-name');
  //     var st = "";
  //     var fileslen = images.files.length;
  //     for (i = 0; i < fileslen; i++) {
  //       st += images.files[i].name + ", ";
  //       var reader = new FileReader();
  //       reader.onload = function(event){
  //         $($.parseHTML('<img>')).attr('src', event.target.result).appendTo($('#images-div'));
  //       }
  //       reader.readAsDataURL(images.files[i]);
  //     }
  //     st = st.slice(0, -2);
  //     filename.textContent = st;
  //   }
  //   else{
  //     $('#images_input .file-name').text('No File Uploaded');
  //     $('#images-div').html('<p>No files selected</p>');
  //   }
  // }
});
