# Reader Pipe

The goal of this project is to create a web service that connects e-reading platforms with social media platforms. 

In its first iteration, it will essentially be a configurable email server that receives and parses "share" emails from major ereading systems (iBooks, Kindle, Kobo, etc)

## Use Cases

* New user creates account
* User creates rule for incoming email
* Server receives email, associates with account, executes rule
* Server intelligently identifies & parses emails from various ereader share functions (iBooks, Kindle, Kobo, etc)

## Dependencies

* [Express](http://expressjs.com/)
* [Mongoose](http://mongoosejs.com/)
* [Passport](http://passportjs.org/)
* [ejs](https://github.com/visionmedia/ejs)
* [connect-flash](https://github.com/jaredhanson/connect-flash)
* [bcrypt-nodejs](https://github.com/shaneGirish/bcrypt-nodejs)
* [simplesmtp](https://github.com/andris9/simplesmtp)
