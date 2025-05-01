import { MongoClient, ServerApiVersion } from 'mongodb';

// MongoDB connection URI
const uri = process.env.MONGODB_URI; // Replace with your MongoDB URI

// Create a new MongoClient
const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
});

export async function POST(request) {
  try {
    const url = new URL(request.url);
    const title = url.searchParams.get('title');
    const content = url.searchParams.get('content');
    const time = url.searchParams.get('time');
    const date = url.searchParams.get('date');
    const imageURL = url.searchParams.get('imageURL');
    const category = url.searchParams.get('category');

    if (!title || !content || !time || !date || !imageURL || !category) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
      });
    }
    //console.log("Request Details:");
    //console.log("Method:", request.method);
    //console.log("URL:", request.url);
    //console.log("Headers:", request.headers);
    //console.log("Query Parameters:", queryParams); http://localhost:3000?title=ಕೃಷಿ: ಸಾಗುವಳಿ ಸುಧಾರಣೆ ಯೋಜನೆ"&content="ರೈತರಿಗೆ ಸಾಗುವಳಿ ತಂತ್ರಜ್ಞಾನದಲ್ಲಿ ತರಬೇತಿ ನೀಡುವ ಹೊಸ ಕಾರ್ಯಕ್ರಮ."&time="10:15"&date="2025-03-19"&imageURL="https://example.com/images/farming-tech.jpg"&category="agriculture"
    await client.connect();
    const db = client.db(process.env.DB_NAME); // Replace with your DB name
    const collection = db.collection(category); // Dynamic collection based on category
    //console.log(title, collection, time, date, imageURL, category)
    const newItem = {
      title,
      content,
      time,
      date,
      imageURL,
    };
    console.log(newItem);
    const result = await collection.insertOne(newItem);
    
    return new Response(
      JSON.stringify({
        message: 'Item added successfully',
        insertedId: result.insertedId,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error inserting item:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  } finally {
    await client.close();
  }
}
