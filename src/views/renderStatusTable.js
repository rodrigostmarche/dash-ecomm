function renderStatusTable(type, value, orders) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Pedidos - ${type}: ${value}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 2em; background: #f8f8f8; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 0.5em; text-align: left; }
        th { background-color: #eee; }
        .highlight { background-color: #fdd; font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>Pedidos com ${type} = ${value}</h1>
      <table>
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Financeiro</th>
            <th>Fulfillment</th>
            <th>Status Metafield</th>
            <th>Status Faturamento</th>
          </tr>
        </thead>
        <tbody>
          ${orders.map(o => {
            const isRed = ['EXPIRING', 'EXPIRED'].includes(o.displayFinancialStatus) && o.displayFulfillmentStatus === 'FULFILLED';
            return `
              <tr class="${isRed ? 'highlight' : ''}">
                <td>${o.name}</td>
                <td>${o.displayFinancialStatus}</td>
                <td>${o.displayFulfillmentStatus}</td>
                <td>${o.orderStatus}</td>
                <td>${o.invoiceStatus}</td>
              </tr>`;
          }).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;
}

module.exports = renderStatusTable;
