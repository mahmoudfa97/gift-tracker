const gifts = [];

exports.handler = async (event, context) => {
  if (event.httpMethod === 'GET') {
    // Handle GET request to fetch all gifts
    return {
      statusCode: 200,
      body: JSON.stringify(gifts),
    };
  }

  if (event.httpMethod === 'POST') {
    // Parse the request body
    const { recipient, visits, price } = JSON.parse(event.body);

    if (!recipient || !visits || !price) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'All fields are required' }),
      };
    }

    const existingGiftIndex = gifts.findIndex(gift => gift.recipient.toLowerCase() === recipient.toLowerCase());

    if (existingGiftIndex !== -1) {
      // Update existing gift
      gifts[existingGiftIndex].visits = (parseInt(gifts[existingGiftIndex].visits) + parseInt(visits)).toString();
      gifts[existingGiftIndex].price = (parseFloat(gifts[existingGiftIndex].price) + parseFloat(price)).toFixed(2);
    } else {
      // Add new gift
      const newGift = { id: Date.now(), recipient, visits, price };
      gifts.push(newGift);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(gifts),
    };
  }

  if (event.httpMethod === 'DELETE') {
    const { id } = event.queryStringParameters;
    gifts = gifts.filter(gift => gift.id !== Number(id));

    return {
      statusCode: 204,
      body: '',
    };
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method not allowed' }),
  };
};
