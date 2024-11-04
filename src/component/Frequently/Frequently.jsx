import React from 'react'
import { MDBAccordion, MDBAccordionItem, MDBContainer } from "mdb-react-ui-kit";
import Navbar from '../navbar/Navbar';
import Header from '../Header/Header';
const Frequently = () => {
  return (
    <>
   




   <section class="bg-white dark:bg-gray-900">
  <div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
      <h2 class="mb-8 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Frequently asked questions</h2>
      <div class="grid pt-8 text-left border-t border-gray-200 md:gap-16 dark:border-gray-700 md:grid-cols-2">
          <div>
              <div class="mb-10">
                  <h3 class="flex items-center mb-4 text-lg font-medium text-gray-900 dark:text-white">
                      <svg class="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>
                      How it works?
                  </h3>
                  <p class="text-gray-500 dark:text-gray-400">The bot, according to the specified parameters and based on AI, automatically opens transactions on the futures market in the BTC/USDT pair, sets entry points and exit points. The bot uses the trading balance of all users in small parts. This minimizes risks and allows you to always be in profit both on the long and at a short distance
                  .</p>
              </div>
              <div class="mb-10">                        
                  <h3 class="flex items-center mb-4 text-lg font-medium text-gray-900 dark:text-white">
                      <svg class="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>
                      Mathematics of earnings

                  </h3>
                  <p class="text-gray-500 dark:text-gray-400">The bot brings an average of 0.5 - 0.66% per day  from the deposit.
However do not forget about our commission.

For example:
Your deposit 1000 USDT
When replenishing, our commission will be 15%, which means that your balance will be credited 850  USDT
1 day  - 856USDT
2 day  - 863USDT
3 day  - 870USDT
4 day  - 877USDT
5 day  - 884USDT
6 day  - 891USDT
7 day  - 898USDT
8 day  - 905USDT
9 day  - 912USDT
10 day - 919USDT
11 day - 926 USDT
12 day - 933USDT


933 USDT will be available for withdrawal. The commission is 5%, 887 USDT will be credited to your balance, taking into account all commissions.
</p>
              </div>
              <div class="mb-10">
                  <h3 class="flex items-center mb-4 text-lg font-medium text-gray-900 dark:text-white">
                      <svg class="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>
                      How to make a deposit?
                  </h3>
                  <p class="text-gray-500 dark:text-gray-400">To top up the trading balance, go to the menu section "My account" - "Top up the balance" - copy the wallet number *USDT BEP20* (click on it) and transfer USDT to it. After you've made the transfer, click on the "Check payment" button, the transfer is realized automatically. The commission for replenishment is 15%.

❗️Attention ! Replenishment is realized only to the USDT BEP20 wallet! 
The minimum deposit amount is 25 USDT!
</p>
              </div>
              <div class="mb-10">
                  <h3 class="flex items-center mb-4 text-lg font-medium text-gray-900 dark:text-white">
                      <svg class="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>
                      How to withdraw money?
                  </h3>
                  <p class="text-gray-500 dark:text-gray-400">o withdraw money, go to the menu section "My account" - "Withdrawal of funds" - "Withdrawal request" enter the required available amount and the USDT BEP20 wallet. 
The withdrawal process is automatic and takes from 24 minutes to 24-72 hours. The maximum withdrawal time is up to daily .
During the consideration, trading for your account will be stopped.


❗️Attention ! Replenishment is realized only to the USDT BEP20 wallet! 
The minimum amount is 5 USDT!
</p>
              </div>
          </div>
          <div>
              <div class="mb-10">
                  <h3 class="flex items-center mb-4 text-lg font-medium text-gray-900 dark:text-white">
                      <svg class="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>
                      What is the commission?
                  </h3>
                  <p class="text-gray-500 dark:text-gray-400">We do not charge a commission for each completed transaction in the bot, but we charge 15% of the deposit amount and 6% of the withdrawal amount

Functionality description

"Trade" - here you can see the results of the bot's trading for different periods of time.
You can also pause or resume the trading bot;
"Stop trading/Start trading"- start and stop the trading bot;
"Trading Bot statistics" - bot trading statistics for the period: 24 hours, 3 days, 7 days, 1 month, 3 months.
"Trading Bot Channel" - up-to-date information on bot trading.

"My account" - up-to-date information on the balance and account. Deposit/withdrawal of funds, referral system;
"Top up your balance" - the ability to replenish the USDT BEP20 wallet to get started (10% commission);
"Withdrawal of funds" - the ability to withdraw USDT BEP20 to your wallet (6% commission);
"Balance history" - deposits and withdrawals on your trading account;
"Referral system" - a reward of 5% from each deposit of the listed users.

"FAQ" - answers to frequently asked questions.

"Channel"- up-to-date information on bot trading and crypto market news.

"Chat" - here you can communicate with other users of our service.

"Support" - online help for any questions (average response time is 2 hours, only in English).

To change the language or restart the bot, press /start

Bot Trading Exchange

The bot trades on the most reliable such as Binance exchanges
</p>
              </div>
              <div class="mb-10">
                  <h3 class="flex items-center mb-4 text-lg font-medium text-gray-900 dark:text-white">
                      <svg class="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>
                      Term of bot's work?
                  </h3>
                  <p class="text-gray-500 dark:text-gray-400">The bot has been working for 16 months. During this time it has been upgraded many times, and its algorithms are being refined by our specialists and AI every day, which allows it to be actual for such a long time

Token treasure

To ensure security and the impossibility of stealing tokens, the total balance of tokens is divided into several wallets inside our system and the bot is integrated into each of these wallets

Possible risks

All risks are minimized: a large number of transactions, separate wallets, lack of trading leverage, proper risk management makes our bot practically invulnerable

Loss of tokens

Despite the fact that there are negative transactions, the loss cannot happen, since the bot enters into each transaction not for your entire deposit, but only for a part of it, also in each transaction the bot sets a stop loss of no more than 2%

Referral system

In order to earn 5% of all deposits of invited users, you need them to click on your link: to do this, go to the menu section "My account" - "Referral system" there will be your link for invitations (to copy the link just to it) in the same section you will see the number of invited users and the amount of earnings from them
 
a reward of 5% from each deposit of the listed users for level 1 and level 2. After first deposit of user when he deposited second time the user get 5% of deposit himself and 5% for the direct upline

Output duration

Only a small part of each user's deposit is involved in each transaction to diversify risks, so after a request to withdraw tokens, the bot needs time to withdraw all your tokens from circulation. Therefore, the duration of withdrawal funds is up to 7 days

Available transactions

The bot works on the futures market, without trading leverage. At the moment, only in the USDT/BTC pair

Minimum deposit

The minimum deposit amount is 25 USDT, </p>

              </div>
              <div class="mb-10">
                  <h3 class="flex items-center mb-4 text-lg font-medium text-gray-900 dark:text-white">
                      <svg class="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>
                      Any restrictions?
                  </h3>
                  <p class="text-gray-500 dark:text-gray-400">
                  At the moment there is no such restriction on the deposit amount. Theoretically it may occur if the amount of funds exceeds the possible implementation of the bot, in which case the income of each partner will decrease significantly or it will be necessary to set the maximum capital of our pool

Bot stop loss points

The bot sets a stop loss at a value of no more than 2%, which makes trading as safe as possible

Building a trust

Every day in the channel we publish the results of trading with our bot, there is also an open chat with real users of our service.
To check the performance of our bot, we recommend starting with a 50 USDT deposit, getting the first profit within a week, making a withdrawal of funds and then making conclusions

Account replenishment

Funds are credited to the account instantly, immediately after replenishing the wallet, click "Check payment" and in case of successful payment, your funds will instantly be displayed in your personal account.
                  </p>
              </div>
             
          </div>
      </div>
  </div>
</section>
</>
  )
}

export default Frequently
