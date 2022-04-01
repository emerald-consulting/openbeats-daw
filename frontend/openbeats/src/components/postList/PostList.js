import axios from "axios";
import { useEffect, useState } from "react";
import { url } from "../../utils/constants";
import SocialPost from "../socialPost/SocialPost";

const PostList = ({uriParam}) =>{

    const [posts, setPosts] = useState([]);
    let token = localStorage.getItem("auth-token");

    useEffect( ()=>{
        getPosts();
      }, []);
    
      const getPosts = async(page = 0) => {
       const res = await axios.get(url + "/"+ uriParam + "/"+ page,{headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
          'Authorization': 'Bearer '+ token
      }});
      setPosts(res.data);
      console.log(res.data);
      }

return(
    <>
    {
        posts.map(p => <SocialPost details = {p}/>)
    }
    </>

)
}

export default PostList;