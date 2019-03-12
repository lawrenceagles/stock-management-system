# vetiva

## Setup
Folders are now differentiated.

client/ contains the react app
server/ contains the node server

To work on any part you need to `cd` into it and run `npm install` 
After that you can run `npm start` and visit your browser.

Setup information from the root file will be provided soon.

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


In your command line tool (CLI), after you clone the repository or pull. Type `cd backend` or go into the backend folder manually. Type the command node app to start the server. If successful, you should see: **"localhost server started on 3004"** on your terminal. And once the app connects with Mongodb locally or on Mlab, you should see: **"Mongodb now connected"**. To exit press `Ctrl C`.

## The Routes

#### LOGIN: to login admin

Route: `localhost:3004/admin/login`

Data: 
```json
{
	"email":"law2452@gmail.com",
	"password":"###$eatles"
}
```

The password here is the default password for all admin. Atleast for now.
A token is created for the admin once he logs in. The full data becomes something like this:

```json
{
        "firstname": "Kelvin Adams",
        "lastname": "Kelvin",
        "username": "Adams",
        "email": "kelvinAdams@gmail.com",
        "phone": "+234-818-233-2222",
        "role": "observer",
        "tokens": [
            {
                "_id": "5c7e3859d5863730d86fdc96",
                "access": "auth",
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzdlMzg1OGQ1ODYzNzMwZDg2ZmRjOTUiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTUxNzc1ODMzfQ.X18xoGHmr5hwF4nAnicX9XMhECt_38PP-Nqeqe_vJ50"
            }
        ]
    }
    ```

#### LOGOUT: to logout admin

#### Required authentication: This operation requires a token (key: token) to be passed in the header. something like this:
`x-auth: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzdlMzg1OGQ1ODYzNzMwZDg2ZmRjOTUiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTUxNzc1ODMzfQ.X18xoGHmr5hwF4nAnicX9XMhECt_38PP-Nqeqe_vJ50` 

Without this the operation would fail.

Route: `localhost:3004/admin/logout`

Everything in the tokens array is delete so it is empty. So the data becomes something like this:

```json
 {
        "firstname": "Andrew",
        "lastname": "Mead",
        "username": "Amead",
        "email": "Amead@gmail.com",
        "phone": "+234-818-233-1111",
        "role": "manager",
        "tokens": []
    }
```



#### GET: to get all admin

Route `localhost:3004/admin` 

Data to receive: an array of admin data as below;

```json
{
        "firstname": "Kelvin Adams",
        "lastname": "Kelvin",
        "username": "Adams",
        "email": "kelvinAdams@gmail.com",
        "phone": "+234-818-233-2222",
        "role": "observer",
        "tokens": [
            {
                "_id": "5c7e3859d5863730d86fdc96",
                "access": "auth",
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzdlMzg1OGQ1ODYzNzMwZDg2ZmRjOTUiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTUxNzc1ODMzfQ.X18xoGHmr5hwF4nAnicX9XMhECt_38PP-Nqeqe_vJ50"
            }
        ]
    }
```

#### POST Registration: To register new admin

Route: `localhost:3004/admin`

#### Required authentication: This operation requires a token (key: token) to be passed in the header. something like this:
`x-auth: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzdlMzg1OGQ1ODYzNzMwZDg2ZmRjOTUiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTUxNzc1ODMzfQ.X18xoGHmr5hwF4nAnicX9XMhECt_38PP-Nqeqe_vJ50` 
Without this the operation would fail.

Data to be send: 
```json
{
	"firstname": "Lawrence",
	"lastname": "Eagles",
	"username": "law12345",
	"email": "law2452@gmail.com",
	"phone": "+234-818-233-2551",
	"role": "super_admin"
}
```

Data to receive: 
```json
{
    "firstname": "Lawrence",
    "lastname": "Eagles",
    "username": "law12345",
    "email": "law2452@gmail.com",
    "phone": "+234-818-233-2551",
    "role": "super_admin",
    "tokens": [
        {
            "_id": "5c7e3c9a45d8ce375cff0052",
            "access": "auth",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzdlM2M5YTQ1ZDhjZTM3NWNmZjAwNTEiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTUxNzc2OTIyfQ.AoC0rf29RLmvH4dUzttjpZ2dZMWKu_6K4rnxsfoe5OM"
        }
    ]
}
```

Note: The generation of tokens means the user is automatically logged in.

#### GET Route to get an admin

Route: `localhost:3004/admin/:id`

#### Required authentication: This operation requires a token (key: token) to be passed in the header. something like this:
`x-auth: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzdlMzg1OGQ1ODYzNzMwZDg2ZmRjOTUiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTUxNzc1ODMzfQ.X18xoGHmr5hwF4nAnicX9XMhECt_38PP-Nqeqe_vJ50` 
Without this the operation would fail.

Data to be sent: just the admin ID in the url example `localhost:3004/admin/5c7926fe1be3cc5e69c24163`

Data to receive: 
```json
{
    "firstname": "Andrew",
    "lastname": "Mead",
    "username": "Amead",
    "email": "Amead@gmail.com",
    "phone": "+234-818-233-1111",
    "role": "manager",
    "tokens": []
}
```

#### PATCH Route to update an admin

Route: `localhost:3004/admin/:id`

#### Required authentication: This operation requires a token (key: token) to be passed in the header. something like this:
`x-auth: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzdlMzg1OGQ1ODYzNzMwZDg2ZmRjOTUiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTUxNzc1ODMzfQ.X18xoGHmr5hwF4nAnicX9XMhECt_38PP-Nqeqe_vJ50` 
Without this the operation would fail.

