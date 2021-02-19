var deleteid = "";

$(document).ready(()=>{
  $('.deletebutton').click(function(){
    deleteid = $(this).closest('.parenttosearch').attr('data-id');
    $('#deleteid').val(deleteid);
    $('#deletemodal').addClass('is-active');
  });
  $('.close_modal').click(function(){
    $(this).closest('.modal').removeClass('is-active');
  });
});
