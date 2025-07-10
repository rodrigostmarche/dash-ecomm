function renderHTML(title, totalOrders, financialCounts, fulfillmentCounts, statusCounts) {
  const formatCounts = (counts) =>
    Object.entries(counts)
      .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
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
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p><strong>Total de pedidos nos últimos 7 dias:</strong> ${totalOrders}</p>
      <div class="grid">
        <div class="card">
          <h2>Payment Status</h2>
          <ul>${formatCounts(financialCounts)}</ul>
        </div>
        <div class="card">
          <h2>Fulfillment Status</h2>
          <ul>${formatCounts(fulfillmentCounts)}</ul>
        </div>
        <div class="card">
          <h2>Picking App Status"</h2>
          <ul>${formatCounts(statusCounts)}</ul>
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = renderHTML;