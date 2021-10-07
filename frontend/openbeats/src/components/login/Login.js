import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from "react-router-dom";

const Login = () => {
  const handleFormSubmit = (e) => {
      e.preventDefault();

      let email = e.target.elements.email?.value;
      let password = e.target.elements.password?.value;

      console.log(email, password);
  };
  return (
      <div className='h-screen flex bg-green-700 flex-col'>
          <div className='bg-green-300 w-full max-w-md m-auto bg-white rounded-lg border border-gr4 shadow-default py-10 px-16'>
              <h1 className='text-2xl font-medium text-primary mt-4 mb-12 text-center'>
                  Log in to your account
              </h1>

              <form onSubmit={handleFormSubmit}>
                  <div>
                      {/* <label htmlFor='email'>Email</label> */}
                      <input
                          type='email'
                          className={`w-full p-2 text-primary border border-gr4 rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                          id='email'
                          placeholder='Email'
                      />
                  </div>
                  <div>
                      {/* <label htmlFor='password'>Password</label> */}
                      <input
                          type='password'
                          className={`w-full p-2 text-primary border border-gr4 rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                          id='password'
                          placeholder='Password'
                      />
                  </div>

                  <div className='flex justify-center items-center mt-6'>
                      <button
                          className={`bg-gr3 hover:bg-gr4 text-white font-bold py-2 px-4 rounded`}
                      >
                          Login
                      </button>
                      <div className='p-4'>Not a member? Register <Link to='/signup' className='underline hover:text-gray-400'>here</Link></div>
                  </div>
              </form>
          </div>
          <div className=' bg-green-300 w-full max-w-md m-auto bg-white rounded-lg border border-gr4 shadow-default py-10 px-16 flex justify-center items-center mt-6 flex-col'>
            <div>or login using</div>
            <div className='flex flex-row border-gr4'>
              <div className='p-4 hover:text-blue-700'><FontAwesomeIcon icon={['fab', 'apple']} /></div>
              <div className='p-4 hover:text-blue-400'><FontAwesomeIcon icon={['fab', 'spotify']} /></div>
              <div className='p-4 hover:text-blue-400'><FontAwesomeIcon icon={['fab', 'google']} /></div>
            </div>
          </div>
      </div>
  );
};

export default Login;
