require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

const store = process.env.SHOPIFY_STORE;
const token = process.env.SHOPIFY_TOKEN;

// Gera a data no formato YYYY-MM-DD para 3 dias atrás
function getDateThreeDaysAgo() {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date.toISOString().split('T')[0];
}

// Pagina automaticamente até obter todos os pedidos
async function fetchAllOrders() {
  const dateStr = getDateThreeDaysAgo();
  let hasNextPage = true;
  let endCursor = null;
  const allOrders = [];

  while (hasNextPage) {
    const query = `
      query {
        orders(first: 250, query: "created_at:>=${dateStr}"${endCursor ? `, after: "${endCursor}"` : ''}) {
          edges {
            node {
              id
              name
              displayFinancialStatus
              displayFulfillmentStatus
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;

    try {
      const response = await axios.post(
        `https://${store}/admin/api/2024-04/graphql.json`,
        { query },
        {
          headers: {
            'X-Shopify-Access-Token': token,
            'Content-Type': 'application/json',
          },
        }
      );

      const ordersData = response.data.data.orders;
      const nodes = ordersData.edges.map(edge => edge.node);
      allOrders.push(...nodes);

      hasNextPage = ordersData.pageInfo.hasNextPage;
      endCursor = ordersData.pageInfo.endCursor;
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error.response?.data || error.message);
      break;
    }
  }

  return allOrders;
}

// Conta por campo (ex: displayFinancialStatus)
function countByField(orders, field) {
  const count = {};
  for (const order of orders) {
    const value = order[field] || 'UNKNOWN';
    count[value] = (count[value] || 0) + 1;
  }
  return count;
}

// Renderiza o HTML da página
function renderHTML(title, totalOrders, financialCounts, fulfillmentCounts) {
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
        .grid { display: flex; gap: 2em; }
        .card { background: #fff; padding: 1em 2em; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p><strong>Total de pedidos nos últimos 7 dias:</strong> ${totalOrders}</p>
      <div class="grid">
        <div class="card">
          <h2>displayFinancialStatus</h2>
          <ul>${formatCounts(financialCounts)}</ul>
        </div>
        <div class="card">
          <h2>displayFulfillmentStatus</h2>
          <ul>${formatCounts(fulfillmentCounts)}</ul>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Rota principal
app.get('/', async (req, res) => {
  try {
    const orders = await fetchAllOrders();
    const totalOrders = orders.length;
    const financialCounts = countByField(orders, 'displayFinancialStatus');
    const fulfillmentCounts = countByField(orders, 'displayFulfillmentStatus');

    res.send(
      renderHTML('Resumo de Pedidos Shopify (últimos 7 dias)', totalOrders, financialCounts, fulfillmentCounts)
    );
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao consultar pedidos.');
  }
});

app.listen(port, () => {
  console.log(`Aplicação rodando em http://localhost:${port}`);
});
