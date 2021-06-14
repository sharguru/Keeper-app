import React ,{useEffect,useContext,useState}from 'react'
import CreateArea from "./CreateArea";
import Axios from "../axios"
import { UserContext } from "../UserContext";
import Note from "./Note"
import {useHistory} from 'react-router-dom'


const Dashboard = () => {
    const {response ,setResponse}  = useContext(UserContext)
    const history = useHistory()
    const [notes, setNotes] = useState([response.data.user.notes]);

    useEffect(() => {
       fetchNotes()
       
    }, [notes])
 

    const fetchNotes = () =>{
        Axios.get(`/home/${response.data.user._id}`).then(res => {
         setNotes(res.data[0].notes)}
          )
        .catch(e => console.log(e))
    }
    function addNote(newNote) {
        setNotes(prevNotes => {
            return [...prevNotes, newNote];
          });
        Axios({
            method:'POST', 
            url:`/home/${response.data.user._id}`,
            data : newNote,

        }).then (res => console.log(res))
        .catch ( e => console.log(e))
        
      }
    
      function deleteNote(noteId) {
       
        Axios.delete(`/home/${response.data.user._id}/${noteId}` )
        .then(res =>{
            console.log("delete res :", res);
        })
        .catch(err => console.log("Delete Error :", err))
     } 

     const logout = ()=>{
      Axios.get("/logout").then(res => res.data === "Successfull Logout" && history.push("/") ).catch(e => console.log(e) )
     }
    return (
       
        <>
        <button className="logoutButton" onClick={logout}>Logout</button>
        <CreateArea  onAdd = {addNote}/>
        
        {notes.map((noteItem, index) => {
           return (
             <Note
               key={index}
               id={noteItem._id}
               title={noteItem.title}
               content={noteItem.content}
               onDelete={deleteNote}
             />
           );
         })}
         </>
    )
}

export default Dashboard
