const styles={
   fontSize: 13
};
const Footer = () => {
  return (
    <div className="mt-5 ml-10 flex felx-row ">
        <div className="flex flex-row" style={{flexDirection: 'row', marginLeft: 'auto'}}>
          <div className="m-3 mr-48" >
            <text style={{ fontWeight: 'bold' }}>About us</text>
            <p className=' hover:underline' style={{ fontSize: 13 }}>What's OpenBeats</p>
            <p className=' hover:underline' style={{ fontSize: 13 }}>Carrers</p>
            <p className=' hover:underline' style={{ fontSize: 13 }}>Help</p>
            </div>
          <div className="m-3 mr-48" >
            <text style={{ fontWeight: 'bold' }}>Policies</text>
            <p className=' hover:underline' style={{ fontSize: 13 }}>Copyright & trademark</p>
            <p className=' hover:underline' style={{ fontSize: 13 }}> Terms of service</p>
            
            </div>
          <div className="m-3 mr-24" >
            <text style={{ fontWeight: 'bold' }}>More info</text>
            <p className=' hover:underline' style={styles}>For business</p>
            <p className=' hover:underline' style={styles}>For developers</p>
            
            </div>
        </div>
    </div>
    
  );
};


export default Footer;
