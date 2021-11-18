import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from "react-router-dom";
import axios from "axios"
import LoadingOverlay from 'react-loading-overlay';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

// const url = "http://openbeatsdaw-env.eba-4gscs2mn.us-east-2.elasticbeanstalk.com"
const url = "http://192.168.1.166:5000"

const Signup = () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [message, setMessage] = useState(null);
    const [user, setUser] = useState({});
    
    const handleOnclose = () =>{
        setError(null)
        setMessage(null)

    }

    const handleFormSubmit = (e) => {
        
        
        setError(null)
        setMessage(null)
        setUser({})
        e.preventDefault();

        let email = e.target.elements.email?.value;
        let password = e.target.elements.password?.value;
        let cpassword = e.target.elements.cpassword?.value;
        if(password != cpassword){
            setError("Passwords do not match. Please try again")
            return
        }
        setIsLoaded(true);
        let firstName=e.target.elements.fname?.value;
        let lastName=e.target.elements.lname?.value;
        let preferredName=e.target.elements.fname?.value;
        let subscriptionType='free';
        let emailVerified=false;
        let username=firstName;
        let formdata = JSON.stringify({
            emailId:email,
            username: username,
            password: password,
            firstName: firstName,
            lastName: lastName,
            preferredName: preferredName,
            subscriptionType: subscriptionType,
            emailVerified: emailVerified,
            })

        axios.post(url+"/createUser", formdata,{headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }}).then((response) => {
            if(response.data.status==207){
                setError(response.data.message)
            }
            else{
                setMessage(response.data.message)
                setUser(response.data.data)
            }
            
            setIsLoaded(false)
         })
        .catch((error)=>{
            console.log(error);
            setError(error)
            setIsLoaded(false)
        });
  };

  return (
    <LoadingOverlay
    active={isLoaded}
    spinner
    text='Please wait...'
    >
      <div className='h-screen flex bg-gray-bg1 flex-col'>
          <div className='w-full max-w-md m-auto bg-white rounded-lg border border-gr4 shadow-default py-3 px-5'>
              <h1 className='text-2xl font-medium text-primary mt-4 mb-12 text-center'>
                  Ready to take a free trial?
              </h1>

              <form onSubmit={handleFormSubmit}>
                  <div className='flex flex-row'>
                      {/* <label htmlFor='email'>Email</label> */}
                      <input
                          type='text'
                          className={`w-full p-2 text-primary border border-gr4 rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                          id='fname'
                          required
                          placeholder='First Name'
                      />
                      <div className="px-1"></div>
                      <input
                          type='text'
                          className={`w-full p-2 text-primary border border-gr4 rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                          id='lname'
                          required
                          placeholder='Last Name'
                      />
                  </div>
                  <div>
                      {/* <label htmlFor='email'>Email</label> */}
                      <input
                          type='email'
                          className={`w-full p-2 text-primary border border-gr4 rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                          id='email'
                          required
                          placeholder='Email'
                      />
                  </div>
                  <div>
                      {/* <label htmlFor='password'>Password</label> */}
                      <input
                          type='password'
                          className={`w-full p-2 text-primary border border-gr4 rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                          id='password'
                          name='password'
                          required
                          minLength={8}
                          placeholder='Password'
                      />
                  </div>
                  <div>
                      {/* <label htmlFor='password'>Password</label> */}
                      <input
                          type='password'
                          className={`w-full p-2 text-primary border border-gr4 rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                          id='cpassword'
                          name="cpassword"
                          required
                          minLength={8}
                          placeholder='Confirm Password'
                        />
                  </div>

                  <div className='flex justify-center items-center m-2'>
                      <button
                          className={`bg-gr2 hover:bg-gr3 text-white font-bold py-2 px-4 rounded`}
                      >
                            <p className={'text-white'}>Sign-Up</p>
                      </button>
                      <div className='p-4'>Already a member? Login <Link to='/signin' className='underline hover:text-gray-400'>here</Link></div>
                  </div>
              </form>
              {/* <div className="flex justify-center items-center m-2">
                <div className="px-4 text-blue-700"> {message?<Snackbar message="Success! Email verification link sent" open />:<Snackbar message=""/>}</div>
                <div className="px-4 text-color-err">{error?<Snackbar message={"Error! "+error} />:<Snackbar message=""/>}</div>
                
              </div> */}
              <Snackbar TransitionComponent="Fade" autoHideDuration={6000} 
                  action={ 
                    <IconButton 
                        aria-label="close"
                        color="inherit"
                        sx={{ p: 0.5 }}
                        onClick={handleOnclose}
                        >
                        <CloseIcon />
                    </IconButton>
                    }
                    onClose={handleOnclose} message="Success! Email verification link sent!! Open email to verify" open={message}/>
                <Snackbar TransitionComponent="Fade" autoHideDuration={6000} onClose={handleOnclose} 
                    action={ 
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            sx={{ p: 0.5 }}
                            onClick={handleOnclose}
                            >
                            <CloseIcon />
                        </IconButton>
                        }
                    message={"ERROR :"+error} open={error}/>
          </div>
          <div className='w-full max-w-md m-auto bg-white rounded-lg border border-gr4 shadow-default py-3 px-5 flex justify-center items-center mt-6 flex-col'>
            <div>or sign-up using</div>
            <div className='flex flex-row'>
              {/* <div className='p-4 hover:text-gray-400'><FontAwesomeIcon icon={['fab', 'apple']} /></div> */}
              <div className='p-4 hover:text-gray-400'><a href="http://openbeatsdaw-env.eba-4gscs2mn.us-east-2.elasticbeanstalk.com/oauth2/authorization/spotify"><FontAwesomeIcon icon={['fab', 'spotify']} /></a></div>
              {/* <div className='p-4 hover:text-gray-400'><FontAwesomeIcon icon={['fab', 'google']} /></div> */}
            </div>
          </div>
      </div>
    </LoadingOverlay>
  );
};

export default Signup;
