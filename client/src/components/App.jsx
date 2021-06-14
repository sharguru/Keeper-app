import React, { useState ,useContext} from "react";
import {UserContext} from "../UserContext"
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import Login from "./Login";
import Signin from "./Signin";
import CreateArea from "./CreateArea";
import { BrowserRouter as Router, Route, Link ,Redirect} from "react-router-dom";
import { Button } from "@material-ui/core";
import Axios from '../axios'
import Dashboard from "../components/Dashboard";
function App() {
  const [response,setResponse] = useState({})
   
  // console.log("response from app.js :",response)
  return (
    <div>
      <Header />
       <UserContext.Provider value={{response,setResponse}}> 
<Router>
<Route exact path="/">
    <Redirect to="/login" />
</Route>
<Route path="/login" def component={Login} />
<Route path="/signin" exact component={Signin} />


     <Route path="/home/:userId" exact >
          <Dashboard resData = {response.data}/>
  
     </Route> 
      
     

</Router>
</UserContext.Provider>
      <Footer />
    </div>
  );
}

export default App;
