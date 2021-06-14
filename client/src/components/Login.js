import React,{useState,useContext} from 'react'
import {UserContext} from "../UserContext"
import { makeStyles,Card,Button,TextField } from "@material-ui/core";
import Axios from "../axios";
import {Link,Route,Redirect,useHistory} from 'react-router-dom'
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

const Login = (props) => {
    const {response,setResponse} = useContext(UserContext)
    const history = useHistory()
    const classes = useStyles();
const [loginDetail,setLoginDetail] = useState({
  userName :"",
    password:""
})

const handleChange = (e)=>{
const{name,value} = e.target
setLoginDetail(preval => {return {...preval,[name]:value}})
}


const handleSubmit = (e)=>{
  e.preventDefault()
  Axios({
    method:'POST',
    data:loginDetail,
    url:"loginUser",
    withCredentials: true,
  }).then((res) => {
    setResponse(res)
  history.push(`/home/${res.data.user._id}`)})
.catch( e=> console.log("error:::",e))
}


  return(
 
      <Card className={classes.card}>
      <h3 className={classes.heading}>Login</h3>
     
        <form className={classes.root} noValidate >
        <TextField className={classes.textField}  onChange={handleChange} label="Email" type="email" name="userName" variant="outlined" required/>

        <TextField className={classes.textField} id="outlined-basic" onChange={handleChange} label="Password" name="password" type="password" variant="outlined" required/>
        <Button className={classes.button} variant="contained" color="primary" onClick={handleSubmit}>
        Log in
      </Button>
       </form>
{/* 
       <h5>OR</h5>

       <Button variant="contained" color="primary" className={classes.button} href="/auth/google" onClick={()=> Axios.get('/auth/google')}> 
        Continue with Google
      </Button> */}
      <hr className={classes.line}></hr>
    <h6 className={classes.heading}>Not Signed-in yet? <a href="/signin">Signin</a> now</h6>
      </Card>
   
   )
  }
 

export default Login