import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware

from downloadDocs import download_document
from pinconeFunctions import store_embeddings, query_result
from partitionData import generate_json_from_local, process_json_file

load_dotenv()

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Or specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def empty_folder(folder_path : str):
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)

        if os.path.isfile(file_path):
            os.remove(file_path)


@app.post("/upload-to-pincone")
async def upload(url: str = Form(...), fileName: str = Form(...), userId: str = Form(...)):
    try:
        download_document(url, fileName)
        
        generate_json_from_local(
            input_path="./Documents",
            output_dir="./Outputs",
            parition_by_api=True,
            api_key=os.getenv("UNSTRUCTURED_API_KEY"),
            partition_endpoint=os.getenv("UNSTRUCTURED_API_URL")
        )
        
        print("Finished ingestion process.")
        print("Moving to process json file.")
        
        documents = process_json_file(f"./Outputs/{fileName}.json")
        print("Processing Json file done.")
        
        empty_folder('Documents')
        empty_folder('Outputs') 
        
        store_embeddings(userId, documents)
        
        return {"message": "PDF processed and stored in Pinecone"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.post('/query')
async def query_documents(userId : str = Form(...), query : str = Form(...)):
    res = query_result(userId, query)
    
    return {"results" : res}
    
    