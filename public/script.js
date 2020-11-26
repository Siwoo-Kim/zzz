
function createService(path) {
    if (path.toLowerCase() === '/registration')
        return new RegistrationService()
    if (path.toLowerCase() === '/login')
        return new LoginService()
    return new Service();
}

class Service {
    //init cycle work
    service() {}
}

class LoginService extends Service {
    validation() {
        return validation(false)    //bad side-effect
    }
}

class RegistrationService extends Service {
    months = [
        "January", "February", "March", 
        "April", "May", "June", "July", 
        "August", "September", "October", 
        "November", "December"
    ]
    
    service() {
        //birthday selection
        let self = this;
        window.onload = function(){
            self.renderBirthElements()
        }
    }

    renderBirthElements() {
        for (let i = 0; i < this.months.length; i++){
            var monthOption = document.createElement("option");
            var month = document.getElementById("month").appendChild(monthOption);
            month.innerHTML = this.months[i];
        }

        for(let i=1; i<(31 + 1); i++){
            var dayOption = document.createElement("option");
            var day = document.getElementById("day").appendChild(dayOption);
            day.innerHTML = i;
        }

        for(let i=2020; i>(1940 - 1); i--){
            var yearOption = document.createElement("option");
            var year = document.getElementById("year").appendChild(yearOption);
            year.innerHTML = i;
        }
    }

    validation() {
        return validation(true)    //bad side-effect
    }    
}

const service = createService(window.location.pathname)
service.service()

function validation(checkName) {
    let email = document.forms['form']['email'];
    let password2 = document.forms['form']['password2'];
    let email_error = document.getElementById('email_error');
    let pass2_error = document.getElementById('pass2_error');
    
    function markFail(e, errE, msg) {
        e.style.border = "1px solid red";
        errE.style.display = "block";
        errE.innerHTML = msg? msg: "This is required"
        e.focus();
        return false;
    }
    
    if (email.value.length === 0 ) {
        markFail(email, email_error)
        return false;
    }
   
    if (checkName) {
        let fname = document.forms['form']['fname'];
        let lname = document.forms['form']['lname'];
        let fname_error = document.getElementById('fname_error');
        let lname_error = document.getElementById('lname_error');

        if (fname.value.length === 0) {
            markFail(fname, fname_error)
            return false;
        }
        if (lname.value.length === 0){
            markFail(lname, lname_error)
            return false;
        }
    }
        
   if (password2.value.length < 6 || password2.value.length > 12) {
        markFail(password2, pass2_error, "Must answer a password that is 6 to 12 characters")
        return false;
    }
   
    const pwregex = /(?=.*[A-Z])/;
    if (!pwregex.test(password2.value)) {
        markFail(password2, pass2_error, "Must contain at least one uppercase")
        return false;
    } 
}
