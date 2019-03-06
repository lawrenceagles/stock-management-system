# vetiva

#### How to run express server
In your command line tool (CLI), after you clone the repository or pull. Type `cd backend` or go into the backend folder manually. Type the command node app to start the server. If successful, you should see: **"localhost server started on 3004"** on your terminal. And once the app connects with Mongodb locally or on Mlab, you should see: **"Mongodb now connected"**. To exit press `Ctrl C`.
#### Introduction
Allowed HTTPs requests:PUT     : To create resource 
POST                           : Update resource
GET                            : Get a resource or list of resources
DELETE                         : To delete resource
####Description Of Usual Server Responses
200 OK - the request was successful (some API calls may return 201 instead).
201 Created - the request was successful and a resource was created.
204 No Content - the request was successful but there is no representation to return (i.e. the response is empty).
400 Bad Request - the request could not be understood or was missing required parameters.
401 Unauthorized - authentication failed or user doesn't have permissions for requested operation.
403 Forbidden - access denied.404 Not Found - resource was not found.
500 Internal Server Error, means that server cannot process the request for an unknown reason. 
##User
User attributes
id (Number)
First (String) 
Last  (String) 
email id of the user.

# User Collection within users
##List all users##
Method used is 'GET' the url is http://localhost:3004/users/list?page=0
Retrieve paginated list of users is achieved by changing the page number on the url
Create a User
Method used is 'POST' the url is http://localhost:3004/users/list?page=0
User A single User object with all its details
Retrieve a User
Update a User
Update user details
Remove a User

