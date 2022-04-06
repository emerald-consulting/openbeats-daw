import React, { useEffect, useState } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import axios from "axios";
import { url } from "../../utils/constants";

const LikeButton = ({ details, token }) => {
  const [totalLikes, setTotalLikes] = useState(details.totalLikes);
  const [checked, setChecked] = useState(false);
  const updateReaction = (isChecked) => {
    setChecked(isChecked);
    axios
      .put(
        url+"/posts/" + details.postId + "/likes/" + isChecked,
        null,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((response) => {
        setTotalLikes(response.data.postRef.totalLikes);
      });
  };

  const getReaction = async () => {
    const res = await axios.get(url + "/reactions/posts/" + details.postId, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        Authorization: "Bearer " + token,
      },
    });
    setChecked(res.data.isLike);
    console.log("pizza ", checked);
  };

  useEffect(() => {
    getReaction();
  }, []);

  return (
    <div
      style={{
        display: "block",
        width: "fit-content",
        float: "right",
        marginTop: "-30px",
      }}
    >
      <FormControlLabel
        control={
          <Checkbox
            onChange={(event) => {
              var isChecked = event.target.checked;
              updateReaction(isChecked);
            }}
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite />}
            checked={checked}
          />
        }
        label={totalLikes == 0 ? "" : totalLikes}
      />
    </div>
  );
};

export default LikeButton;