Data to be sent: just the admin ID in the url example `localhost:3004/admin/5c7926fe1be3cc5e69c24163` and the data to update e.g 
```json
{
    "firstname": "Andrew",
    "lastname": "Mead"
}
```

Data to receive: 
```json
{
    "firstname": "Andrew",
    "lastname": "Mead",
    "username": "Amead",
    "email": "Amead@gmail.com",
    "phone": "+234-818-233-1111",
    "role": "manager",
    "tokens": []
}
```

#### DELETE Route to delete an admin

Route: `localhost:3004/admin/:id`

#### Required authentication: This operation requires a token (key: token) to be passed in the header. something like this:
`x-auth: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzdlMzg1OGQ1ODYzNzMwZDg2ZmRjOTUiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTUxNzc1ODMzfQ.X18xoGHmr5hwF4nAnicX9XMhECt_38PP-Nqeqe_vJ50` 
Without this the operation would fail.

Data to be sent: just the admin ID in the url example `localhost:3004/admin/5c7926fe1be3cc5e69c24163`

Data to Receive: 
```json
{
    "firstname": "Maximilliam",
    "lastname": "Swashmillian",
    "username": "maxswash",
    "email": "maxswash@gmail.com",
    "phone": "+234-818-233-0000",
    "role": "super_admin",
    "tokens": []
}
```

#### AUDIT_TRAIL Route to delete an admin

Route: `localhost:3004/audit`

#### Required authentication: This operation requires a token (key: token) to be passed in the header. something like this:
`x-auth: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzdlMzg1OGQ1ODYzNzMwZDg2ZmRjOTUiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTUxNzc1ODMzfQ.X18xoGHmr5hwF4nAnicX9XMhECt_38PP-Nqeqe_vJ50` 
Without this the operation would fail.

Data to receive: an array of admin data as below;

```json
[
    {
        "company": "Vetiva",
        "_id": "5c87838b246ed7052dccc6dc",
        "action": "Oputa Chinedu edited an admin profile",
        "createdBy": "Oputa Chinedu",
        "user": "Lawrence Eagles",
        "createdAt": "2019-03-12T10:01:47.825Z",
        "updatedAt": "2019-03-12T10:01:47.825Z",
        "__v": 0
    },
    {
        "company": "Vetiva",
        "_id": "5c86863cd77f9f203e686d4e",
        "action": "Oputa Chinedu edited an admin profile",
        "createdBy": "Oputa Chinedu",
        "user": "Lawrence Eagles",
        "createdAt": "2019-03-11T16:01:00.436Z",
        "updatedAt": "2019-03-11T16:01:00.436Z",
        "__v": 0
    },
    {
        "company": "Vetiva",
        "_id": "5c86718798da541dbd37600f",
        "action": "Oputa Chinedu created a new admin",
        "createdBy": "Oputa Chinedu",
        "user": "Lawrence Oputa",
        "createdAt": "2019-03-11T14:32:39.023Z",
        "updatedAt": "2019-03-11T14:32:39.023Z",
        "__v": 0
    },
    {
        "company": "Vetiva",
        "_id": "5c867103bcf6851d4f9d4163",
        "action": "Oputa Chinedu created a new admin",
        "createdBy": "Oputa Chinedu",
        "user": "Lawrence Oputa",
        "createdAt": "2019-03-11T14:30:27.092Z",
        "updatedAt": "2019-03-11T14:30:27.092Z",
        "__v": 0
    }
]
```

#### Sorting with the audit trail route
Sorting makes use of query string as show below.
there is a sortBy that is = `<-- the sorting param -->: desc or asc` order below example used the createdAt timestamp and desc (decending sorting order).

Route: `localhost:3004/audit?sortBy=createdAt:desc`

another example using the createdAt and the asc (asending sorting order)

Route: `localhost:3004/audit?sortBy=createdAt:asc`

#### Sorting admin by role

#### Route: `localhost:3004/admin/role` 
the role should be a valid admin role e.g:
`localhost:3004/admin/super_admin`
This should return an array of all the super admin present in the database

Data to receive:
```json
[
    {
        "firstname": "Lawrence",
        "lastname": "Eagles",
        "username": "law1",
        "email": "law1@gmail.com",
        "phone": "+234-818-222-4446",
        "role": "super_admin",
        "tokens": [
            {
                "_id": "5c87a0a60a37a92378d75816",
                "access": "auth",
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Yzg3OWYzNmMxM2Q5NDIzMmVjZTU5NTUiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTUyMzkyMzU4fQ.WTjqWIruR7mgHQqrIxUeWYCLkHuV6guxhZUdixdEyRE"
            }
        ]
    },
    {
        "firstname": "Hilary",
        "lastname": "Israel",
        "username": "hilary",
        "email": "hill@gmail.com",
        "phone": "+234-818-222-0006",
        "role": "super_admin",
        "tokens": [
            {
                "_id": "5c87e5ee64a9b3644f6befbe",
                "access": "auth",
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Yzg3OWY1ZWMxM2Q5NDIzMmVjZTU5NTciLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTUyNDEwMDk0fQ.2S8iQ6sJitSqhAVpWE9i_qlD1qh3XXof6qBd7VXRLQ4"
            }
        ]
    },
    {
        "firstname": "Paul",
        "lastname": "Ayu",
        "username": "paul",
        "email": "paul@gmail.com",
        "phone": "+234-818-222-0005",
        "role": "super_admin",
        "tokens": []
    }
]
```
