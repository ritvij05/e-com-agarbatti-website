var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
$(document).ready(()=>{
  $('form').submit(function(){
    var correct = 1;
    var msg = "";
    $('#error').html('');
    $(this).find('input').each(function(){
      var type = $(this).attr('type');
      var v = $(this).val();
      if(type == 'email'){
        // email validation
        if(!re.test(String(v).toLowerCase())){
          correct = 0;
          msg += "Email-ID not valid. <br>";
        }
      }
      else if(type == 'text'){
        // not empty
        if(v == ""){
          correct = 0;
          msg += "Please fill in all the fields first. <br>";
        }
      }
      else if(type == 'number'){
        // number fields - contact
        if($(this).attr('name') == 'contact'){
          if(v.length != 10 || isNaN(v)){
            correct = 0;
            msg += "Contact Number Invalid. <br>";
          }
        }
      }
      else if(type == 'password'){
        if($(this).attr('name') == 'confirm_password'){
          var p = $('#password').val();
          if(v != p){
            correct = 0;
            msg += "Password fields do not match. <br>";
          }
        }
      }
    });
    if(correct == 0){
      event.preventDefault();
      $(this).find('#error').html(msg);
    }
  });
});
