import { accounts } from './utils/data.js';

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

const [account1, account2, account3] = accounts;

// movements functionality --------------

function displayMovements(account) {
  containerMovements.innerHTML = '';

  account.movements.forEach((movement, index) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const html = `
     <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      index + 1
    } deposit</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${movement}€</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

function displayBalance(account) {
  account.balance = account.movements.reduce((value, movement) => {
    return value + movement;
  }, 0);
  labelBalance.textContent = `${account.balance}€`;
}

function calcDisplaySummary(account) {
  const incomes = account.movements
    .filter((movement) => movement > 0)
    .reduce((value, deposit) => value + deposit, 0);

  const out = account.movements
    .filter((movement) => movement < 0)
    .reduce((value, withdrawal) => value + withdrawal, 0);

  const interest = account.movements
    .filter((movement) => movement > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((int) => int >= 1) // only interest is greater than 1 is applied
    .reduce((value, int) => value + int, 0);

  labelSumIn.textContent = `${incomes}€`;
  labelSumOut.textContent = `${Math.abs(out)}€`;
  labelSumInterest.textContent = `${interest}€`;
}

function updateUI(account) {
  displayMovements(account);
  displayBalance(account);
  calcDisplaySummary(account);
}

// inputs functionality -----------------

let currentAccount;

function authenticateUser(username, pinNum) {
  currentAccount = accounts.find(
    (account) =>
      account.username.toLowerCase() === username.toLowerCase().trim()
  );

  if (currentAccount?.pin === Number(pinNum.trim())) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;

    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
}

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

// transfer functionality --------------------

function transferMoney(amount, username) {
  inputTransferTo.value = inputTransferAmount.value = '';

  const recieverAcc = accounts.find((acc) => acc.username === username);

  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
}

// request loan functionality ------------------

function requestLoan(amount) {
  inputLoanAmount.value = ''
  if (
    amount > 0 &&
    currentAccount.movements.some((movement) => movement >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount)
    updateUI(currentAccount)
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
    console.log(accounts);
  }
}

// invoke function and set eventListener ----------

// create username instead of using owner name
createUsername(accounts);

btnLogin.addEventListener('click', (e) => {
  e.preventDefault();
  authenticateUser(inputLoginUsername.value, inputLoginPin.value);
});

btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  transferMoney(
    Number(inputTransferAmount.value),
    inputTransferTo.value.toLowerCase()
  );
});

btnLoan.addEventListener('click', (e) => {
  e.preventDefault();
  requestLoan(Number(inputLoanAmount.value));
});

btnClose.addEventListener('click', (e) => {
  e.preventDefault();
  closeAccount(
    inputCloseUsername.value.toLowerCase(),
    Number(inputClosePin.value)
  );
});

const arr = [...[1, 2, 3], ...[5, 6, 8], 9]

console.log(arr)
