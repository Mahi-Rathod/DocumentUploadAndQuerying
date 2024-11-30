// DocumentViewer.js
import React from 'react';
import { Document, Page } from 'react-pdf';
import Papa from 'papaparse';

const DocumentViewer = ({ fileUrl }) => {
  const [pdfPageCount, setPdfPageCount] = React.useState(null);
  const [csvData, setCsvData] = React.useState(null);

  const fileName = fileUrl.split('/').pop().toLowerCase();

  const fileType = fileName.split('.').pop().toLowerCase(); // Get file type based on extension

  const handleCsvParse = async () => {
    try {
      const response = await fetch(fileUrl);
      const text = await response.text();
      Papa.parse(text, {
        complete: (result) => {
          setCsvData(result.data);
        },
        header: true, // You can set to true to use the first row as header
      });
    } catch (error) {
      console.error('Error parsing CSV:', error);
    }
  };

  // Handle PDF page load
  const onLoadSuccess = ({ numPages }) => {
    setPdfPageCount(numPages);
  };

  // Render PDF Pages (we will render the first page only for simplicity)
  const renderPdf = () => (
    <div className="pdf-container">
      <Document
        file={fileUrl}
        onLoadSuccess={onLoadSuccess}
        options={{ cMapUrl: 'cmaps/', cMapPacked: true }}
      >
        <Page pageNumber={1} />
      </Document>
      {pdfPageCount > 1 && <p>Page 1 of {pdfPageCount}</p>}
    </div>
  );

  // Render Image
  const renderImage = () => <img src={fileUrl} alt={fileName} className="w-full max-h-[500px] object-contain" />;

  // Render CSV
  const renderCsv = () => {
    return (
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            {csvData[0] &&
              Object.keys(csvData[0]).map((key) => (
                <th key={key} className="border px-4 py-2 text-left">{key}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {csvData.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, i) => (
                <td key={i} className="border px-4 py-2">{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Determine how to render based on file type
  const renderDocument = () => {
    switch (fileType) {
      case 'pdf':
        return renderPdf();
      case 'csv':
        handleCsvParse();
        return csvData ? renderCsv() : <p>Loading CSV...</p>;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return renderImage();
      case 'txt':
      case 'docx':
      case 'xls':
        return <p>File type not supported for preview. <a href={fileUrl} download>Download</a></p>;
      default:
        return <p>File type not supported for preview. <a href={fileUrl} download>Download</a></p>;
    }
  };

  return (
    <div className="document-viewer">
      <h2 className="text-xl font-semibold mb-4">{fileName}</h2>
      <div>{renderDocument()}</div>
    </div>
  );
};

export default DocumentViewer;
