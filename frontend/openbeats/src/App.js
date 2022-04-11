import "./App.css";
import HomePage from "./components/landing/HomePage";
import { Switch, Route } from "react-router-dom";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
import About from "./components/about/About";
import Dashboard from "./components/dashboard/Dashboard";
import Test from "./components/test/Test";
import Daw from "./components/daw/Daw";
import ChatRoom from "./components/chatRoom/ChatRoom";

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faCheckSquare, fas , faUserEdit, faUser } from '@fortawesome/free-solid-svg-icons'
import Confirmation from "./components/signup/Confirmation";
import SocialHomePage from "./components/pages/SocialHomePage";
import Layout from "./components/UI/Layout/Layout";
import ProfilePage from "./components/pages/ProfilePage";

library.add(fab, faCheckSquare, fas ,faUserEdit, faUser)

function App() {
  return (
    <>
    <Layout>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/about" component={About} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/confirmation" component={Confirmation} />
        <Route path="/test" component={Test} />
        <Route path="/daw" component={Daw} />
        <Route path="/home" component={SocialHomePage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/inbox" component={ChatRoom} />
      </Switch>
      </Layout>
    </>
  );
}

export default App;
