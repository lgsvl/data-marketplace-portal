
# Data market places - Portal

## Usage
### Requirements
* [NodeJS](http://nodejs.org/) (with [NPM](https://www.npmjs.org/))
* [Bower](http://bower.io)
* [Gulp](http://gulpjs.com)

### Installation
```
npm install # Install NPM
bower install # Install Bower
gulp build # Run the gulp build task
```

```
gulp # This will build and run a live reload server on http://localhost:5000
```


### Adding your company
* Open `src/js/controller/routes.js` file
* At the bottom of the file, find `constant` module called `config`.
* Inside of marketplaces, add your own company info.

```
marketplaces: [
    {
        name: 'Market Place 1',
        server: 'https://datamarketplace1.auth.us-west-2.amazoncognito.com/login?response_type=token&scope=openid&client_id=3vh7qah4ia3dmoee8u5r5v2m7b&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2F',
        domain: '@marketplace1.com'
    },
]
```

* Put whole server url including client_id and redirect_uri if your own server requires it.
Current code is set to run at port 5000 and localhost:5000 is registered at amazon cognito.