import React from 'react';
import { useContext } from 'react';
import { LoginContext,UserData } from '../dataStore/Context';
import { Navigate } from 'react-router';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

const dataURL="https://simple-blob-cloudwiry.herokuapp.com";

const Home = () => {

  const [shareto,setShareto] = useState('');
  const [filerename,setFilename] = useState('');
  const [selectedFile, setSelectedFile] = useState();
  const {userData, setUserData}= useContext(UserData);
  const {auth, setAuth} = useContext(LoginContext)

  
  console.log(userData)
  const refreshData = () => {
    axios.get(`${dataURL}/myfiles/${userData.data[0].username}`).then((response)=>{
      setUserData(response.data);
      console.log(userData);
    })
  }
  const changeHandler = ({target: {files} }) => {
		setSelectedFile(files[0]);
	};

 const uploadFile = (event) => {
  var formData = new FormData();
  formData.append('file',selectedFile);
  console.log(formData);
    console.log('File uploaded')
    axios.post(`${dataURL}/file/${userData.data[0].username}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
  }).then((response)=>{
    setUserData(response.data);
  })
    event.preventDefault();
  }
  if (!auth) return <Navigate to="/"></Navigate>
  return <div>
    <nav class="navbar navbar-light bg-dark text-light">


   <div style={{fontWeight:'bold',fontSize:"35px"}}><img src="https://www.clipartmax.com/png/middle/193-1932572_computer-icons-document-file-format-icon-design-new-file-icon-png.png" width="30" height="30" alt="" />  File Store</div> 
   <div>
   <button type="button" class="btn btn-warning" onClick={(e)=> setAuth(false)}>Logout</button>&nbsp;</div>
</nav>
    {auth?<h1>Welcome {(userData.data[0].username).toUpperCase()},</h1>:<h1>You are not logged in</h1>}

<div class="row">
  <div class="col-sm-3" align="center"></div>
  <div class="col-sm-6">
    <div class="card">
  <div class="card-header">
    <h3>Upload Files</h3>
  </div>

  <div class="card-body">
    <h5 class="card-title">Choose a file from your PC</h5>
    <p class="card-text">Once you upload you can download/share files to other's in <b>MY FILES</b> section</p>
    <form onSubmit={uploadFile}>
    <input class="form-control" type="file" id="formFile" onChange={changeHandler}/>
    <br></br>
    <button class="btn btn-success" type="submit">Upload</button>
    </form>
  </div>

</div>
</div>
<div class="col-sm-3" align="center"><button class="btn btn-dark" onClick={(e)=>{refreshData()}} >Reload Files🔄</button></div>
</div>
<br></br><br></br>
<div class="row">

<div class="col-sm-6"><div class="card-header">
<h3> MY FILES</h3>
  </div>


{userData.data[0].files_created.map(name => (
  <div class="card">
  <div class="card-body">
    <h5 class="card-title">{name.split('/')[1]}</h5>
  <div> <input type="text" placeholder='resume.docs' onChange={(e)=> setFilename(e.target.value)}></input>&nbsp;<button type="button" class="btn btn-warning" onClick={(e)=>{axios.patch(`${dataURL}/file/rename/${userData.data[0].username},${name.split('/')[1]},${filerename}`).then((response)=>{
     refreshData();
    console.log(response.data)
  })}}>Rename file</button></div>
  <br></br>
  {/* DELETING A FILE */}
  <button type="button" class="btn btn-danger" onClick={(e)=>{axios.delete(`${dataURL}/file/delete/${userData.data[0].username},${name.split('/')[1]}`).then((response)=>{
    refreshData();
    console.log(response.data)
  })}}>Delete File</button>&nbsp;
  <a type="button" class="btn btn-success" target="_blank" href={`${dataURL}/file/download/${name.split('/')[0]},${name.split('/')[1]}`}>Download File</a><br></br><br></br>
  <div> <input type="text" placeholder='rahul' key={name} onChange={(e)=> setShareto(e.target.value)}></input>&nbsp;<button type="button" class="btn btn-primary" onClick={(e)=>{axios.patch(`${dataURL}/file/share/${userData.data[0].username},${shareto},${name.split('/')[1]}`).then((response)=>{
    console.log(response.data)
  })}}>Share</button></div>
  </div>
</div>
))}
</div>
<div class="col-sm-6">
<div class="card-header">
<h3> SHARED WITH ME</h3>
  </div>
{userData.data[0].shared_to_me.map(name => (
  <div class="card">
    
  <div class="card-body">
    <h5 class="card-title">{name.split('/')[1]}</h5>

  <br></br>
  
  <a type="button" class="btn btn-success" target="_blank" href={`${dataURL}/file/download/${name.split('/')[0]},${name.split('/')[1]}`}>Download File</a><br></br><br></br>
  <div> <input type="text" placeholder='rahul' ></input>&nbsp;<button type="button" class="btn btn-primary">Share</button></div>
  </div>
</div>

))}
</div>
</div>
  </div>;
};

export default Home;
