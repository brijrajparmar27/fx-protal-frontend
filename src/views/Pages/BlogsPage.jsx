import React, { useEffect, useState } from "react";
// import { Container } from "@material-ui/core";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import { formatDate } from "../../utils/Utils";
import { endpoint } from "../../api/endpoint";
import { apiHandler } from "api";
import axios from "axios";

const BlogsPage = () => {
  const [ allBlogPost, setAllBlogPost] = useState([]);
  const [ filterBlogPost, setFilterBlogPost] = useState([]);
  const [ currentSize, setCurrentSize] = useState(10);
  const [ pageSize ] = useState(10);
  const [ isMoreFeed, setMoreFeed] = useState(true);

  useEffect(() => {
    getBlogList();
  },[]);
  const getBlogList = async () => {
    let blogList = [];
    const URL = endpoint.BASE_URL_STAGING_AXIOS + endpoint.FIND_ACTIVE_BLOG;
    const activeBlogs = await axios.get(URL);
    if (activeBlogs.data.errorCode) {

    } else {
      console.log('ActiveBlogs', activeBlogs.data);
      blogList = [...blogList, ...activeBlogs.data.blogs];
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
  return (
    <GridContainer justify="center" style={{ marginRight: 15 }}>
    <GridItem xs={6} sm={6} md={6} lg={6}>
    <div>
          <div>
            <h4 style={{marginBottom: "30px", marginTop: "30px"}}>BLOGS</h4>
          </div>
          
          {filterBlogPost.map((post, index) => (
            <>
              <div>
              <time>{formatDate(post.date)}</time>
                <div>
                  <h3 className="BlogHeading">{post.heading}</h3>
                </div>
                <div className="BlogDescription">
                  {/* <p>{post.description}</p> */}
                  <p dangerouslySetInnerHTML={{__html: post.description}}></p>
                </div>
              </div>
              <div style={{ paddingBottom: "50px"}}>
                {post.link && post.link !== "" && <a onClick={()=> window.open(post.link, "_blank")} class="BlogLink" style={{cursor: 'pointer'}}>
                  Continue reading
                </a>}
              </div>
            </>
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
      </GridItem>
      </GridContainer>
  );
};

export default BlogsPage;
