import React from "react";

const FileListView = ({ files }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 justify-items-center">
      {files.map((file, index) => (
        <div key={index} className="border border-gray-300 rounded-lg p-4 bg-white shadow-md text-center">
          <div className="mb-4">
            {/* Display file type or a default icon */}
            {file.fileType.startsWith("image/") ? (
              <img
                src={file.url}
                alt={file.fileName}
                className="w-full h-32 object-cover rounded-md"
              />
            ) : (
              <div className="text-4xl text-gray-400">📄</div>
            )}
          </div>
          <div className="mb-4">
            <h4 className="text-lg font-semibold">{file.fileName}</h4>
          </div>
          <div className="flex justify-around">
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 font-bold text-sm"
            >
              View
            </a>
            <a
              href={file.url}
              download={file.fileName}
              className="text-blue-500 font-bold text-sm"
            >
              Download
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileListView;
