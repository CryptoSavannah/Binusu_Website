$(document).ready(function () {

    function triggerClick(elem) {
        $(elem).click();
    }

    var $progressWizard = $('.stepper'),
        $tab_active,
        $tab_prev,
        $tab_next,
        $btn_prev = $progressWizard.find('.prev-step'),
        $pg1 = $progressWizard.find('#pg1'),
        $pg2 = $progressWizard.find('#pg2'),
        $pg3 = $progressWizard.find('#pg3'),
        $tab_toggle = $progressWizard.find('[data-toggle="tab"]'),
        $tooltips = $progressWizard.find('[data-toggle="tab"][title]');
    // To do:
    // Disable User select drop-down after first step.
    // Add support for payment type switching.
    //Initialize tooltips
    $tooltips.tooltip();
    //Wizard
    $tab_toggle.on('show.bs.tab', function (e) {
        var $target = $(e.target);
        if (!$target.parent().hasClass('active, disabled')) {
            $target.parent().prev().addClass('completed');
        }
        if ($target.parent().hasClass('disabled')) {
            return false;
        }
    });

    $pg1.on('click', function () {

        if (!(document.getElementById("fname").value) || !(document.getElementById("lname").value) || !(document.getElementById("nin").value)) {
            document.getElementById("error1").style.display = 'block';
            document.getElementById("err").innerHTML = "Fill in all the fields";
        } else {
            $tab_active = $progressWizard.find('.active');
            $tab_active.next().removeClass('disabled');
            $tab_next = $tab_active.next().find('a[data-toggle="tab"]');
            triggerClick($tab_next);
            document.getElementById("err").innerHTML = "";
            document.getElementById("error1").style.display = 'none';
        }
    });

    $pg2.on('click', function () {

        if (!(document.getElementById("email").value) || !(document.getElementById("tel").value)) {
            document.getElementById("error2").style.display = 'block';
            document.getElementById("err1").innerHTML = "Fill in all the fields";
        } else {
            document.getElementById("err1").innerHTML = "";
            document.getElementById("error2").style.display = 'none';
            if (!emailIsValid(document.getElementById("email").value)) {
                document.getElementById("error3").style.display = 'block';
                document.getElementById("err2").innerHTML = "Enter a valid email address e.g. someone@mail.com";
            } else if (document.getElementById("tel").value.length != 10 || document.getElementById("tel").value[0] != 0 || document.getElementById("tel").value[1] != 7) {
                document.getElementById("err2").innerHTML = "";
                document.getElementById("error3").style.display = 'none';
                document.getElementById("error4").style.display = 'block';
                document.getElementById("err3").innerHTML = "Enter a valid phone number in the format 07XXXXXXXX";
            } else {
                $tab_active = $progressWizard.find('.active');
                $tab_active.next().removeClass('disabled');
                $tab_next = $tab_active.next().find('a[data-toggle="tab"]');
                triggerClick($tab_next);
                document.getElementById("err3").innerHTML = "";
                document.getElementById("error4").style.display = 'none';
            }

        }
    });
    $pg3.on('click', function () {

        if (!(document.getElementById("password").value) || !(document.getElementById("confirm_password").value)) {
            document.getElementById("error5").style.display = 'block';
            document.getElementById("err5").innerHTML = "Fill in all the fields";
        } else {
            document.getElementById("err5").innerHTML = "";
            document.getElementById("error5").style.display = 'none';
            if (document.getElementById("password").value !== document.getElementById("confirm_password").value) {
                document.getElementById("error6").style.display = 'block';
                document.getElementById("err6").innerHTML = "The two passwords do not match";
            } else {
                document.getElementById("pg3").style.display = "none";
                document.getElementById("loader").style.display = "block";
                document.getElementById("err6").innerHTML = "";
                document.getElementById("error6").style.display = 'none';
                register();
            }

        }
    });
    $btn_prev.click(function () {
        $tab_active = $progressWizard.find('.active');
        $tab_prev = $tab_active.prev().find('a[data-toggle="tab"]');
        triggerClick($tab_prev);
    });
});


function register() {
    let fname = document.getElementById("fname").value;
    let lname = document.getElementById("lname").value;
    let email = document.getElementById("email").value;
    let tel = document.getElementById("tel").value;
    let password = document.getElementById("password").value;
    let nin = document.getElementById("nin").value;

    let formdata = {
        "first_name": fname,
        "last_name": lname,
        "email_address": email,
        "phone_number": tel,
        "password": password,
        "nin_number": nin
    }

    fetch(`${APIs()}/api/v1/binusu/kyc`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formdata)
    }).then(res => res.json())
        .then(data => {
            document.getElementById("loader").style.display = "none";

            if (data.status == 201) {
                localStorage.setItem("username", data.data.first_name);
                localStorage.setItem("email", data.data.email_address);
                window.location.replace("reg-confimation.html")
            } else if (data.status == 400) {
                document.getElementById("error6").style.display = 'block';

                if (data.error == "User already exists proceed to login") {
                    document.getElementById("err6").innerHTML = "An account locked to " + email + " already exists. Login to proceed.";
                    document.getElementById("pg3").style.display = "none";
                    document.getElementById("signin").style.display = "block";
                    document.getElementById("signup").style.display = "block";

                } else {

                    document.getElementById("err6").innerHTML = data.error;
                    document.getElementById("pg3").style.display = "block";
                }

            } else {
                document.getElementById("error6").style.display = 'block';
                document.getElementById("err6").innerHTML = data.error;
                document.getElementById("pg3").style.display = "block";
            }

        }).catch(
            e => {
                console.log(e)
                window.location.replace('404-error.html');

            }
        )
}