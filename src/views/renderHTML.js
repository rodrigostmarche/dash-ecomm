function renderHTML(title, totalOrders, financialCounts, fulfillmentCounts, statusCounts, invoiceStatus, fulfilledNotPaidOrders, selectedRange) {
  const createLinks = (counts, type, range) =>
    Object.entries(counts)
      .map(([key, value]) => `<li><a href="/status/${type}/${encodeURIComponent(key)}?range=${range}"><strong>${key}:</strong> ${value}</a></li>`) 
      .join('');

  const formatOrderList = (orders) =>
    orders
      .map(o => `<li><strong>${o.name}</strong> - Financeiro: ${o.displayFinancialStatus}, Fulfillment: ${o.displayFulfillmentStatus}</li>`) 
      .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 2em; background: #f8f8f8; }
        h1, h2 { color: #333; }
        ul { list-style: none; padding: 0; }
        li { margin: 0.5em 0; }
        .grid { display: flex; flex-wrap: wrap; gap: 2em; }
        .card { background: #fff; padding: 1em 2em; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
        .card ul { max-height: 200px; overflow-y: auto; }
        form { margin-bottom: 2em; }
        select { padding: 0.5em; }
        a { text-decoration: none; color: #0066cc; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <form method="get">
        <label for="range">Filtrar por data:</label>
        <select name="range" id="range" onchange="this.form.submit()">
          <option value="today" ${selectedRange === 'today' ? 'selected' : ''}>Hoje</option>
          <option value="last3days" ${selectedRange === 'last3days' ? 'selected' : ''}>Últimos 3 dias</option>
          <option value="last7days" ${selectedRange === 'last7days' ? 'selected' : ''}>Últimos 7 dias</option>
          <option value="thisMonth" ${selectedRange === 'thisMonth' ? 'selected' : ''}>Este mês</option>
          <option value="lastMonth" ${selectedRange === 'lastMonth' ? 'selected' : ''}>Mês passado</option>
        </select>
      </form>
      <p><strong>Total de pedidos:</strong> ${totalOrders}</p>
      <div class="grid">
        <div class="card">
          <h2>displayFinancialStatus</h2>
          <ul>${createLinks(financialCounts, 'displayFinancialStatus', selectedRange)}</ul>
        </div>
        <div class="card">
          <h2>displayFulfillmentStatus</h2>
          <ul>${createLinks(fulfillmentCounts, 'displayFulfillmentStatus', selectedRange)}</ul>
        </div>
        <div class="card">
          <h2>Metafield \"order.status\"</h2>
          <ul>${createLinks(statusCounts, 'orderStatus', selectedRange)}</ul>
        </div>
        <div class="card">
          <h2>Metafield \"invoice.status\"</h2>
          <ul>${createLinks(invoiceStatus, 'invoiceStatus', selectedRange)}</ul>
        </div>
        <div class="card">
          <h2>Pedidos FULFILLED e não PAID</h2>
          <ul>${formatOrderList(fulfilledNotPaidOrders)}</ul>
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = renderHTML;