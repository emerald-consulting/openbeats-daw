import "./App.css";
import HomePage from "./components/landing/HomePage";
import { Switch, Route } from "react-router-dom";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
import About from "./components/about/About";
import Dashboard from "./components/dashboard/Dashboard";
import Test from "./components/test/Test";
// import Audio from "./components/daw/audio/Audio";
import Pianoui from "./components/daw/pianoui/Pianoui";
import Daw from "./components/daw/Daw";

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faCheckSquare, fas , faUserEdit, faUser } from '@fortawesome/free-solid-svg-icons'
import Confirmation from "./components/signup/Confirmation";
library.add(fab, faCheckSquare, fas ,faUserEdit, faUser)

function App() {
  return (
    <>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/about" component={About} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/confirmation" component={Confirmation} />
        <Route path="/test" component={Test} />
        <Route path="/daw" component={Daw} />
      </Switch>
    </>
  );
}

export default App;
