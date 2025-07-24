function countByField(array, field) {
  return array.reduce((acc, pedido) => {
    const key = (pedido[field] || 'INDEFINIDO').toString().trim().toUpperCase();
    acc[key] = (acc[key] || 0) + 1;

    return acc;
  }, {});
}

function getDateFromRangeOption(option) {
  const now = new Date();
  let start;

  switch (option) {
    case 'today':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'last3days':
      start = new Date(now);
      start.setDate(now.getDate() - 3);
      break;
    case 'last7days':
      start = new Date(now);
      start.setDate(now.getDate() - 7);
      break;
    case 'thisMonth':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'lastMonth':
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      break;
    default:
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  return start.toISOString().slice(0, 10);
}

module.exports = { countByField, getDateFromRangeOption };
