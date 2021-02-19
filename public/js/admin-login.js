$(document).ready(()=>{
  $('#forgot').click(()=>{
    var e = $('#email').val();
    if(e != ""){
      $('#email_forgot').val(e);
    }
    $('#forgot_modal').addClass('is-active');
  });
  $('.close_modal, .modal-background').click(function(){
    $(this).closest('.modal').removeClass('is-active');
    $('#email_forgot').val('');
  });
  $('#navburger').click(function(){
    $(this).toggleClass('is-active');
    $('#navmenu').toggleClass('is-active');
  });
});
