import os
import time
from pinecone.grpc import PineconeGRPC as Pinecone
from pinecone import ServerlessSpec
from dotenv import load_dotenv
from transformers import AutoTokenizer

# Load environment variables
load_dotenv()

API_KEY = os.getenv("PINCONE_API_KEY")
pc = Pinecone(api_key=API_KEY)

# Initialize the tokenizer and set max token limit
tokenizer = AutoTokenizer.from_pretrained("intfloat/multilingual-e5-large")
max_length = 96  # Maximum number of tokens allowed per chunk

# Function to chunk text into smaller parts based on token limit
def chunk_text(text):
    # Tokenize the text into tokens (words and sub-words)
    tokens = tokenizer.encode(text, truncation=False)
    
    # If the number of tokens exceeds max_length, split into chunks
    chunks = []
    for i in range(0, len(tokens), max_length):
        chunk = tokens[i:i + max_length]
        chunks.append(tokenizer.decode(chunk, skip_special_tokens=True))
    
    return chunks

# Function to store embeddings
def store_embeddings(user_id: str, documents: list):
    index_name = f"user-{user_id}-documents-index"
    
    # Check if the index exists
    if not pc.has_index(index_name):
        print(f"Index '{index_name}' does not exist. Creating it now...")
        pc.create_index(
            name=index_name,
            dimension=1024,
            metric="cosine",
            spec=ServerlessSpec(cloud='aws', region='us-east-1')
        )
    
    # Wait until the index is ready
    print(f"Waiting for index '{index_name}' to be ready...")
    while not pc.describe_index(index_name).status.get('ready', False):
        time.sleep(1)

    index = pc.Index(index_name)
    
    # Prepare the records list
    records = []
    for document in documents:
        page_content = document['page_content']
        chunks = chunk_text(page_content)

        # Generate embeddings for each chunk
        embeddings = pc.inference.embed(
            model="multilingual-e5-large",
            inputs=chunks,
            parameters={"input_type": "passage", "truncate": "END"}
        )
        
        # Prepare records to upsert into Pinecone
        for i, e in enumerate(embeddings):
            records.append({
                "id": f"{document['id']}-{i}",  # Unique ID per chunk
                "values": e['values'],
                "metadata": {'text': chunks[i]}  # Store chunk text in metadata
            })
    
    # Upsert all the vectors to Pinecone
    print("Upserting vectors...")
    index.upsert(vectors=records, namespace=f"{index_name}_namespace")
    time.sleep(10)
    
    print(index.describe_index_stats())  # Print the index stats for debugging

# Function to query the stored documents
def query_result(user_id: str, query: str):
    index_name = f"user-{user_id}-documents-index"
    
    # Check if the index exists before querying
    if not pc.has_index(index_name):
        print(f"Index '{index_name}' not found!")
        return None
    
    # Generate embedding for the query
    embeddings = pc.inference.embed(
        model="multilingual-e5-large",
        inputs=[query],
        parameters={"input_type": "query"}
    )
    
    index = pc.Index(index_name)
    
    # Perform the query on Pinecone
    query_response = index.query(
        namespace=f"{index_name}_namespace",
        vector=embeddings[0]['values'],
        top_k=5,
        include_values=False,
        include_metadata=True
    )
    
    print("Query Response:", query_response)  # Debugging
    
    # Extract the relevant 'matches' data
    results = query_response.get('matches', [])
    
    # Return the page content of the matched documents
    return {"results": [doc['metadata']['text'] for doc in results]}
