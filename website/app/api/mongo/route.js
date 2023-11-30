import  {MongoClient}  from "mongodb";
import { NextResponse } from "next/server";
export async function GET(request) {


    return  NextResponse.json({"a":34})
}



// // Replace the uri string with your connection string.
const uri = "mongodb+srv://pratikbhure:xhjyGbLILLZThUHn@cluster0.fcqbllj.mongodb.net/";

const client = new MongoClient(uri);


  try {
    const database = client.db('stock');
    const inventory = database.collection('inventory');

    // Query for a movie that has the title 'Back to the Future'
    const query = {  };
    const allproducts = await inventory.find();

    console.log(movie);
    return  NextResponse.json({allproducts})
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }

