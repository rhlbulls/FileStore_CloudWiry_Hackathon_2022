import React from 'react';
import { useState } from 'react';
import { LoginContext,UserData } from '../dataStore/Context';
import axios from 'axios';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';


const dataURL="https://simple-blob-cloudwiry.herokuapp.com";

const Lock = () => {
  const {auth, setAuth} = useContext(LoginContext);
  const {userData, setUserData}= useContext(UserData);
    const [username, setUser] = useState("");
    const [password, setPass] = useState("");
    const [newUser, setNewUser] = useState(false);
  
    const handleSubmit = (event) => {
        event.preventDefault();
        if(newUser==true){
        axios.post(`${dataURL}/`,{
          "username": username,
  "password": password,
  "files_created": [],
  "shared_to_me": []
        }).then((response) => {
          setUserData(response.data)
        setAuth(response.data['authenticated'])
    });
  }else{
    axios.get(`${dataURL}/verify/${username},${password}`).then((response) => {
      setUserData(response.data)
      setAuth(response.data['authenticated'])
  });
  }
      }
      if(auth) return <Navigate to='/home'></Navigate>
  return <div>
    <div class="row">
  <div class="col-3"></div>
  <div class="col-6">
  
    <form onSubmit={handleSubmit} class="card" style={{padding:"20px"}}>
    {newUser?<h3>Create Account</h3>:<h3>Login</h3>}
<div class="form-group">
<label >Username</label>
<input  class="form-control" value={username} onChange={(e)=> setUser(e.target.value)} />
</div>
<div class="form-group">
<label >Password</label>
<input type="password" class="form-control" value={password} onChange={(e)=> setPass(e.target.value)}  />
</div><br></br>
{newUser?<button type="submit" class="btn btn-danger" >Signup</button>:<button type="submit" class="btn btn-success" >Login</button>}
&nbsp;
<div>
{newUser?<button class="btn btn-danger" onClick={(e)=>setNewUser(false)}>Already have an account? click here</button>:<button class="btn btn-success" onClick={(e)=>setNewUser(true)}>New User? click here</button>}</div>
</form>

</div>
</div>

</div>;
};

export default Lock;
