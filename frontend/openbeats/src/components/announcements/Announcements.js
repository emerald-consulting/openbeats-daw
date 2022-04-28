import axios from "axios";
import { useEffect, useState } from "react";
import LoadingOverlay from "react-loading-overlay";
import { url } from "../../utils/constants";
import AnnouncementItem from "./announcementItem/AnnouncementItem";

const Announcements = ({refresh, username}) => {
  let token = localStorage.getItem("auth-token");
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState([]);

  useEffect(() => {
    getAnnouncements();
  }, [refresh, username]);

  const getAnnouncements = async () => {
    setIsLoading(true);
    const res = await axios.get(url + "/getAnnouncements/"+ username , {
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
    <LoadingOverlay active={isLoading} spinner>
      <h2 className="mb-1" style={{ color: "#000" }}>
        Announcements
      </h2>
      {list.map((item) => (
        <AnnouncementItem details={item} />
      ))}
    </LoadingOverlay>
  );
};

export default Announcements;
