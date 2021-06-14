import React, { useState ,useContext} from 'react'
import { makeStyles,Card,CardActions,CardContent,Button,Typography,TextField } from "@material-ui/core";
import Axios from "../axios";
import {Link,Route,Redirect,useHistory} from 'react-router-dom'
import {UserContext} from "../UserContext"

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
  },
  {
      card:{
          width :"30%",
          height:"40%",
          textAlign: "center",
          margin:"55px auto"
      },
      textField:{
          margin:"1rem",
          width:"70%"
      },heading:{
          margin:"1rem 0 5px",
      },button:{
          display:'block',
          width:'70%',
          textAlign:'center',
          margin:'1rem auto',
      },
      line:{
          width:"40%",
          margin:'auto',
      }
    
  }
  ));

const Signin = (props) => {
  const {response,setResponse} = useContext(UserContext)
  const history = useHistory()

    const classes = useStyles();
    const[signinDetail,setSigninDetail] = useState({
      userName:"",
        password:""
    })
// const redirect = ()=>{
//   return <Redirect to="/login" />
// }
  const handleClick = () =>{
    console.log(response);
    Axios({
      method:"POST",
      url:"/signin",
      data:signinDetail,
      withCredentials:true 
    }).then(res=>{
      setResponse(res)
      if(res.data.message === "User Created"){
        alert("Signin Successful! Login to continue")
         history.push("/login")
        }
      })
  .catch(e => console.log("error: ",e))
   
 
  }
  
    const handleChange =(e)=>{
        const {name,value} = e.target;
        setSigninDetail(preval =>{return {...preval,[name]:value}})
    }
  
    
  return(
      <Card className={classes.card}>
      <h3 className={classes.heading}>Sign-Up</h3>
        <form className={classes.root} noValidate autoComplete="off">
        <TextField className={classes.textField} onChange={handleChange} name="userName" label="Email" type="email" variant="outlined" required= "true"/>

        <TextField className={classes.textField} onChange={handleChange} id="outlined-basic" label="Password" type="password" name="password" variant="outlined" required= "true"/>
        <Button className={classes.button} variant="contained" color="primary"   onClick={handleClick}>
       sign up
      </Button>
       </form>
       {/* 
       for google authentication
       <h5>OR</h5>
       
       <Button variant="contained" color="primary" className={classes.button} onClick={()=> Axios.get("/auth/google")}>
        Sign up with Google 
      </Button>*/}
      <hr className={classes.line}></hr>
    <h6 className={classes.heading}>Already Signed in? <a href="/login">Login</a> to enter</h6>
      </Card>
   
   )
  
 }

export default Signin