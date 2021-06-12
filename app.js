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


const [account1, account2, account3] = accounts;

// movements functionality --------------

function displayMovements(movements) {
  containerMovements.innerHTML = '';

  movements.forEach((movement, index) => {
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

function displayBalance(movements) {
  const balance = movements.reduce((value, movement) => {
    return value + movement;
  }, 0);
  labelBalance.textContent = `${balance}€`;
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

// inputs functionality -----------------

let currentAccount;

function authenticateUser(username, pinNum) {
  console.log(accounts);
  currentAccount = accounts.find(
    (account) =>
      account.username.toLowerCase() === username.toLowerCase().trim()
  );

  if (currentAccount?.pin === Number(pinNum.trim())) {
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 1

    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = ''
    inputLoginPin.blur()
    
    displayMovements(currentAccount.movements);
    displayBalance(currentAccount.movements);
    calcDisplaySummary(currentAccount);

  } else {
    console.log(`username or pin is invalid`);
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

createUsername(accounts);


btnLogin.addEventListener('click', (e) => {
  e.preventDefault();
  authenticateUser(inputLoginUsername.value, inputLoginPin.value);
});
