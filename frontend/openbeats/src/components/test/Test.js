import React from "react";
import { Link } from "react-router-dom";
import logo from '../openbeats_notype-45.png';
import gif from '../landing-gif.gif';



const Test = () => {
    return (

<view className="flex flex-row p-10 bg-gr1 h-screen">
<view className="p-5 mr-1 rounded bg-gr2" style={{ width: '25%' }}>
    <h1 className="text-5xl">user</h1>

</view>
<view className="p-5 rounded bg-gr2" style={{ width: '75%' }}>
    <h1 className="text-5xl pl-5">sessions</h1>
    <view className="flex flex-row  p-5" style={{ height: '95%' }} >
        <view className="p-10 mr-1 flex flex-col  rounded bg-gr3" style={{width: '50%' }}>
            <h1 className="text-2xl">Saved sessions</h1>
            <Link className="mt-7 p-2 text-white mr-7 bg-gr4 m-1  rounded" style={{fontSize:15}}  to="/about" >
            session 1
            </Link>
            <Link className="p-2 text-white  mr-7 bg-gr4 m-1  rounded" style={{fontSize:15}}  to="/about" >
            session 2
            </Link>
            <Link className="p-2 text-white  mr-7 bg-gr4 m-1  rounded" style={{fontSize:15}}  to="/about" >
            session 3
            </Link>
        </view>
        <view className=" p-5 flex flex-col rounded bg-gr3" style={{width: '50%' }}>
            <view className="p-5 mb-1 rounded bg-gr4 "><h1 className="text-2xl">create a session</h1>
            <form >
                <div >
                    <input
                        type='session'
                        className={`w-full p-2 text-primary  rounded-md outline-none text-sm transition duration-150 ease-in-out mb-2`}
                        id='sessionid'
                        placeholder='Enter session name'
                    />
                </div>

                <div className='flex items-center mt-1'>
                    <button className={`text-white bg-gr1  hover:bg-gr2 py-2 px-4 rounded`}>
                        Create new Session
                    </button>
                    
                </div>
            </form>
            </view>
            <view className="p-5 rounded bg-gr4"><h1 className="text-2xl">join a session</h1>
                <form >
                    <div>
                        <input
                            type='session_join'
                            className={`w-full p-2 text-primary  rounded-md outline-none text-sm transition duration-150 ease-in-out mb-2`}
                            id='session_url'
                            placeholder='Enter session url'
                        />
                    </div>

                    <div className='flex items-center mt-1'>
                        <button className={`bg-gr1 text-white hover:bg-gr2 py-2 px-4 rounded`}>
                            Join Session
                        </button>
                        
                    </div>
                </form>
            </view>
        </view>
    </view>

</view>
</view>
        
    );
};

export default Test;






















// const Test = () => {
//     return (
//         <View style={styles.container}>
//           <ImageBackground
//             style={styles.coverImage}
//             source={{
//               src: {logo},
//             }}>
//             <View style={styles.textView}>
//               <Text style={styles.imageText}>HAPPY MARRIED LIFE</Text>
//             </View>
//           </ImageBackground>
//         </View>
//       );

// };

// export default Test;




// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   coverImage: {
//     width: '100%',
//     height: 200,
//   },
//   textView: {
//     position: 'absolute',
//     justifyContent: 'center',
//     alignItems: 'center',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
//   imageText: {
//     fontSize: 20,
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });