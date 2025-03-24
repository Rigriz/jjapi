import { MongoClient, ServerApiVersion } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    const collectionName = queryParams.collection;

    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    //console.log("Request Details:");
    //console.log("Method:", request.method);
    //console.log("URL:", request.url);
    //console.log("Headers:", request.headers);
    //console.log("Query Parameters:", queryParams);
    try {
        await client.connect();
        const database = client.db(process.env.DB_NAME);
        const collection = database.collection(collectionName);
        if (!collection) {
            return NextResponse.json({ error: `Collection not found: ${collectionName}` }, { status: 404 });
        }

        const query = {};
        const options = {
            projection: { _id: 0 }
        };
        const result = await collection.find(query, options).toArray();

        const response = NextResponse.json({ politics: result });
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        await client.close(); // Ensure the client is closed in the finally block
    }
}