"use strict";
$(document).ready(function () {
    $('.invest-process').click(function () {
        const name = $(this).data('name');
        const uid = $(this).data('uid');
        $('input[name="uid"]').val(uid);

        const title = "Start Investing with the " + name + " Plan";
        $('#investTitle').text(title);
    });

    $('.terms-policy').click(function () {
        const terms = $(this).data('terms_policy');
        $('#invest_terms').text(terms);
    });
});

"use strict";
$(document).ready(function () {
    $('.enroll-matrix-process').click(function () {
        const uid = $(this).data('uid');
        const name = $(this).data('name');

        $('input[name="uid"]').val(uid);
        const title = " Join " + name + " Matrix Scheme";
        $('#matrixTitle').text(title);
    });
});

"use strict";
$(document).ready(function () {
    $('.language').on('change', function () {
        const languageCode = $(this).val();
        changeLanguage(languageCode);
    });

    function changeLanguage(languageCode) {
        $.ajax({
            url: "https://gainbot.io/language-change/" + languageCode,
            method: 'GET',
            success: function (response) {
                notify('success', response.message);
                location.reload();
            },
            error: function (error) {
                console.error('Error changing language', error);
            }
        });
    }
});

'use strict';
$(document).on('submit', '.subscribe-form', function(e) {
    e.preventDefault();
    const email = $("#email_subscribe").val();
    if (email) {
        $.ajax({
            headers: {
                "X-CSRF-TOKEN": "EhfO6qaw02t0QpZS4aPW84dZ3ub8q4G282EJAVxz",
            },
            url: "https://gainbot.io/subscribes",
            method: "POST",
            data: {
                email: email
            },
            success: function(response) {
                notify('success', response.success);
                $("#email_subscribe").val('');
            },
            error: function(response) {
                const errorMessage = response.responseJSON ? response.responseJSON.error : "An error occurred.";
                notify('error', errorMessage);
            }
        });
    } else {
        notify('error', "Please Input Your Email");
    }
});

"use strict";
$(document).ready(function() {
    var planName = "";
    var interestRate = 0;
    var day = "";
    var duration = 1;
    var recapture_type = 1;
    var interest_return_type = 2

    function updateMinMax() {
        const selectedOption = $('#select_plan option:selected');
        planName = selectedOption.data('name');
        interestRate = selectedOption.data('interest');
        day = selectedOption.data('day');
        duration = selectedOption.data('duration');
        recapture_type = selectedOption.data('recapture_type');
        interest_return_type = selectedOption.data('interest_return_type');
    }

    function updateTotalReturn(amount) {
        var parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount)) {
            $("#invest-total-return").text("");
            return;
        }

        var currency = "$";
        var returnAmount = parsedAmount * interestRate / 100;
        $("#invest-total-return").text("Return "+currency + returnAmount.toFixed(2) + " Every " + day + " for " + duration + " Periods");

        var totalProfit = returnAmount * duration;

        if(recapture_type == 2){
            var total = totalProfit;
            var capitalBack = 0;
        }else{
            var total = totalProfit + parsedAmount;
            var capitalBack = parsedAmount;
        }


        if(interest_return_type == 2){
            var investProfit = currency+totalProfit.toFixed(2);
            var returnType = "";
        }else{
            var investProfit = "LifeTime";
            var returnType = " + " + "LifeTime";
        }

        $("#plan_name").text(planName);
        $("#cal_amount").text(currency+parsedAmount.toFixed(2));
        $("#payment_interval").text(duration + " Periods");
        $("#profit").text(investProfit);
        $("#capital_back").text(currency+capitalBack.toFixed(2));
        $("#total_invest").text(currency+total.toFixed(2) + returnType);
    }

    updateMinMax();

    $('#select_plan').change(function() {
        updateMinMax();
    });

    $('#calculate_profit').click(function() {
        var amount = $('#invest_amount_item').val();
        updateTotalReturn(amount);
    });
});

"use strict";
$(".staking-investment-process").click(function() {
    var minAmount = $(this).data('min');
    var maxAmount = $(this).data('max');
    var interestRate = $(this).data('interest');
    var planId = $(this).data('plan_id');

    $('#min-amount').text(minAmount);
    $('#max-amount').text(maxAmount);
    $('#plan_id').val(planId);


    function updateTotalReturn(amount) {
        var parsedAmount = parseFloat(amount.replace(/[^0-9.-]+/g,""));
        if (isNaN(parsedAmount)) {
            $("#staking-total-return").text("");
            return;
        }
        var returnAmount = parsedAmount * interestRate / 100 + parsedAmount;
        $("#staking-total-return").text("Total Return: $" + returnAmount.toFixed(2) + " after the complete investment period");
    }

    $('#staking-amount').off('keyup').on('keyup', function() {
        var amount = $(this).val();
        updateTotalReturn(amount);
    });
});

'use strict';
document.addEventListener("DOMContentLoaded", function() {
    const cookie = document.querySelector(".cookie");

    if (cookie) {
        const acceptAllBtn = cookie.querySelector(".accept-all");
        acceptAllBtn.addEventListener("click", () => {
            cookie.classList.add("d-none");
            localStorage.setItem('cookie_accepted', 'true');
            notify('success', 'Accept cookies');
        });

        const accepted = localStorage.getItem('cookie_accepted') === 'true';
        if (!accepted) {
            cookie.classList.remove("d-none");
        }
    }
});