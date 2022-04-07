import React, { useState } from 'react';
import { Dialog, DialogTitle, Typography } from '@mui/material'
import axios from 'axios';
import { useSelector } from "react-redux";
import useInput from "../../hooks/use-input";
import { url } from "../../utils/constants";
import classes from "../newPostForm/newPostForm.module.css";
import playButton from "../playBtn2.png";
import classes2 from "./SocialPost.module.css";
import soundImg from "../sound.jpeg";

function EditPostDialog({ open, onClose, post, updatePost }) {

    const user = useSelector(_state => _state.user);
    let jwtToken = `${user.jwtToken}`;
    const [track, setTrack] = useState(null);
    const [cover, setCover] = useState(null);
    const [postDetails, setPostDetails] = useState({ track: null, cover: null, description: post.description, title: post.title, genre: post.genre })

    const onInputChange = (e) => {
        setPostDetails({ ...postDetails, [e.target.name]: e.target.value })
    }

    const onFileSelected = (e) => {
        setPostDetails({ ...postDetails, [e.target.name]: e.target.files[0] })
    }

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

    const formSubmitHandler = async (event) => {
        event.preventDefault();

       
        const json = {
            postId: post.postId,
            description: postDetails.description,
            genre: postDetails.genre,
            title: postDetails.title
        }

        const formData = new FormData();
        formData.append(
            'json', JSON.stringify(json)
        );
        formData.append(
            'picture', postDetails.cover
        );
        let _file = null;
        if (postDetails.track && track.blob) {
            _file = new File([postDetails.track.blob], "audio.mp3");
        } else if (typeof track == "string") {
            _file = new File([new Blob(postDetails.track.substring(5))], "audio.mp3");
        } else {
            _file = postDetails.track;
        }

        formData.append(
            'track', _file
        );

        const updatedPost = await axios.put(url + "/post", formData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
                'Authorization': 'Bearer ' + jwtToken
            }
        })
        if(updatedPost){
            updatePost(updatedPost.data);
            onClose();
        }
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
        <Dialog open={open} onClose={onClose}>
            <Typography variant='h5' style={{ textAlign: 'center', margin: '10px' }}>Edit Post</Typography>

            <form onSubmit={formSubmitHandler} className={classes.new}>
                <div className={enteredDescriptionClasses}>
                    <textarea
                        type="text"
                        name="description"
                        onChange={onInputChange}
                        value={postDetails.description}
                        placeholder="What's happening"
                        rows="4"
                    />
                </div>
                <div className={enteredTitleClasses} >
                    <input
                        type="text"
                        name="title"
                        onChange={onInputChange}
                        value={postDetails.title}
                        placeholder="Title"
                    />
                    {/* {isEnteredTitleInValid && (
          <p className="error-text">required</p>
        )} */}
                </div>
                <div className={enteredGenreClasses} >
                    <select
                        type="text"
                        name="genre"
                        onChange={onInputChange}
                        value={postDetails.genre}
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
                    {
                        post.trackFileName && (
                            <img src={soundImg} width='120px' />
                        )
                    }
                    <input
                        type="file"
                        name="track"
                        accept="audio/*"
                        onChange={onFileSelected}
                    />
                </div>
                <div className="form-control">
                    <label htmlFor="name">Upload Cover</label>
                    {
                        (postDetails.cover || post.pictureFileName) && (
                            <img src={postDetails.cover ? URL.createObjectURL(postDetails.cover) : post.pictureFileName} width='150px' />
                        )
                    }
                    <input
                        type="file"
                        name="cover"
                        accept="image/*"
                        onChange={onFileSelected}
                    />
                </div>
                <div className="form-control" style={{ width: '400px', display: 'flex', justifyContent: 'center' }}>
                    <button type="button" disabled={!isFormValid} className={classes.secondary} onClick={onClose}>
                        Cancel
                    </button>
                    &nbsp;&nbsp;
                    <button type="submit">
                        Update
                    </button>
                </div>
            </form>
        </Dialog>
    )
}

export default EditPostDialog;