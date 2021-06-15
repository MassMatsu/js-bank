import { accounts } from './utils/data.js';
import { formatMovementDate, formatCurrency} from './utils/helper.js'

const containerMovements = document.querySelector('.movements');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const btnLogin = document.querySelector('.login__btn');
const labelWelcome = document.querySelector('.welcome');
const containerApp = document.querySelector('.app');

const btnTransfer = document.querySelector('.form__btn--transfer');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');

const btnClose = document.querySelector('.form__btn--close');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const btnLoan = document.querySelector('.form__btn--loan');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');

const btnSort = document.querySelector('.btn--sort');

const labelDate = document.querySelector('.date');

const labelTimer = document.querySelector('.timer');

const btnLogout = document.querySelector('.logout__btn');



// display movements ------------------------------
let sort = false;

function displayMovements(account, sort = false) {
  containerMovements.innerHTML = '';

  const movements = sort
    ? account.movements.slice().sort((a, b) => a.amount - b.amount)
    : account.movements;

  movements.forEach((movement, index) => {
    const type = movement.amount > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(movement.date);
    const dateDisplay = formatMovementDate(date, account.locale);

    const formattedMov = formatCurrency(
      movement.amount,
      account.locale,
      account.currency
    );

    const html = `
     <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      index + 1
    } deposit</div>
        <div class="movements__date">${dateDisplay}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

// display balance -------------------------------------
function displayBalance(account) {
  account.balance = account.movements.reduce((value, movement) => {
    return value + movement.amount;
  }, 0);

  labelBalance.textContent = formatCurrency(
    account.balance,
    account.locale,
    account.currency
  );
}

// display summary ---------------------------------------------
function calcDisplaySummary(account) {
  const incomes = account.movements
    .filter((movement) => movement.amount > 0)
    .reduce((value, deposit) => value + deposit.amount, 0);

  const out = account.movements
    .filter((movement) => movement.amount < 0)
    .reduce((value, withdrawal) => value + withdrawal.amount, 0);

  const interest = account.movements
    .filter((movement) => movement.amount > 0)
    .map((deposit) => (deposit.amount * account.interestRate) / 100)
    .filter((int) => int >= 1) // only interest is greater than 1 is applied
    .reduce((value, int) => value + int, 0);

  labelSumIn.textContent = formatCurrency(
    incomes,
    account.locale,
    account.currency
  );
  labelSumOut.textContent = formatCurrency(
    Math.abs(out),
    account.locale,
    account.currency
  );
  labelSumInterest.textContent = formatCurrency(
    interest,
    account.locale,
    account.currency
  );
}

// update all above -------------------------------------------
function updateUI(account) {
  displayMovements(account, sort);
  displayBalance(account);
  calcDisplaySummary(account);
}

// set logout timer -------------------------------------------
function startLogoutTimer() {
  let time = 180;

  function tick() {
    const min = String(Math.floor(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Login to get started';
    }
    time -= 1;
  }
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
}

// reset timer ----------------------------
function resetTimer() {
  clearInterval(timer);
  timer = startLogoutTimer();
}

// login functionality ------------------------------
let currentAccount, timer;

function authenticateUser(username, pinNum) {
  currentAccount = accounts.find(
    (account) =>
      account.username.toLowerCase() === username.toLowerCase().trim()
  );

  if (currentAccount?.pin === Number(pinNum.trim())) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    // display all account information
    containerApp.style.opacity = 1;

    // clear login input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
}

// create username using initial of account owner ---------
function createUsername(accounts) {
  accounts.forEach((account) => {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map((name) => {
        return name[0];
      })
      .join('');
  });
}

// transfer functionality -------------------------------
function transferMoney(amount, username) {
  inputTransferTo.value = inputTransferAmount.value = '';

  const recieverAcc = accounts.find((acc) => acc.username === username);

  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push({
      amount: -amount,
      date: new Date().toISOString(),
    });
    recieverAcc.movements.push({
      amount: amount,
      date: new Date().toISOString(),
    });

    updateUI(currentAccount);
  }
}

// request loan functionality ------------------
function requestLoan(amount) {
  inputLoanAmount.value = '';
  if (
    amount > 0 &&
    currentAccount.movements.some((movement) => movement.amount >= amount * 0.1)
  ) {
    setTimeout(() => {
      currentAccount.movements.push({
        amount: amount,
        date: new Date().toISOString(),
      });

      updateUI(currentAccount);
    }, 5000);
  }
}

// close account functionality ------------------
function closeAccount(username, pinNum) {
  inputCloseUsername.value = inputClosePin.value = '';

  if (username === currentAccount.username && pinNum === currentAccount.pin) {
    const index = accounts.findIndex(
      (account) => account.username === currentAccount.username
    );

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Login to get started';
    console.log(accounts);
  }
}

/* invoke function and set eventListener ==================================== */

// create username instead of using owner name
createUsername(accounts);

btnLogin.addEventListener('click', (e) => {
  e.preventDefault();
  sort = false;
  authenticateUser(inputLoginUsername.value, inputLoginPin.value);

  const now = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    //weekday: 'long'
  };
  labelDate.textContent = new Intl.DateTimeFormat(
    currentAccount.locale,
    options
  ).format(now);

  btnLogout.style.display = 'block';

  if (timer) clearInterval(timer);
  timer = startLogoutTimer();
});

btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  transferMoney(
    Number(inputTransferAmount.value),
    inputTransferTo.value.toLowerCase()
  );

  resetTimer();
});

btnLoan.addEventListener('click', (e) => {
  e.preventDefault();
  requestLoan(Math.floor(inputLoanAmount.value));

  resetTimer();
});

btnClose.addEventListener('click', (e) => {
  e.preventDefault();
  closeAccount(
    inputCloseUsername.value.toLowerCase(),
    Number(inputClosePin.value)
  );
});

btnSort.addEventListener('click', () => {
  sort = !sort;
  displayMovements(currentAccount, sort);

  resetTimer();
});

btnLogout.addEventListener('click', () => {
  containerApp.style.opacity = 0;
  labelWelcome.textContent = 'Login to get started';
  btnLogout.style.display = 'none';
  resetTimer();
});
