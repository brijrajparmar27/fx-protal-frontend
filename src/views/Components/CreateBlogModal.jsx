import React, { useEffect, useState } from "react";
import Modal from "@material-ui/core/Modal";
import { TextField } from "@material-ui/core";
import Button from "../../components/CustomButtons/Button";
import CustomDateSelector from "components/CustomDateSelector/CustomDateSelector.jsx";
import { makeStyles } from "@material-ui/core/styles";
import BlogHtmlFileUpload from "../Pages/BlogHtmlFileUpload";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}
function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    position: "absolute",
    width: 550,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
const CreateBlogModal = ({
  modalType,
  showModal,
  closeModal,
  uploadBlog,
  updateBlog,
  record,
}) => {
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();

  console.log("record", record);
  const [date, setDate] = useState(
    record && record.date ? new Date(record.date) : new Date()
  );
  const [heading, setHeading] = useState(
    record && record.heading ? record.heading : ""
  );
  const [description, setDescription] = useState(
    record && record.description ? record.description : ""
  );
  // const [link, setLink] = useState(record && record.link ? record.link : "");
  const [link,setLink] = useState("");

  useEffect(()=>{
    console.log(link);
  },[link])

  const saveData = () => {
    // check for link in Description
    let lineDescription = description.split('\n').join('<br>');
    let strArray = lineDescription.split('<link>');
    let str = strArray[0];
    if (strArray.length > 1) { // link is embedded
      for (let i=1; i < strArray.length; i++) {
        let linkArr = strArray[i].split('</link>');
        // str = str + `<a onClick={()=> window.open(${linkArr[0]}, "_blank")} class="BlogLink" style={{cursor: 'pointer'}}>${linkArr[0]}</a>`
        str = str + ` <a target="_blank" href="${linkArr[0]}">${linkArr[0]}</a>`
        str = str + linkArr[1];
      }
    }
    console.log(str);

    if (record && record.id) {
      updateBlog({
        id: record.id,
        date,
        heading,
        description: str,
        link,
        active: true,
      });
    } else {
      uploadBlog({
        date,
        heading,
        description: str,
        link,
        active: true,
      });
    }
    closeModal();
  };

  return (
    <>
      {modalType === "addType" && (
        <Modal
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          open={showModal}
          onClose={() => closeModal()}
        >
          <div style={modalStyle} className={classes.paper}>
            <h2 className="ModalHeading">Blog Submission Details</h2>
            <div style={{ display: "grid" }}>
            <div style={{ display: "flex"}}>
              <CustomDateSelector
                id="rr_date"
                style={{ width: '70%' }}
                inputProps={{
                  format: "dd MMM yyyy",
                  label: "Date",
                  value: date,
                  onChange: (date) => setDate(date),
                  keyboardbuttonprops: {
                    "aria-label": "change date",
                  },
                }}
                formControlProps={
                  {
                    // fullWidth: true,
                  }
                }
              />
              <TextField
                style={{ marginBottom: 15, marginTop: 24, marginLeft: 15, width: '100%' }}
                id="standard-basic"
                label="Heading"
                multiline
                name="heading"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
              />
                </div>
              <TextField
                style={{ marginBottom: 15 }}
                id="standard-multiline-static"
                label="Description"
                multiline
                rows={4}
                variant="standard"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div style={{ display: "flex", justifyContent:"space-between"}}>
              <TextField
                style={{ marginBottom: 15 }}
                id="standard-basic"
                label="Link"
                multiline
                name="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
              <BlogHtmlFileUpload setLink={setLink}/>
              </div>
              <br />
              <Button
                variant="contained"
                color="info"
                onClick={() => {
                  saveData();
                }}
                style={{ marginTop: 30 }}
              >
                Submit
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default CreateBlogModal;
