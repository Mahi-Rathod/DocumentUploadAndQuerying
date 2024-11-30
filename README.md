
# Full-Stack Developer Assignment: Document Management & NLP System

## Objective

Develop a **secure, scalable full-stack application** that allows users to upload, store, and interact with various document types (PDF, PPT, CSV, etc.) using **advanced Natural Language Processing (NLP)**. The system integrates **RAG (Retrieve and Generate) Agents** for querying document content and supports **document management, user authentication,** and **efficient parsing** via **unstructured.io**.

---

## Tools and Technologies

### **Backend Microservices Architecture**
- **User & Document Controllers**: Node.js with MongoDB  
- **Query Microservice**: FastAPI for handling PDF queries and NLP operations  

### **Frontend**
- **Framework**: React.js (Vite)  

### **NLP & Agents**
- **NLP Framework**: Pinecone  

### **Database**
- **User and Document Data**: MongoDB  

### **File Storage**
- **AWS S3**  

---

## Functional Requirements

### 1. **User and Document Management (Node.js + MongoDB)**
#### Objective:  
Manage user authentication and document uploads with secure storage and parsing.

#### Features:
- **User Management**: Register, login, and manage users with session or token-based authentication.  
- **Document Handling**: Upload and store documents in various formats, ensuring metadata extraction.

### 2. **NLP Querying (FastAPI)**
#### Objective:  
Use **FastAPI** to query document contents and provide accurate responses via NLP techniques.

#### Features:
- **Document Parsing**: Extract content efficiently using **unstructured.io**.  
- **RAG Agent Integration**: Retrieve and generate precise answers to user queries from uploaded documents.

---

## File Structure

```
DOCUMENTUPLOADANDQUERYING/
├── FrontEnd/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   └── (React components)
│   ├── .env
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── Parsing/ (FastAPI microservice)
│   ├── __pycache__/
│   ├── Documents/
│   ├── myenv/ (Python virtual environment)
│   ├── Outputs/
│   ├── .env
│   ├── main.py (FastAPI app entry point)
│   ├── downloadDocs.py
│   ├── partitionData.py
│   ├── pineconeFunctions.py
│   └── requirements.txt
│
└── Server/ (Node.js backend)
    ├── node_modules/
    ├── Public/
    ├── src/
    │   └── (Controllers, routes, models)
    ├── .env.sample
    ├── package.json
    └── main.js (App entry point)
```

---

## API Endpoints

### **Node.js REST APIs**
- **Authentication APIs**
  - `POST /signup`: Sign up using OTP  
  - `POST /sendotp`: Send OTP for verification  
  - `POST /verifyotp`: Verify OTP  
  - `POST /signinuspassword`: Login with password  
  - `POST /signinusingotp`: Login with OTP
  - `GET /get-user` : Check if user logged in
  - `GET /google` : OAuth2.0 Login or Signup with Google
  - `POST /signout`: User logout  

- **Document APIs**
  - `POST /upload-document`: Upload a document  
  - `GET /get-document/:id`: Retrieve a document by ID  
  - `GET /get-all-documents`: Retrieve all documents  

### **FastAPI NLP Endpoints**
- `POST /upload-to-pinecone`: Upload data to Pinecone  
- `POST /query`: Query uploaded documents and retrieve answers  

---

## Setup Instructions

### **Frontend (React with Vite)**
1. Navigate to the `FrontEnd` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### **Node.js Server**
1. Navigate to the `Server` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.sample` and configure MongoDB URI, AWS S3 credentials, etc.
4. Start the server:
   ```bash
   npm start
   ```

### **FastAPI (Parsing Microservice)**
1. Navigate to the `Parsing` directory.
2. Create a virtual environment:
   ```bash
   python -m venv myenv
   source myenv/bin/activate  # On Windows: myenv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

---

## Database Design

### **MongoDB Collections**  
- **Users**: Stores user details and authentication info.  
- **Documents**: Manages document metadata and storage references.  

---

## Communication Between Microservices

- Implemented **microservice communication** using REST between Node.js and FastAPI.  

---

## Conclusion

This project delivers a **scalable document management system** that combines **Node.js and FastAPI** microservices for seamless document querying and advanced NLP-based interactions.
