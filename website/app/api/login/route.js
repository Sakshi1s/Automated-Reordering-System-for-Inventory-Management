import { MongoClient } from "mongodb";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { email, password } = await request.json();

  // Replace the uri string with your MongoDB connection string.
  const uri = 'mongodb://localhost:27017';

  const client = new MongoClient(uri);

  try {
    const database = client.db('stock');
    const users = database.collection('user');

    // Find the user by email
    const user = await users.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password', success: false });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ message: 'Invalid email or password', success: false });
    }

    // Create a JSON web token (JWT) for authentication
    const token = sign({ email: user.email },process.env.JWT_SECRET, { expiresIn: '1h' });

    return NextResponse.json({ message: 'Login successful', success: true, token });
  } catch (error) {
    return NextResponse.json({ message: 'An error occurred during login', success: false });
  } finally {
    await client.close();
  }
}
