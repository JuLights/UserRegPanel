var formSub = document.getElementById('div_log');
var buttonSub = document.getElementById('submit_butt');
var inpEmail = document.getElementById('inp_email');
var divEmail = document.getElementById('div_email');
var inpPassword = document.getElementById('inp_password');
var divPassword = document.getElementById('div_password');

buttonSub.addEventListener('click', function () {
    $.ajax({
        type: "POST",
        url: "/Account/Login",
        data: { 'Email': inpEmail.value, 'Password': inpPassword.value },
        contentType: "application/json",
        dataType: "JSON",
        success: function () {
            alert("Logging In...");
        },
        error: function () {
            alert("smthing wrong with u man!");
        }
    });
})