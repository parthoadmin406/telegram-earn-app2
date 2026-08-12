const users = new Map();
const ads = [];
const withdrawals = [];

const settings = {
  withdrawalEnabled: false,
  minimumWithdrawal: 0,
  pointsPerTaka: 3.2,
  completionTime: 7
};

module.exports = {
  users,
  ads,
  withdrawals,
  settings
};
