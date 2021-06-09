import { accounts } from './utils/data.js';

const movementsEl = document.querySelector('.movements');

const type = document.querySelector('.movements__type');

const date = document.querySelector('.movements__date');

const value = document.querySelector('.movements__value');

const [account1, account2, account3] = accounts;
const movements = getMovements(account1.movements);

function getMovements(movements) {
  let deposit = [];
  let withdrawal = [];
  let depositTotal = 0;
  let withdrawalTotal = 0;

  movements.forEach((movement) => {
    if (movement > 0) {
      deposit.push(movement);
      depositTotal += movement;
    } else {
      withdrawal.push(movement);
      withdrawalTotal += movement;
    }
  });
  return [
    { deposit, total: depositTotal },
    { withdrawal, total: withdrawalTotal },
  ];
}

console.log(movements);

movementsEl.innerHTML = movements
  .map((movement) => {
    console.log(movement);
    const type = movement.hasOwnProperty('deposit') ? 'deposit' : 'withdrawal'

    return `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      type === 'deposit'
        ? movement.deposit.length
        : movement.withdrawal.length
    } DEPOSIT</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${movement.total}</div>
      </div>
  `;
  })
  .join('');
