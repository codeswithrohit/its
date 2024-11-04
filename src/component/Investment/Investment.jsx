import React from 'react'

const Investment = () => {
  return (
    <div>
     <div class="profit-calc-section bg-color pt-110 pb-110">
    <div class="linear-big"></div>
    <div class="container">
        <div class="row justify-content-start mb-60">
            <div class="col-xl-6 col-lg-8">
                <div class="section-title style-two text-start">
                    <h2>Investment Returns Calculator</h2>
                    <p>You should understand the calculations before investing in any plan to avoid mistakes. Verify the figures, and you&#039;ll find they align with what our calculator indicates.</p>
                </div>
            </div>
        </div>
        <div class="row align-items-center gy-5">
            <div class="col-lg-6">
                <div class="profit-calc-wrapper">
                    <form class="profit-form">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-inner">
                                    <label for="select_plan">Select Plan</label>
                                    <select id="select_plan">
                                                                                    <option value="1"
                                                    data-name="Starter"
                                                    data-interest="30.00"
                                                    data-interest_return_type="2"
                                                    data-recapture_type="1"
                                                    data-day="Years"
                                                    data-duration="1"
                                            >Starter - Interest 30%</option>
                                                                                    <option value="2"
                                                    data-name="Growth"
                                                    data-interest="3.50"
                                                    data-interest_return_type="2"
                                                    data-recapture_type="1"
                                                    data-day="Weeks"
                                                    data-duration="45"
                                            >Growth - Interest 3.5%</option>
                                                                                    <option value="3"
                                                    data-name="Advanced"
                                                    data-interest="4.50"
                                                    data-interest_return_type="2"
                                                    data-recapture_type="1"
                                                    data-day="Days"
                                                    data-duration="60"
                                            >Advanced - Interest 4.5%</option>
                                                                                    <option value="4"
                                                    data-name="Balanced"
                                                    data-interest="3.00"
                                                    data-interest_return_type="2"
                                                    data-recapture_type="2"
                                                    data-day="Years"
                                                    data-duration="30"
                                            >Balanced - Interest 3%</option>
                                                                                    <option value="5"
                                                    data-name="Flexi"
                                                    data-interest="2.50"
                                                    data-interest_return_type="2"
                                                    data-recapture_type="1"
                                                    data-day="Days"
                                                    data-duration="20"
                                            >Flexi - Interest 2.5%</option>
                                                                                    <option value="6"
                                                    data-name="Premium"
                                                    data-interest="5.00"
                                                    data-interest_return_type="1"
                                                    data-recapture_type="1"
                                                    data-day="Days"
                                                    data-duration=""
                                            >Premium - Interest 5%</option>
                                                                            </select>
                                </div>
                            </div>
                            <div class="col-lg-12">
                                <div class="form-inner">
                                    <label for="invest_amount">Amount</label>
                                    <input type="text" id="invest_amount_item" placeholder="Enter Amount"/>
                                </div>
                            </div>
                            <div class="col-lg-12">
                                <button type="button" id="calculate_profit" class="i-btn banner-btn">Profit Planner <i class="bi bi-arrow-right-short"></i></button>
                            </div>
                        </div>
                    </form>
                    <div class="profit-content">
                        <h5 id="invest-total-return"></h5>
                    </div>
                </div>
            </div>
            <div class="col-lg-5 offset-lg-1">
                <h4 class="text-white profit-subtitle mb-lg-5 mb-4">Profit Calculation</h4>
                <ul class="profit-list">
                    <li>
                        <span>Plan</span>
                        <span id="plan_name">N/A</span>
                    </li>
                    <li>
                        <span>Amount</span>
                        <span id="cal_amount">N/A</span>
                    </li>
                    <li>
                        <span>Payment Interval</span>
                        <span id="payment_interval">N/A</span>
                    </li>
                    <li>
                        <span>Profit</span>
                        <span id="profit">N/A</span>
                    </li>
                    <li>
                        <span>Capital Back</span>
                        <span id="capital_back">N/A</span>
                    </li>
                    <li>
                        <span>Total</span>
                        <span id="total_invest">N/A</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>
    </div>
  )
}

export default Investment
