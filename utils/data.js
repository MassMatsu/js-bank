// Data

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [
    { amount: 200, date: '2019-11-18T21:31:17.178Z' },
    { amount: 455.23, date: '2019-12-23T07:42:02.383Z' },
    { amount: -306.5, date: '2020-01-28T09:15:04.904Z' },
    { amount: 25000, date: '2020-04-01T10:17:24.185Z' },
    { amount: -642.21, date: '2020-05-08T14:11:59.604Z' },
    { amount: -133.9, date: '2020-07-26T17:01:17.194Z' },
    { amount: 79.97, date: '2021-06-10T23:36:17.929Z' },
    { amount: 1300, date: '2021-06-13T10:51:36.790Z' },
  ],
  interestRate: 1.2, // %
  pin: 1111,

  // movementsDates: [
  //   '2019-11-18T21:31:17.178Z',
  //   '2019-12-23T07:42:02.383Z',
  //   '2020-01-28T09:15:04.904Z',
  //   '2020-04-01T10:17:24.185Z',
  //   '2020-05-08T14:11:59.604Z',
  //   '2020-07-26T17:01:17.194Z',
  //   '2021-06-10T23:36:17.929Z',
  //   '2021-06-13T10:51:36.790Z',
  // ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [
    { amount: 5000, date: '2019-11-01T13:15:33.035Z' },
    { amount: 3400, date: '2019-11-30T09:48:16.867Z' },
    { amount: -150, date: '2019-12-25T06:04:23.907Z' },
    { amount: -790, date: '2020-04-01T10:17:24.185Z' },
    { amount: -3210, date: '2020-02-05T16:33:06.386Z' },
    { amount: -1000, date: '2020-04-10T14:43:26.374Z' },
    { amount: 8500, date: '2021-06-12T18:49:59.371Z' },
    { amount: -30, date: '2021-06-14T12:01:20.894Z' },
  ],

  interestRate: 1.5,
  pin: 2222,

  // movementsDates: [
  //   '2019-11-01T13:15:33.035Z',
  //   '2019-11-30T09:48:16.867Z',
  //   '2019-12-25T06:04:23.907Z',
  //   '2020-01-25T14:18:46.235Z',
  //   '2020-02-05T16:33:06.386Z',
  //   '2020-04-10T14:43:26.374Z',
  //   '2020-06-25T18:49:59.371Z',
  //   '2021-06-14T12:01:20.894Z',
  // ],
  currency: 'USD',
  locale: 'en-US',
};

export const accounts = [account1, account2];

// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// export const accounts = [account1, account2, account3];
