const fs = require('fs')
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')

const server = jsonServer.create()
const router = jsonServer.router('./products_v2.json')
const userdb = JSON.parse(fs.readFileSync('./users.json', 'UTF-8'))

server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json())
server.use(jsonServer.defaults());

const SECRET_KEY = '123456789'

const expiresIn = '1h'

// Create a token from a payload 
function createToken(payload){
  return jwt.sign(payload, SECRET_KEY, {expiresIn})
}

// Verify the token 
function verifyToken(token){
  return  jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ?  decode : err)
}

// Check if the user exists in database
function isAuthenticated({email, password}){
  return userdb.users.findIndex(user => user.email === email && user.password === password) !== -1
}

function mailExists(email){
  return userdb.users.findIndex(user => user.email === email) !== -1
}

function getUserRole({email, password}) {
  let user
  let userIndex = userdb.users.findIndex(user => user.email === email && user.password === password)
  if (userIndex == -1) {
    console.log("pase 1")
    return null
  }
  console.log("pase 2" + userIndex)
  user = userdb.users[userIndex]
  console.log("pase 3" + user.role)
  return user.role
}

// Register New User
server.post('/auth/register', (req, res) => {
  console.log("register endpoint called; request body:");
  console.log(req.body);
  const {email, password, role} = req.body;

  if(mailExists(email) === true) {
    const status = 401;
    const message = 'Ese Mail ya existe';
    res.status(status).json({status, message});
    return
  }

fs.readFile("./users.json", (err, data) => {  
    if (err) {
      const status = 401
      const message = err
      res.status(status).json({status, message})
      return
    };

    // Get current users data
    var data = JSON.parse(data.toString());

    // Get the id of last user
    var last_item_id = data.users[data.users.length-1].id;

    //Add new user
    data.users.push({id: last_item_id + 1, email: email, password: password, role: role}); //add some data
    var writeData = fs.writeFile("./users.json", JSON.stringify(data), (err, result) => {  // WRITE
        if (err) {
          const status = 401
          const message = err
          res.status(status).json({status, message})
          return
        }
    });
});

// Create token for new user
  const access_token = createToken({email, role})
  console.log("Access Token:" + access_token);
  res.status(200).json({access_token})
})

// Login to one of the users from ./users.json
server.post('/auth/login', (req, res) => {
  console.log("login endpoint called; request body:");
  console.log(req.body);
  const {email, password} = req.body;
  if (isAuthenticated({email, password}) === false) {
    const status = 401
    const message = 'Mail y/o contraseña incorrectos'
    res.status(status).json({status, message})
    return
  }
  const role = getUserRole({email, password})
  if (!role) {
  const status = 490
  const message = 'No role' + role
  res.status(status).json({status, message})
    return
  }
  const access_token = createToken({email, role})
  console.log("Access Token:" + access_token);
  res.status(200).json({access_token})
})

server.use(/^(?!\/auth).*$/,  (req, res, next) => {
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const status = 401
    const message = 'Acceso no autorizado'
    res.status(status).json({status, message})
    return
  }
  try {
    let verifyTokenResult;
     verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);

     if (verifyTokenResult instanceof Error) {
       const status = 401
       const message = 'Access token invalido'
       res.status(status).json({status, message})
       return
     }
     next()
  } catch (err) {
    const status = 401
    const message = 'Access token invalido'
    res.status(status).json({status, message})
  }
})

server.use(router)

server.listen(8000, () => {
  console.log('Run Auth API Server')
})