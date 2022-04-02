import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import useInput from "../../hooks/use-input";
import { url } from "../../utils/constants";
import classes from "./newPostForm.module.css";

const NewPostForm = (props) => {

  const user = useSelector(_state => _state.user);
  let jwtToken = `${user.jwtToken}`;
  const [track, setTrack] = useState(null);
  const [cover, setCover] = useState(null);


  const {
    value: enteredDescription,
    isTouched: isEnteredDescriptionTouched,
    hasError: isEnteredDescriptionInValid,
    inputChangeHandler: inputChangeHandler,
    inputBlueHandler: inputBlurHandler,
    reset: resetInput,
  } = useInput((value) => true);

  const {
    value: enteredTitle,
    isTouched: isEnteredTitleTouched,
    hasError: isEnteredTitleInValid,
    inputChangeHandler: enteredTitleChangeHandler,
    inputBlueHandler: enteredTitleBlurHandler,
    reset: resetTitle,
  } = useInput((value) => value.trim().length > 0);

  const {
    value: enteredGenre,
    isTouched: isenteredGenreTouched,
    hasError: isenteredGenreInValid,
    inputChangeHandler: enteredGenreChangeHandler,
    inputBlueHandler: enteredGenreBlurHandler,
    reset: resetGenre,
  } = useInput((value) => true);

  let isFormValid = false;

  if (!isEnteredTitleInValid) {
    isFormValid = true;
  }

  const trackChangeHandler = (event)=>{
    setTrack(event.target.files[0])
  }

  const coverChangeHandler = (event)=>{
    setCover(event.target.files[0])
  }

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    if (isEnteredDescriptionInValid) {
      return;
    }
    const json = {
      description: enteredDescription,
      genre: enteredGenre,
      isAnnouncement: false,
      isMediaAdded: false,
      trackFileName: null,
      pictureFileName: null,
      totalLikes: 0,
      totalDislikes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      bucketName: null,
      title: enteredTitle
    }

    const formData = new FormData();
    formData.append(
      'json', JSON.stringify(json)
    );
    formData.append(
      'picture', cover
    );
    let _file = null;
    if (track && track.blob) {
      _file = new File([track.blob], "audio.mp3");
    } else if (typeof track == "string") {
      _file = new File([new Blob(track.substring(5))], "audio.mp3");
    } else {
      _file = track;
    }

    formData.append(
      'track', _file
    );

    const res =   await  axios.post(url+"/post", formData,{headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      'Authorization': 'Bearer '+ jwtToken
  }})
    console.log(enteredDescription);
    resetInput();
    resetTitle();
    resetGenre();
  };

  const enteredDescriptionClasses = isEnteredDescriptionInValid
    ? "form-control invalid"
    : "form-control";

  const enteredTitleClasses = isEnteredTitleInValid
    ? "form-control invalid"
    : "form-control";

    const enteredGenreClasses = isenteredGenreInValid
    ? "form-control invalid"
    : "form-control";
    

  return (
    <form onSubmit={formSubmitHandler} className={classes.new}>
      <div className={enteredDescriptionClasses}>
        <textarea
          type="text"
          id="name"
          onChange={inputChangeHandler}
          value={enteredDescription}
          onBlur={inputBlurHandler}
          placeholder="What's happening"
          rows="4"
        />
      </div>
      <div className={enteredTitleClasses} style={{width: '45%'}}>
        <input
          type="text"
          id="name"
          onChange={enteredTitleChangeHandler}
          value={enteredTitle}
          onBlur={enteredTitleBlurHandler}
          placeholder="Title"
        />
        {/* {isEnteredTitleInValid && (
          <p className="error-text">required</p>
        )} */}
      </div>
      <div className={enteredGenreClasses} style={{width:"45%"}}>
        <select
          type="text"
          id="name"
          onChange={enteredGenreChangeHandler}
          value={enteredGenre}
          onBlur={enteredGenreBlurHandler}
        >
           <option value="null" hidden>Select Genre</option>
           <option value="R&B">R&B</option>
           <option value="Hip Hop">Hip Hop</option>
           <option value="Country">Country</option>
           <option value="House">House</option>
          </select>
      </div>
      <div className="form-control">
      <label htmlFor="name">Upload Track</label>
        <input
          type="file"
          id="file-upload"
          accept="audio/*"
          onChange={trackChangeHandler}
        />
      </div>
      <div className="form-control">
      <label htmlFor="name">Upload Cover</label>
        <input
          type="file"
          id="file-upload"
          accept="image/*"
          onChange={coverChangeHandler}
        />
      </div>
      <div className="form-actions">
      <button type="button" disabled={!isFormValid} className={classes.secondary}>
          Back
        </button>
        <button type="submit">
          Post
        </button>
      </div>
    </form>
  );
};

export default NewPostForm;
