
let islogin = document.URL.endsWith("Login");

function fname_verify() {
    if(fname.value.length > 0) {
        fname.style.border = "1px solid silver";
        fname_error.style.display = "none";
        return true;
    }
}

function lname_verify(){
    if(lname.value.length > 0){
        lname.style.border = "1px solid silver";
        lname_error.style.display = "none";
        return true;
    }
}

function validation() {
    let islogin = document.URL.endsWith("Login");

    if (email.value.length === 0 ){
        email.style.border = "1px solid red";
        email_error.style.display = "block";
        email_error.innerHTML = "This is required"
        email.focus();
        return false;
    }


    if (!islogin) {

        if (fname.value.length === 0 ){
            fname.style.border = "1px solid red";
            fname_error.style.display = "block";
            fname_error.innerHTML = "This is required"
            fname.focus();
            return false;
        }
    
        if (lname.value.length === 0 ){
            lname.style.border = "1px solid red";
            lname_error.style.display = "block";
            lname_error.innerHTML = "This is required"
            lname.focus();
            return false;
        }
    }
    
    if ((password2.value.length === 0) || (password2.value.length < 6) || (password2.value.length>12)){
        password2.style.border = "1px solid red";
        pass2_error.style.display = "block";
        pass2_error.innerHTML = "Must answer a password that is 6 to 12 characters";
        password2.focus();
        return false;
    }
    var letter = /(?=.*[A-Z])/;

    if (!letter.test(password2.value)) {
        password2.style.border = "1px solid red";
        pass2_error.style.display = "block";
        pass2_error.innerHTML = "Must contain at least one uppercase";
        password2.focus();
        return false;
    } 
}

function email_verify() {
    if (email.value.length > 0){
        email.style.border = "1px solid silver";
        email_error.style.display = "none";
        return true;
    }
}


function pass2_verify(){
    if((password2.value.length >= 6) || (password2.value.length < 12)){
        password2.style.border = "1px solid silver";
        pass2_error.style.display = "none";
        return true;
    }
}

//birthday selection
if(document.getElementById("month")) {
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    for(let i = 0; i < months.length; i++){
        var monthOption = document.createElement("option");
        var month = document.getElementById("month").appendChild(monthOption);
        month.innerHTML = months[i];
    }

    for(let i = 1; i < 31 + 1; i++){
        var dayOption = document.createElement("option");
        var day = document.getElementById("day").appendChild(dayOption);
        day.innerHTML = i;
    }

    for(let i = 2020; i > 1940 - 1; i--){
        var yearOption = document.createElement("option");
        var year = document.getElementById("year").appendChild(yearOption);
        year.innerHTML = i;
    }       
}    
//login part

window.onload = function(){
    if(document.forms['form']) {
        console.log('wyh')
        let email = document.forms['form']['email'];
        let password2 = document.forms['form']['password2'];
    
        password2.addEventListener('textInput', pass2_verify);
        email.addEventListener('textInput', email_verify);
        // let email_error = document.getElementById('email_error');  
        // let password2_error = document.getElementById('pass2_error');
    
    
        if (!islogin) {
    
            let fname = document.forms['form']['fname'];
            let lname = document.forms['form']['lname'];
            
            fname.addEventListener('textInput', fname_verify);
            lname.addEventListener('textInput', lname_verify);  
            
            // let fname_error = document.getElementById('fname_error');
            // let lname_error = document.getElementById('lname_error');
        }
    }
}