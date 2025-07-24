const axios = require('axios');

const store = process.env.SHOPIFY_STORE;
const token = process.env.SHOPIFY_TOKEN;

async function fetchAllOrders(startDate) {
  let hasNextPage = true;
  let endCursor = null;
  const allOrders = [];

  while (hasNextPage) {
    const query = `
      query {
        orders(first: 250, query: "created_at:>=${startDate}"${endCursor ? `, after: \"${endCursor}\"` : ''}) {
          edges {
            node {
              id
              name
              displayFinancialStatus
              displayFulfillmentStatus
              metafield(namespace: "order", key: "status") {
                value
              }
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
      const nodes = ordersData.edges.map(edge => {
        const node = edge.node;
        return {
          id: node.id,
          name: node.name,
          displayFinancialStatus: node.displayFinancialStatus,
          displayFulfillmentStatus: node.displayFulfillmentStatus,
          statusMetafield: node.metafield?.value || 'NÃO INTEGRADO',
        };
      });

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

module.exports = { fetchAllOrders };