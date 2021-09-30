import "./App.css";
import HomePage from "./components/landing/HomePage";
import { Switch, Route } from "react-router-dom";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faCheckSquare, faCoffee } from '@fortawesome/free-solid-svg-icons'
library.add(fab, faCheckSquare, faCoffee)

function App() {
  return (
    <>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
      </Switch>
    </>
  );
}

export default App;
