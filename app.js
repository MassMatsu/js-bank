import { accounts } from './utils/data.js';

const containerMovements = document.querySelector('.movements');
const labelBalance = document.querySelector('.balance__value')
const labelSumIn = document.querySelector('.summary__value--in')
const labelSumOut = document.querySelector('.summary__value--out')
const labelSumInterest = document.querySelector('.summary__value--interest')

const type = document.querySelector('.movements__type');

const date = document.querySelector('.movements__date');

const value = document.querySelector('.movements__value');

const [account1, account2, account3] = accounts;

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
    return value + movement
  }, 0)
  labelBalance.textContent = `${balance}€`
}

function calcDisplaySummary(movements, interestRate) {
  const incomes = movements
  .filter((movement) => movement > 0)
  .reduce((value, deposit) => value + deposit, 0)

  const out = movements
  .filter((movement) => movement < 0)
  .reduce((value, withdrawal) => value + withdrawal, 0)

  const interest = movements
  .filter((movement) => movement > 0)
  .map((deposit) => deposit * interestRate / 100)
  .filter((int) => int >= 1) // only interest is greater than 1 is applied
  .reduce((value, int) => value + int, 0)
  
  labelSumIn.textContent = `${incomes}€`
  labelSumOut.textContent = `${Math.abs(out)}€`
  labelSumInterest.textContent = `${interest}€`
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
  })
}



displayMovements(account1.movements);
displayBalance(account1.movements)
calcDisplaySummary(account1.movements, account1.interestRate)

createUsername(accounts);