const axios = require("axios");

async function getOrderStatus(orderNumber) {
  const shop = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ACCESS_TOKEN;

  try {
    const response = await axios.get(`https://${shop}/admin/api/2023-04/orders.json?name=#${orderNumber}`, {
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json"
      }
    });

    if (response.data.orders && response.data.orders.length > 0) {
      const order = response.data.orders[0];
      return `📦 Order #${order.name} is currently **${order.fulfillment_status || "unfulfilled"}**, placed on ${order.created_at}`;
    } else {
      return "No order found with that number.";
    }
  } catch (error) {
    return "⚠️ Shopify API error. Please try again.";
  }
}

module.exports = { getOrderStatus };
