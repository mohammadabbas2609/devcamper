# Devcamper
> Devcamper is an NodeJS based REST API to manage bootcamps
---
## Features
* Users Perspective
  * Can view the bootcamp and thier courses
  * Pagination
  * Advance filtering of bootcamps,courses,review
  * Can provide review and rating for bootcamp
* Publisher Perspective(Owner of particular bootcamp)
  * Can perform CRUD operation on a bootcamp which is owned by him/her
  * Authentication and Authorization for security
  * Can upload image of bootcamp
* Admin Perspective
  * Can perform CRUD operation on any bootcamp,courses,publisher,Users
* Security perspective
  * Rate limiting applied to prevent DDos
  * XSS attack prevented
  * Prevent No-SQL injection by sanitizing the incoming requests
  * HTTP parameter pollution prevented
  * More security headers added with each response
## Limitation
 * Publisher can have only one bootcamp
 * Publisher cant review any bootcamp including which they own.

## Technologies Used
* NodeJS (Javascript Runtime)
* ExpressJS (NodeJS Framework)
* MongoDB (NOSQL Database)
* Mongoose(Object Data Mapper)
* BcryptJS(Password Hashing)
* JSON-WEB_TOKEN (For Authorization)
* Express-fileupload (Handling file uploads)
* Nodemailer (Handling emails)
* \* Various Security Packages to Make API Secure \*
  
---
## Enviroment Variables
### Place your .env file in root of project
```
NODE_ENV=development
PORT = 5000

MONGO_URI= *Mongo DB connection string*

GEOCODER_API_KEY = *Geocoder API Key*
GEOCODER_PROVIDER = *Provider Name for eg : mapquest,google etc*

JWT_SECRET = *JWT secret*

SMTP_HOST_NAME= *SMTP host name for sending email*
SMTP_PORT=*Port number*
SMTP_USER=*User name*
SMTP_PASS=*user password*
FROM_EMAIL=*Your email*
FROM_NAME=*Your Name*
```

Extensive documentation for the API  is [here](https://documenter.getpostman.com/view/14581553/TzzEpFKW)

