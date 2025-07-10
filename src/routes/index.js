const express = require('express');
const router = express.Router();
const { fetchAllOrders } = require('../services/shopifyService');
const { countByField } = require('../utils/helpers');
const renderHTML = require('../views/renderHTML');

router.get('/', async (req, res) => {
  try {
    const orders = await fetchAllOrders();
    const totalOrders = orders.length;
    const financialCounts = countByField(orders, 'displayFinancialStatus');
    const fulfillmentCounts = countByField(orders, 'displayFulfillmentStatus');
    const statusCounts = countByField(orders, 'statusMetafield');

    res.send(
      renderHTML(
        'Resumo de Pedidos Shopify (últimos 7 dias)',
        totalOrders,
        financialCounts,
        fulfillmentCounts,
        statusCounts
      )
    );
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao consultar pedidos.');
  }
});

module.exports = router;