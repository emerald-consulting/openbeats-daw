import axios from "axios";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingOverlay from "react-loading-overlay";
import { url } from "../../utils/constants";
import TrendingListItem from "./trendingListItem/TrendingListItem";
import classes from "../pages/SocialHomePage.module.css";

const TrendingList = (props) => {
  let token = localStorage.getItem("auth-token");
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState([]);

  useEffect(() => {
    getTrending();
  }, []);

  const getTrending = async () => {
    setIsLoading(true);
    const res = await axios.get(url + "/getTrending", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        Authorization: "Bearer " + token,
      },
    });
    setList([...res.data]);
    setIsLoading(false);
  };
  return (
    <>
    <div>
        <h2 className="mb-1" style={{ color: "#000" }}>
          Trending
        </h2>
      </div>
    <LoadingOverlay active={isLoading} spinner className={classes.heading}>
      {list.map((item) => (
        <TrendingListItem details={item} />
      ))}
    </LoadingOverlay>
    </>  );
};

export default TrendingList;
