import { MongoClient, ServerApiVersion } from 'mongodb';
import { NextResponse } from 'next/server';
//import fetchData from "@/app/(pages)/api/fetchdata";

export async function GET(request) {
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    const collectionName = queryParams.collection;

    // Log request details
    //console.log("Request Details:");
    //console.log("Method:", request.method);
    //console.log("URL:", request.url);
    //console.log("Headers:", request.headers);
    //console.log("Query Parameters:", queryParams);
    const uri = process.env.MONGODB_URI;
    //console.log(request);
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
     const getdata = async ()=>{
        try {
            // Connect to the MongoDB cluster
            await client.connect();
            // Access the database and collection
            const database = client.db(process.env.DB_NAME);
            const collection = database.collection(collectionName);
            if (!collection) {
                throw new Error(`Collection not found: ${request}`);
            }
    
            // Perform the query
            const query ={};
            const options ={
                projection: { _id: 0 } 
            };
             const result = await collection.find(query,options).toArray();
             await client.close();
             // Process the result
            console.log(result,"sdf")
            //return json;
            //whole data of webcontent
            //console.log('**************************************************************');
            //console.log(request,record);
            return {
                props: {
                    politics: result, //sending the { json data }
                },
                revalidate: 600000, // revalidate every 400 second
            };
        }
        catch (error) {
            if (error.codeName === 'AtlasError') {
                console.error('AtlasError:', error.code, error.codeName, error.errmsg);
                return { error: 'An error occurred while connecting to the database. Please try again later.' };
            } else {
                console.error(error);
                return { error: error.message };
            }
        } finally {
            // Close the client connection
            await client.close();
        }
    }
   
    // Optionally, log device details if available in headers
    const userAgent = request.headers.get('user-agent');
    if (userAgent) {
        //console.log("User-Agent:", userAgent);
    }
    let response;
    //console.log(webcontent);
    try {
        // Fetch data based on the collection name
        //const data = await getStaticProps(collectionName);
            
        const data = await getdata();
        // Create a response with CORS headers
        response = NextResponse.json(data);
        // Set CORS headers
        response.headers.set('Access-Control-Allow-Origin', '*'); // Allow all origins
        response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS'); // Allow specific methods
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers
    } catch (error) {
        console.error("Error retrieving data:", error);
        response = NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
    //console.log(collectionName);
    //const webcontent= request.query.webcontent;
    //const data = await getStaticProps(webcontent);
    //const data = await fetchData(webcontent);
    //console.log(data);
    //const res = await request.json()
    //const data = await fetchdata();
    response.headers.set('Access-Control-Allow-Origin', '*'); // Allow all origins
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS'); // Allow specific methods
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers
    console.log(response);
    return response;
}