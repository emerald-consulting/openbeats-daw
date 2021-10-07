import React from "react";

import logo from '../openbeats_notype-45.png';
import gif from '../landing-gif.gif';



const Test = () => {
    return (

    //     <div style={{ backgroundImage: `url(${gif})` ,backgroundsize:'cover',backgroundposition: 'center',backgroundRepeat:'no-repeat' }} > 
    //     Hello World
    //   </div>
        <div style={{ backgroundImage: `url(${gif})` ,backgroundSize:'cover',height:'100vh',backgroundRepeat:'no-repeat' }} > 
            <h1  className="text-gr4 text-6xl">m</h1>
            <button className={`bg-gr2 hover:bg-gr3 text-white font-bold py-2 px-4 rounded`}>
                <p>Click to JAM</p>
            </button>
        </div>

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