import { MongoClient } from "mongodb";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { username, email, password } = await request.json();

  
  const uri = 'mongodb://localhost:27017';

  const client = new MongoClient(uri);

  try {
    const database = client.db('stock');
    const users = database.collection('user');

    // Check if the email is already registered
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'Email is already registered', success: false });
    }

    // Hash the password for security
    const hashedPassword = await hash(password, 10);

    // Create a new user document
    const user = {
      username,
      email,
      password: hashedPassword,
    };

    // Insert the user document into the database
    const result = await users.insertOne(user);

    if (result.insertedId) {
      return NextResponse.json({ message: 'Signup successful', success: true });
    } else {
      return NextResponse.json({ message: 'Signup failed', success: false });
    }
  } catch (error) {
    return NextResponse.json({ message: 'An error occurred during signup', success: false });
  } finally {
    await client.close();
  }
}
