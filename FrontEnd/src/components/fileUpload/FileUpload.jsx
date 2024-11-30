// FileUpload.jsx
import React, { useState, useEffect } from 'react';
import axios from "axios";
import Loader from "../loader/Loader.jsx"
import DocumentListing from "../documentViewer/DocumentListing.jsx";
const FileUpload = () => {

  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [fileUploading, setFileUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
    withCredentials: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setFileUploading(true);
      const { data } = await axiosInstance.post("/documents/upload-document", {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });

      const { url, id, userId } = data;

      const uploadToS3 = await axios.put(url, file, {
        headers: {
          "Content-Type": file.type
        }
      });

      if (uploadToS3) {
        alert("document uploaded successfully");
        const { data } = await axiosInstance.get(`/documents/get-document/${id}`);

        const { url } = data;

        const formData = new FormData();
        formData.append("url", url);
        formData.append("fileName", file.name);
        formData.append("userId", userId);
        
        const res = await axios.post("http://127.0.0.1:8000/upload-to-pincone", formData);

        console.log(res);
        setFileUploading(false);
        setFile(false);
      }
    } catch (err) {
      console.log(err);
      setFileUploading(false)
    }
  };

  const fetchFiles = async () => {
    try {
      const res = await axiosInstance.get('/documents/get-all-documents');
      setFiles(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch files');
    }
  };

  useEffect(() => {
    fetchFiles(); // Fetch files on component load
  }, []);

  if (fileUploading) {
    return (
      <Loader />
    )
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form
        className="w-1/3 p-6 bg-white rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <h2 className="mb-4 text-lg font-semibold text-gray-700">Upload File</h2>
        <div className="mb-4">
          <label
            className="block mb-2 text-sm font-medium text-gray-600"
            htmlFor="fileInput"
          >
            Choose a file:
          </label>
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        {file && (
          <p className="mb-4 text-sm text-gray-500">Selected file: {file.name}</p>
        )}
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Upload
        </button>
      </form>

      {
        files?.length > 0 && <DocumentListing files={files} />
      }
    </div>
  );
};

export default FileUpload;
