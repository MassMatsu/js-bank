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

const btnSort = document.querySelector('.btn--sort');

const labelDate = document.querySelector('.date')


const [account1, account2, account3] = accounts;
let sort = false;

// movements functionality --------------

function displayMovements(account, sort = false) {
  containerMovements.innerHTML = '';

  const movements = sort ? account.movements.slice().sort((a, b) => a - b) : account.movements

  movements.forEach((movement, index) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(account.movementsDates[index])

    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
 
    const dateDisplay = `${day}/${month}/${year}`;
    console.log(dateDisplay)

    const html = `
     <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      index + 1
    } deposit</div>
        <div class="movements__date">${dateDisplay}</div>
        <div class="movements__value">${movement.toFixed(2)}€</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

function displayBalance(account) {
  account.balance = account.movements.reduce((value, movement) => {
    return value + movement;
  }, 0);
  labelBalance.textContent = `${account.balance.toFixed(2)}€`;
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

  labelSumIn.textContent = `${incomes.toFixed(2)}€`;
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
}

function updateUI(account) {
  displayMovements(account, sort);
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

    // add date
    currentAccount.movementsDates.push(new Date().toISOString());
    recieverAcc.movementsDates.push(new Date().toISOString());
    
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

    // add date
    currentAccount.movementsDates.push(new Date().toISOString());

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

// sort functionality ------------------------

btnSort.addEventListener('click', () => {
  console.log('sort')
})

// invoke function and set eventListener ----------

currentAccount = account1
updateUI(currentAccount)
containerApp.style.opacity = 1


// create username instead of using owner name
createUsername(accounts);

btnLogin.addEventListener('click', (e) => {
  e.preventDefault();
  sort = false
  authenticateUser(inputLoginUsername.value, inputLoginPin.value);

  const now = new Date();
  const date = `${now.getDate()}`.padStart(2, 0);
  const month = `${now.getMonth() + 1}`.padStart(2, 0);
  const year = now.getFullYear();
  const hour = `${now.getHours()}`.padStart(2, 0);
  const min = `${now.getMinutes()}`.padStart(2, 0);

  labelDate.textContent = `${date}/${month}/${year}, ${hour}:${min}`;
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
  requestLoan(Math.floor(inputLoanAmount.value));
});

btnClose.addEventListener('click', (e) => {
  e.preventDefault();
  closeAccount(
    inputCloseUsername.value.toLowerCase(),
    Number(inputClosePin.value)
  );
});

btnSort.addEventListener('click', () => {
  sort = !sort
  displayMovements(currentAccount, sort)
})

