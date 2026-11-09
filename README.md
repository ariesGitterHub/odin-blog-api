# Project Notes

## Project Website
Project: Blog API: http://theodinproject.com/lessons/node-path-nodejs-blog-api

## Prisma
REMINDER TO SELF - I'm using Prisma 6.19.3 for its traditional set up that works better for CommonJS, before changes were made in 7.

## Not Included, but... 
This is a note to my future self if reviewing this project, or if I am using this Blog API (backend), Blog Reader (first frontend), and Blog Writer (second frontend)...

+ Add a search feature in the header as a slide down feature
+ Add tags to posts (?)
+ Possible security improvement for later (for now, just noting it)... dealing with timing differences during login. Currently, an unknown email returns immediately without performing a bcrypt comparison. An existing email requires a bcrypt comparison. In theory, this can help someone distinguish existing accounts from nonexistent ones by measuring response times. A common mitigation is to compare against a fixed dummy bcrypt hash when the email doesn't exist. 