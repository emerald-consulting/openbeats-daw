import React from 'react'
import { Link } from "react-router-dom";

const Confirmation = () => {
    return (
        <div className='h-screen flex bg-gray-bg1 flex-col'>
          <div className='w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-3 px-5'>
              
              <h1 class="text-4xl pt-2 font-mono">Email verified</h1>
              <h1 class="text-2xl pt-2 font-mono">Please <Link to='/login' className='underline hover:text-gray-400'>Login here</Link></h1>
          </div>
      </div>
    )
}

export default Confirmation
