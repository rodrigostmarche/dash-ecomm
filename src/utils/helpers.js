function getDateThreeDaysAgo() {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date.toISOString().split('T')[0];
}

function countByField(orders, field) {
  const count = {};
  for (const order of orders) {
    const value = order[field] || 'UNKNOWN';
    count[value] = (count[value] || 0) + 1;
  }
  return count;
}

module.exports = {
  getDateThreeDaysAgo,
  countByField,
};