var formSub = document.getElementById('div_reg');  //Form.
var buttonSub = document.getElementById('submit_butt');  //Form button.

/////////////////Getting ID-s///////////////////////////////////
var inpEmail = document.getElementById('inp_email');
var divEmail = document.getElementById('div_email');
var inpUsername = document.getElementById('inp_username');
var divUsername = document.getElementById('div_username');
var inpName = document.getElementById('inp_name');
var divName = document.getElementById('div_name');
var inpLastname = document.getElementById('inp_lastname');
var divLastname = document.getElementById('div_lastname');
var inpPassword = document.getElementById('inp_password');
var divPassword = document.getElementById('div_password');
var inpConfPass = document.getElementById('inp_conf_password');
var divConfPass = document.getElementById('div_conf_password');
////////////////////////////////////////////////////////////////

//this function creates error message in a aspan tag!
var insrtSpanOnDiv = function (id,txtcnt,div,color,weight) {
    var span = document.createElement('span');
    span.id = id;
    span.style.color = color;
    span.style.fontWeight = weight;
    span.textContent = txtcnt;
    div.appendChild(span);
} 

//Removing additional span function!
var findSpanAndRemove = function (id,div) {
    var findSpan = document.getElementById(id);
    if (findSpan) {
        div.removeChild(findSpan);
    }
} 
var str = inpEmail.value;

//Email Check function on sumbit with ajax!
function EmailCheck() {
    /////////////////////////////////////////////
    $.ajax({
        type: "POST",
        url: "/Account/CheckEmailAvailability",
        data: { 'userdata': inpEmail.value },
        success: function () {
            var spann = document.createElement('span');
            spann.id = 'spanFem';
            divEmail.appendChild(spann);
            spann.textContent = 'Email is Available!'
            spann.style.color = 'green';
            spann.style.fontWeight = 'bold';
        },
        error: function () {
            var spann = document.createElement('span');
            spann.id = 'spanFem';
            divEmail.appendChild(spann);
            spann.style.color = 'red';
            spann.textContent = 'Email is not Available!';
            spann.style.fontWeight = 'bold';
        },
        dataType: "JSON"
    });
}  

//UserName Check function on sumbit with ajax!
function UserCheck() {
    /////////////////////////////////////////////
    $.ajax({
        type: "POST",
        url: "/Account/CheckUserAvailability",
        data: { 'userdata': inpUsername.value },
        success: function () {
            var spann = document.createElement('span');
            spann.id = 'spanFus'
            divUsername.appendChild(spann);
            spann.textContent = 'Username is Available!'
            spann.style.color = 'green';
            spann.style.fontWeight = 'bold';
        },
        error: function () {
            var spann = document.createElement('span');
            spann.id = 'spanFus'
            divUsername.appendChild(spann);
            spann.style.color = 'red';
            spann.style.fontWeight = 'bold';
            spann.textContent = 'Username is not Available!';
        },
        dataType: "JSON"
    });
}

//Email validation function with rejex!
function ValidateEmail(text, _formm) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (text.value.match(mailformat)) {
        var p = document.createElement('p');
        p.id = 'paragraph1';
        p.style.margin = 'auto';
        divEmail.appendChild(p);
        p.style.color = 'green';
        p.style.fontWeight = 'bold';
        p.textContent = 'You have entered a valid email address!';
    }
    else {
        var p = document.createElement('p');
        p.id = 'paragraph1';
        p.style.margin = 'auto';
        divEmail.appendChild(p);
        p.style.color = 'red';
        p.style.fontWeight = 'bolder';
        p.textContent = 'You have entered an invalid email address!';
    }
}

//on clicking inpUsername's input calling 2 function, 1)Validation 2)EmailCheck in db.
inpUsername.addEventListener('click', function () {
    EmailCheck();
    var spanFind = document.getElementById('spanFem');     //deleting divEmail Span
    if (spanFind) {
        divEmail.removeChild(spanFind);
    }
    var pFound = document.getElementById('paragraph1');    //deleting divEmail Paragraph
    if (pFound) {
        divEmail.removeChild(pFound);
    }

    ValidateEmail(inpEmail, formSub.name);   //function of validation
    
}); 

//on clicking inpName's input calling function of UserCheck in db.
inpName.addEventListener('click', function () {
    UserCheck();
    var spanFind = document.getElementById('spanFus');
    if (spanFind) {
        divUsername.removeChild(spanFind);
    }
});

//Main logic here...
buttonSub.addEventListener('click', function () {
    if (inpName.value == '' || inpLastname == '' || inpPassword == '' || inpUsername == '' || inpConfPass == '') {
        findSpanAndRemove('span1', divName);
        insrtSpanOnDiv('span1', 'fill up correctly!', divName, 'yellow', 'bold');
    }
    else if (inpLastname.value.length > 20 || inpLastname.value.length < 5) {
        insrtSpanOnDiv('span2', 'Check Lastname Please', divLastname, 'yellow', 'bold');
        findSpanAndRemove('span2', divLastname);
    }
    else if (inpPassword.value != inpConfPass.value) {
        insrtSpanOnDiv('span3', 'Check Password Please', divLastname, 'yellow', 'bold');
        findSpanAndRemove('span3', divPassword);
    }
    else if (inpUsername.value.length > 14 || inpUsername.value.length < 4) {
        insrtSpanOnDiv('span4', 'Check Username Please', divLastname, 'yellow', 'bold');
        findSpanAndRemove('span4', divUsername);
    }
    else {
        let user = new Object();
        user.userEmail = inpEmail.value;
        user.userName = inpUsername.value;
        user.name = inpName.value;
        user.lastName = inpLastname.value;
        user.userPassword = inpPassword.value;

        $.ajax({
            type: "POST",
            url: "/Account/Registration",
            data: JSON.stringify(user),
            contentType: "application/json",
            success: function () {
                alert("You successfully registered please do check your email!");
            },
            error: function () {
                alert("smthing wrong with u man!");
            },
            dataType: "JSON",
            //complete: function () {

            //}
        });
    }

});