import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useInput from "../../hooks/use-input";
import { url } from "../../utils/constants";
import classes from "./newPostForm.module.css";
import { ListItem, TextField, Autocomplete, InputAdornment,Menu,MenuItem } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { Typeahead } from "react-bootstrap-typeahead";

const NewPostForm = ({ refreshPosts }) => {
  const user = useSelector((_state) => _state.user);
  let jwtToken = `${user.jwtToken}`;
  const [track, setTrack] = useState(null);
  const [cover, setCover] = useState(null);
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [genre, setGenre] = useState([]);
  const [genreOptions, setGenreOptions] = useState([]);

  useEffect(() => {
    getGenreList();
  }, []);

  const getGenreList = async () => {
    const res = await axios.get(url + "/getAllGenre", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        Authorization: "Bearer " + jwtToken,
      },
    });
    setGenreOptions([...res.data]);
  };

  const {
    value: enteredDescription,
    isTouched: isEnteredDescriptionTouched,
    hasError: isEnteredDescriptionInValid,
    inputChangeHandler: inputChangeHandler,
    inputBlueHandler: inputBlurHandler,
    reset: resetDescription,
  } = useInput((value) => true);

  const {
    value: enteredTitle,
    isTouched: isEnteredTitleTouched,
    hasError: isEnteredTitleInValid,
    inputChangeHandler: enteredTitleChangeHandler,
    inputBlueHandler: enteredTitleBlurHandler,
    reset: resetTitle,
  } = useInput((value) => true);

  const trackChangeHandler = (event) => {
    setTrack(event.target.files[0]);
  };

  const coverChangeHandler = (event) => {
    setCover(event.target.files[0]);
  };

  const announcementChangeHandler = (event) => {
    setIsAnnouncement(event.target.checked);
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    if (isEnteredDescriptionInValid) {
      return;
    }
    const json = {
      description: enteredDescription,
      genre: genre[0] && genre[0].customOption ? genre[0].name : genre[0] || "",
      isAnnouncement: false,
      isMediaAdded: false,
      trackFileName: null,
      pictureFileName: null,
      totalLikes: 0,
      totalDislikes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      bucketName: null,
      title: enteredTitle,
      isAnnouncement: isAnnouncement,
    };

    const formData = new FormData();
    formData.append("json", JSON.stringify(json));
    formData.append("picture", cover);
    let _file = null;
    if (track && track.blob) {
      _file = new File([track.blob], "audio.mp3");
    } else if (typeof track == "string") {
      _file = new File([new Blob(track.substring(5))], "audio.mp3");
    } else {
      _file = track;
    }
    setIsLoading(true);

    formData.append("track", _file);

    const res = await axios.post(url + "/post", formData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        Authorization: "Bearer " + jwtToken,
      },
    });

    const newReaction = await axios.post(
      url + "/reactions/" + res.data.postId,
      null,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
          Authorization: "Bearer " + jwtToken,
        },
      }
    );
    clearForm();
    setIsLoading(false);
    getGenreList();
    refreshPosts();
  };

  const clearForm = () => {
    resetTitle();
    resetDescription();
    setIsAnnouncement(false);
    setTrack(null);
    setCover(null);
    setGenre([]);
  };

  const cancelHandler = () => {
    clearForm();
  };

  const enteredDescriptionClasses = isEnteredDescriptionInValid
    ? "form-control invalid"
    : "form-control";

  const enteredTitleClasses = isEnteredTitleInValid
    ? "form-control invalid"
    : "form-control";

  return (
    <form onSubmit={formSubmitHandler} className={classes.new}>

      <div className={enteredDescriptionClasses} style={{width: "inherit",marginBottom:"2%"}}>
        <textarea
          style={{ width: "100%" }}
          type="text"
          id="desc"
          onChange={inputChangeHandler}
          value={enteredDescription}
          onBlur={inputBlurHandler}
          placeholder="What's happening"
          rows="4"
        />
      </div>
      <div className={enteredTitleClasses} style={{ width: "45%", marginBottom:"2%" }}>
        <input
          type="text"
          id="title"
          onChange={enteredTitleChangeHandler}
          value={enteredTitle}
          onBlur={enteredTitleBlurHandler}
          placeholder="Title"
        />
      </div>

      <div className="form-control" style={{ width: "45%",marginBottom:"2%"}}>
        <Typeahead
          allowNew
          id="basic-typeahead-single"
          labelKey="name"
          newSelectionPrefix="new genre: "
          onChange={setGenre}
          options={genreOptions}
          placeholder="Genre"
          selected={genre}
        />
      </div>
      <div className={`form-control ${classes.fileUpload}`} style={{marginBottom:"2%"}}>
        <label htmlFor="track-upload">
          {track ? track.name : "Upload track"}
        </label>
        <input
          type="file"
          id="track-upload"
          accept="audio/*"
          onChange={trackChangeHandler}
        />
      </div>

      <div className={`form-control ${classes.fileUpload}`} style={{marginBottom:"2%"}}>
        <label htmlFor="cover-upload">
          {cover ? cover.name : "Upload Cover"}
        </label>
        <input
          type="file"
          id="cover-upload"
          accept="image/*"
          onChange={coverChangeHandler}
        />
      </div>
      <div className={`form-control ${classes.checkbox}`} style={{marginBottom:"2%"}}>
        <label>
          Announcement?
          <input
            type="checkbox"
            id="announcement"
            onChange={announcementChangeHandler}
            checked={isAnnouncement}
          />
          <span className={classes.checkmark}></span>
        </label>
      </div>
      <div className="form-actions" style={{marginBottom:"2%"}}>
        <button
          type="button"
          className={classes.secondary}
          onClick={cancelHandler}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={classes.submitButton}
          disabled={isLoading}
        >
          Post{isLoading ? "..." : null}
        </button>
      </div>

    </form>
  );
};

export default NewPostForm;
