function renderOrderDetails(order) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Detalhes do Pedido ${order.name}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 2em; background: #f8f8f8; }
        h1, h2 { color: #333; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 2em; }
        th, td { border: 1px solid #ccc; padding: 0.5em; text-align: left; }
        th { background-color: #eee; }
        pre { background: #eee; padding: 1em; overflow-x: auto; }
      </style>
    </head>
    <body>
      <h1>Pedido ${order.name}</h1>
      <table>
        <tr><th>displayFinancialStatus</th><td>${order.displayFinancialStatus}</td></tr>
        <tr><th>displayFulfillmentStatus</th><td>${order.displayFulfillmentStatus}</td></tr>
        <tr><th>Status Metafield</th><td>${order.statusMetafield}</td></tr>
        <tr><th>ID</th><td>${order.id}</td></tr>
        <tr><th>Created At</th><td>${order.createdAt}</td></tr>
        <tr><th>Updated At</th><td>${order.updatedAt}</td></tr>
      </table>
      <h2>Raw JSON</h2>
      <pre>${JSON.stringify(order, null, 2)}</pre>
    </body>
    </html>
  `;
}

module.exports = renderOrderDetails;