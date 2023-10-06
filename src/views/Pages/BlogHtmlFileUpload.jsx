import React, { useState, useEffect } from "react";
import { endpoint } from "../../api/endpoint";
import Button from "../../components/CustomButtons/Button";
import { apiHandler } from "api";

const BlogHtmlFileUpload = ({ setLink }) => {
  const [file, setFile] = useState(null);
  const [uploadBlog, setUploadBlog] = useState();
  const [tempFileLink, setTempFileLink] = useState(null);

  useEffect(() => {
    tempFileLink && setLink(tempFileLink);
  }, [tempFileLink])

  const changeHandler = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const data = new FormData();
    data.append("file", file);
    setUploadBlog(data);
    const res = await apiHandler({
      method: "POST",
      url: endpoint.UPLOAD_BLOG_FILE,
      data: data,
      authToken: sessionStorage.getItem("token"),
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    if (res.data.errorCode) {
    } else {
      console.log("res...upload", res.data);
      setTempFileLink(JSON.parse(res.data).name)
      setLink("res.data.name")
    }
  };

  console.log("FILE ", file);
  return (
    <div>
      <div>
        <h6>SELECT A HTML FILE TO UPLOAD</h6>
      </div>

      <input type="file" name="file" accept=".html, .pdf, .jpg , .png" onChange={changeHandler} />
      {file ? (
        <>
          <div>
            <p>Filename: {file.name}</p>
            <p>Filetype: {file.type}</p>
            <p>
              lastModifiedDate: {file.lastModifiedDate.toLocaleDateString()}
            </p>
          </div>
          <b>Click On Upload To Submit</b>

          <div>
            <Button
              onClick={() => handleUpload()}
              variant="contained"
              color="info"
              style={{ marginTop: "10px" }}
            >
              UPLOAD
            </Button>
          </div>
        </>
      ) : (
        <p>Select a file to show details</p>
      )}
    </div>
  );
};

export default BlogHtmlFileUpload;