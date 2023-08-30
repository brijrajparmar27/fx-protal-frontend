import React,{ useEffect, useState } from 'react';
import Button from "../../components/CustomButtons/Button";
import FileViewer from "react-file-viewer";

const BlogFileUploadPage = () => {
  const [file, setFile] = useState(null);
  const [fileDataURL, setFileDataURL] = useState(null);

  const changeHandler = (event) => {
    setFile(event.target.files[0]);
  };

  useEffect(() => {
    let fileReader,
      isCancel = false;
    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setFileDataURL(result);
        }
      };
      fileReader.readAsDataURL(file);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [file]);

  const onError = e => {
    console.log(e, "error in file-viewer");
  };

  return (
    <div className="BlogPageMain">
      <div>
        <h2>
          SELECT A FILE
        </h2>
      </div>
      
      <input
        type="file"
        name="file"
        accept=".pdf, .docx"
        onChange={changeHandler}
      />
      {fileDataURL ? (
        <>
          <div>
            <p>Filename: {file.name}</p>
            <p>Filetype: {file.type}</p>
            <p>Size in bytes: {file.size}</p>
            <p>
              lastModifiedDate:{" "}
              {file.lastModifiedDate.toLocaleDateString()}
            </p>
          </div>
          <b>Click On Submit To Upload</b>
          <FileViewer fileType="docx" filePath= {fileDataURL} onError={onError} />
          <div>
            <Button
              variant="contained"
              color="info"
              // onClick={}
              style={{ marginTop: "10px" }}
            >
              SUBMIT
            </Button>
          </div>
        </>
      ) : (
        <p>Select a file to show details</p>
      )}  
    </div>
  );
};

export default BlogFileUploadPage;
