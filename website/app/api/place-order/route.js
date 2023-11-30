import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

// Handle the POST request
export async function POST(request) {
  if (request.method !== 'POST') {
    return NextResponse.error({ status: 405, body: 'Method not allowed' });
  }

  const { slug, quantity } = request.body;

  if (!slug || !quantity || isNaN(quantity)) {
    return NextResponse.error({ status: 400, body: 'Invalid order data' });
  }

  try {
    const uri = 'mongodb+srv://pratikbhure:xhjyGbLILLZThUHn@cluster0.fcqbllj.mongodb.net/';
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    await client.connect();

    const database = client.db('stock');
    const collection = database.collection('inventory');

    const order = {
      productSlug: slug,
      quantity: parseInt(quantity),
      createdAt: new Date(),
    };

    const result = await collection.insertOne(order);

    await client.close();

    return NextResponse.json({ message: 'Order placed successfully', orderId: result.insertedId });
  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.error({ status: 500, body: 'Internal server error' });
  }
}
