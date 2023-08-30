import React, { useState, useEffect } from "react";
// import { Container } from "@material-ui/core";
import "./BlogPageAdmin.css";
import { makeStyles } from "@material-ui/core/styles";
import Button from "../../components/CustomButtons/Button";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import axios from "axios";
import EditIcon from "@material-ui/icons//Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CreateBlogModal from "../Components/CreateBlogModal";
import ConfirmationModal from "views/Components/ConfirmationModal.jsx";
import { formatDate } from "../../utils/Utils";
import { endpoint } from "../../api/endpoint";
import { apiHandler } from "api";

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
    width: 450,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const BlogListAdmin = () => {
  // const classes = useStyles();
  // const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [ allBlogPost, setAllBlogPost] = useState([]);
  const [ filterBlogPost, setFilterBlogPost] = useState([]);
  const [ currentSize, setCurrentSize] = useState(10);
  const [ pageSize ] = useState(10);
  const [ isMoreFeed, setMoreFeed] = useState(true);
  const [editBlog, setEditBlog] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [confirmationModalHeader, setConfirmationModalHeader] = useState("");
  const [confirmationModalMsg, setConfirmationModalMsg] = useState("");
  const [deleteBlogId, setDeleteBlogId] = useState("");
  const [publishButton, setPublishButton] = useState(null);
  const [blog, setBlog] = useState({
    date: "",
    heading: "",
    description: "",
    link: "",
    active: false,
  });

  const handleOpen = () => {
    setOpen(!open);
  };
  const handlePublish = () =>{
    setPublishButton(true);
  };

  useEffect(() => {
    getBlogList();
  }, []);

  const getBlogList = async () => {
    let blogList = [];
    const URL = endpoint.BASE_URL_STAGING_AXIOS + endpoint.FIND_ACTIVE_BLOG + "?active=true";
    const activeBlogs = await axios.get(URL);
    if (activeBlogs.data.errorCode) {
    } else {
      console.log("ActiveBlogs", activeBlogs.data);
      blogList = [...blogList, ...activeBlogs.data.blogs];
    }
    const URL_INACTIVE = endpoint.BASE_URL_STAGING_AXIOS + endpoint.FIND_ACTIVE_BLOG + "?active=false";
    const inactiveBlogs = await axios.get(URL_INACTIVE);
    if (inactiveBlogs.data.errorCode) {
    } else {
      console.log("InactiveBlogs", inactiveBlogs.data);
      blogList = [...blogList, ...inactiveBlogs.data.blogs];
    }
    const sortedList = blogList.sort((a,b) => b.id - a.id)
    setAllBlogPost(sortedList);
    setFilterBlogPost(sortedList.slice(0, currentSize));
    setMoreFeed(sortedList.length > currentSize);
  };
  const showNextBlog = (e) => {
    setCurrentSize(currentSize + pageSize);
    setFilterBlogPost(allBlogPost.slice(0, currentSize + pageSize));
    setMoreFeed(allBlogPost.length > currentSize);
  };
  const uploadBlogDetails = async (data) => {
    console.log("ata", data);
    setBlog(data);
    const res = await apiHandler({
      method: "POST",
      url: endpoint.ADD_BLOG,
      data: data,
      authToken: sessionStorage.getItem("token"),
    });
    if (res.data.errorCode) {
    } else {
      console.log("res", res.data);
      getBlogList();
    }
  };
  const updateBlog = async (data) => {
    console.log("DATA", data);
    setBlog(data);
    const res = await apiHandler({
      method: "PUT",
      url: endpoint.UPDATE_BLOG,
      data: data,
      authToken: sessionStorage.getItem("token"),
    });
    console.log("res..........", res.data);
    if (res.data.errorCode) {
    } else {
      console.log("res.", res.data);
      getBlogList();
    }
  };

  const deleteblogDetails = async (id) => {
      setConfirmationModalHeader("Blogs");
      setConfirmationModalMsg("Are you sure you want to delete this entry");
      setConfirmationModal(true);
      setDeleteBlogId(id);
  };

  const handlePositiveResponse = async () => {
    const id = deleteBlogId;
    const res = await apiHandler({
      method: "DELETE",
      url: endpoint.DELETE_BLOG + "/" + id,

      authToken: sessionStorage.getItem("token"),
    });
    handleNegativeResponse();
    setDeleteBlogId("");
    if (res.data.errorCode) {
    } else {
      console.log("res", res.data);
      getBlogList();
    }
  };
  const handleNegativeResponse = () => {
    setConfirmationModalHeader("");
    setConfirmationModalMsg("");
    setConfirmationModal(false);
    setDeleteBlogId("");
  };
  const activeBlog = async (status, id) => {
    const res = await apiHandler({
      method: "PUT",
      url: endpoint.ENABLE_DISABLE_BLOG + id + "?active=" + status,
      authToken: sessionStorage.getItem("token"),
    });
    if (res.data.errorCode) {
    } else {
      console.log("res...activedeactive", res.data);
      getBlogList();
    }
    handlePublish()
  };

  const closeBlogModal = () => {
    setOpen(false);
    setEditBlog(null);
  };

  const handleEdit = (blog) => {
    setOpen(true);
    let desc = blog.description.split('<br>').join('\n');
    const editBlogData = {...blog, description: desc};
    setEditBlog(editBlogData);
  };
  return (
    <GridContainer justify="center" style={{ marginRight: 15 }}>
    <GridItem xs={7} sm={7} md={7} lg={7}>
        <div className="BlogPageMain">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: '30px' }}>
            <h4>BLOGS</h4>

            <div>
              <Button
                variant="contained"
                color="info"
                onClick={handleOpen}
              >
                ADD BLOG
              </Button>
            </div>
          </div>
          {open && (
            <CreateBlogModal
              showModal={open}
              closeModal={closeBlogModal}
              record={editBlog}
              uploadBlog={uploadBlogDetails}
              updateBlog={updateBlog}
              modalType={"addType"}
            />
          )}

          {filterBlogPost.map((post, index) => (
            <div style={{ display: "flex", justifyContent: "space-between" }} key={index}>
              <div style={{fontSize: 14, fontWeight: 300}}>
                <time>{formatDate(post.date)}</time>
                <div>
                  <h3 className="BlogHeading">{post.heading}</h3>
                </div>
                <div className="BlogDescription">
                  <p dangerouslySetInnerHTML={{__html: post.description}}></p>
                </div>

                <div style={{ paddingBottom: "50px" }}>
                {post.link && post.link !== "" && <a onClick={()=> window.open(post.link, "_blank")} class="BlogLink" style={{cursor: 'pointer'}}>
                    Continue reading
                  </a>}
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div>
                  {" "}
                  <EditIcon
                    onClick={() => handleEdit(post)}
                    style={{ marginRight: "20px" }}
                  />
                </div>
                <div>
                  <DeleteIcon
                    onClick={(e) => deleteblogDetails(post.id)}
                    style={{ marginRight: "20px" }}
                  />
                </div>
                {/* <div>
                  <input
                    type="checkbox"
                    id="Blogs"
                    name="Blog"
                    defaultChecked={post.active}
                    value="Blog"
                    onClick={(e) => activeBlog(e.target.checked, post.id)}
                  />
                </div> */}
                <div>
                  {post.active ? (
                    <>
                      <div>
                        <Button
                          onClick={() => activeBlog(false, post.id)}
                          value={post.active}
                          variant="contained"
                          color="info"  
                          style={{ padding: '7px', fontSize: '10px', backgroundColor: "brown" }}                       
                        >
                          Unpublish
                        </Button>
                      </div>  
                    </> 
                  ) : (
                    <div>
                    <Button
                          onClick={() => activeBlog(true, post.id)}
                          variant="contained"
                      color="info"
                      style={{ padding: '7px', fontSize: '10px', backgroundColor: "green" }}         
                    >
                      Publish
                    </Button>
                  </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isMoreFeed && (
            <GridItem xs={11} sm={11} md={11} lg={11}>
              <Button
                round={false}
                color="info"
                size="md"
                onClick={(e) => showNextBlog(e)}
              >
                MORE
              </Button>
            </GridItem>
          )}
        </div>
        <div />
        </GridItem>
        <ConfirmationModal
          confirmationModal={confirmationModal}
          confirmationModalHeader={confirmationModalHeader}
          confirmationModalMsg={confirmationModalMsg}
          handleNegativeButton={handleNegativeResponse}
          handlePositiveButton={handlePositiveResponse}
        />
      </GridContainer>
  );
};

export default BlogListAdmin;
