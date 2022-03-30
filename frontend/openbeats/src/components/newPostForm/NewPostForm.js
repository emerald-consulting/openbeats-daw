import useInput from "../../hooks/use-input";
import classes from "./newPostForm.module.css";

const NewPostForm = (props) => {
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
  }else{


  }

  const formSubmitHandler = (event) => {
    event.preventDefault();
    if (isEnteredDescriptionInValid) {
      return;
    }
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
           <option value="R&B" hidden>Select Genre</option>
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
          accept="audio/mp3,audio/*;capture=microphone"
        />
      </div>
      <div className="form-control">
      <label htmlFor="name">Upload Cover</label>
        <input
          type="file"
          id="file-upload"
          accept="image/*"
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
