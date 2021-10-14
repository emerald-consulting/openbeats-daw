const DATA = [
    { letter: 'Q',
      keycode: 81,
      id: 'Open-HH',
       url: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3'
    },
    { letter: 'W',
      keycode: 87,
      id: 'Closed-HH',
      url: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3'
    },
    { letter: 'E',
      keycode: 69,
      id: 'Kick-and-Hat',
      url: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3'
    },
    { letter: 'A',
      keycode: 65,
      id: 'Punchy-Kick',
      url: 'https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3'
    },
    { letter: 'S',
      keycode: 83,
      id: 'Kick',
      url: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3'
    },
    { letter: 'D',
      keycode: 68,
      id: 'Snare',
      url: 'https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3'
    },
    { letter: 'Z',
      keycode: 90,
      id: 'Side-Stick',
      url: 'https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3'
    },
    { letter: 'X',
      keycode: 88,
      id: 'Clap',
      url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3'
    },
    { letter: 'C',
      keycode: 67,
      id: 'Shaker',
      url: 'https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3'
    },
  ];
  
  const onStyle = {transform: "scale(0.95)", boxShadow: "1px 1px 4px 4px cyan, -1px -1px 4px 4px cyan"};
  const offStyle = {transform: "scale(1)", boxShadow: "none"};
  
  class Pad extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        playing: false
      };
      this.handleKeyPress = this.handleKeyPress.bind(this);
      this.onPlay = this.onPlay.bind(this);
    }
    
    componentDidMount() {
      document.addEventListener('keydown', this.handleKeyPress);
    }
    
    componentWillUnmount() {
      document.removeEventListener('keydown', this.handleKeyPress);
    }
    
    handleKeyPress (e) {
      if (e.keyCode === this.props.pad.keycode) {
        this.onPlay();
      }
    }
    
    onPlay () {
      if(this.props.power) {
        const sound = document.getElementById(this.props.pad.letter);
        sound.currentTime = 0;
        sound.volume = this.props.volume;
        sound.play();
        this.props.updateDisplay(this.props.pad.id);
        this.setState({playing: true})
        setTimeout(() => {
          this.setState({playing: false})
        }, 100);
      }
    }
    
    render () {
      const style = !this.props.power ? {background: '#476b68'} : this.state.playing ? onStyle : offStyle;
      return (
        <div style={style} className="outer-drum-pad">
          <div className="drum-pad"
               id={this.props.pad.id}
               onClick={this.onPlay}
          >
            <audio id={this.props.pad.letter} 
                   src={this.props.pad.url}
                   className="clip"
              >
            </audio>
            {this.props.pad.letter}
          </div>
        </div>
      )
    }
  }
  
  class SidePanel extends React.Component {
    constructor(props){
      super(props);
    }
    
    render () {
      
      const style = this.props.power ? {background: "#0ad82c"} : {background: "#063d0f", boxShadow: "none"};
      
      return (
        <div className="side-panel">
          <div className="label">Drum Machine 3000</div>
          <div style={this.props.colorStyle} className="display" id="display">{this.props.currentSound}</div>
          <div>
            <p>Power</p>
            <button style={style} onClick={this.props.togglePower}></button>
          </div>
          <div>
            <p>Volume</p>
            <input value={this.props.volumeInput} 
                   type="range"
                   min="1" 
                   max="100" 
                   onChange={this.props.changeVolume}>
            </input>
          </div>
          <div className="speakers">
            <hr/>
            <hr/>
            <hr/>
            <hr/>
            <hr/>
          </div>
        </div>
      )
    } 
  }
  
  class App extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        currentSound: '',
        power: true,
        volumeInput: 50,
        volume: 0.5
      }  
      this.updateDisplay = this.updateDisplay.bind(this);
      this.togglePower = this.togglePower.bind(this);
      this.changeVolume = this.changeVolume.bind(this);
    }
    
    updateDisplay (id) {
      this.setState({currentSound: id});
    }
    
    togglePower () {
      const message = !this.state.power && 'Welcome';
      this.setState({power: !this.state.power, 
                     currentSound: message});
      setTimeout(()=> {
        this.setState({ currentSound: ''});
      }, 1500);
    }
    
    changeVolume (e) {
      const volume = e.target.value / 100;
      const message = "Volume: " + e.target.value;
      this.setState({volume: volume, 
                     volumeInput: e.target.value,
                     currentSound: message})
    }
    
    render () {
      
      const colorStyle = this.state.power ? {background: '#1ec8ce'} : {background: '#476b68'};
      
      const pads = this.props.data.map((pad, i) => {
        return <Pad key={i} 
                    pad={pad} 
                    updateDisplay={this.updateDisplay} 
                    power={this.state.power} 
                    volume={this.state.volume} 
                    style={colorStyle}
                 />
        });
        
      return (
        <div className="container">
          <div className="machine">
            <div className="pads">
              {pads}
            </div>
            <SidePanel volumeInput={this.state.volumeInput}
                       togglePower={this.togglePower}
                       changeVolume={this.changeVolume}
                       currentSound={this.state.currentSound}   
                       power={this.state.power}
                       colorStyle={colorStyle}
              />
          </div>
        </div>
      )
    }
  }
  
  const app = document.querySelector('#drum-machine');
  ReactDOM.render(<App data={DATA}/>, app);