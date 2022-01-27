# FileStore_CloudWiry_Hackathon_2022
For this hackathon, I created a Blob server that receives and stores files directly on the server using FastAPI and MongoDB. You may upload, delete, rename, and distribute files using this API. I've also created a React app that connects to the API and allows you to conduct these functions on the web.

Backend FastAPI is deployed on Heroku: 
https://simple-blob-cloudwiry.herokuapp.com/docs

Frontend React site is deployed on Netlify:
https://filestore.netlify.app/

**IMPLEMENTATION:**

_**CheckPoint A: User authentication and session management**_

![image](https://user-images.githubusercontent.com/45164745/151287211-7e4c9cce-1fea-4aee-b823-93fa785023ec.png)

On Atlas, I have a mongodb database with a users collection that comprises documents with fields **username(string), password(string), files_created(list), and shared_with_me (list)**. The locations of the files created by the user are pushed into a list in MongoDB, but the files themselves are not saved there.  A post request to route (‘/’) will create a new user.

_**CheckPoint B: Implementation of the blob storage server**_

![image](https://user-images.githubusercontent.com/45164745/151287414-cb58ea13-ccca-41f0-a19f-6d4d333410e2.png)
**Upload File:**
 Files posted by the user are kept in a folder called after the user's username. This is accomplished with the help of Python's **shutil package**. In MongoDB, the file location is pushed into the files_created list under the user's document.

**Rename/Delete File:**
	The **os library** is used to rename and delete files on the server. The file locations in the files_created and shared_with_me lists are also updated in MongoDB.

**Download File:**
	The requested file can be acquired from the response of an api call using the **starlette library** in python.

**Share File:**
	When sharing files, the location of the file will be appended to the shared_to_me list in MongoDB present in the document of the person to whom the file is shared.
