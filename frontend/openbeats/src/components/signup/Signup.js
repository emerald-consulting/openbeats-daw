import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from "react-router-dom";

const Signup = () => {
  const handleFormSubmit = (e) => {
      e.preventDefault();

      let email = e.target.elements.email?.value;
      let password = e.target.elements.password?.value;

      console.log(email, password);
  };
  return (
      <div className='h-screen flex bg-gray-bg1 flex-col'>
          <div className='w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-3 px-5'>
              <h1 className='text-2xl font-medium text-primary mt-4 mb-12 text-center'>
                  Ready to take a free trial?
              </h1>

              <form onSubmit={handleFormSubmit}>
                  <div className='flex flex-row'>
                      {/* <label htmlFor='email'>Email</label> */}
                      <input
                          type='text'
                          className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                          id='fname'
                          placeholder='First Name'
                      />
                      <div className="px-1"></div>
                      <input
                          type='text'
                          className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                          id='lname'
                          placeholder='Last Name'
                      />
                  </div>
                  <div>
                      {/* <label htmlFor='email'>Email</label> */}
                      <input
                          type='email'
                          className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                          id='email'
                          placeholder='Email'
                      />
                  </div>
                  <div>
                      {/* <label htmlFor='password'>Password</label> */}
                      <input
                          type='password'
                          className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                          id='password'
                          placeholder='Password'
                      />
                  </div>
                  <div>
                      {/* <label htmlFor='password'>Password</label> */}
                      <input
                          type='password'
                          className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                          id='cpassword'
                          placeholder='Confirm Password'
                      />
                  </div>

                  <div className='flex justify-center items-center mt-6'>
                      <button
                          className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded`}
                      >
                          Sign-Up
                      </button>
                      <div className='p-4'>Already a member? Login <Link to='/login' className='underline hover:text-gray-400'>here</Link></div>
                  </div>
              </form>
          </div>
          <div className='w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-3 px-5 flex justify-center items-center mt-6 flex-col'>
            <div>or sign-up using</div>
            <div className='flex flex-row'>
              <div className='p-4 hover:text-gray-400'><FontAwesomeIcon icon={['fab', 'apple']} /></div>
              <div className='p-4 hover:text-gray-400'><FontAwesomeIcon icon={['fab', 'spotify']} /></div>
              <div className='p-4 hover:text-gray-400'><FontAwesomeIcon icon={['fab', 'google']} /></div>
            </div>
          </div>
      </div>
  );
};

export default Signup;
