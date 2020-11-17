const net = require('net')
const readline = require('readline')
const fs = require('fs')

const rawusers = JSON.parse(fs.readFileSync('users.json','utf-8'))
const usernames = fs.readFileSync('users.json','utf-8').match(/(?<=userName":")\w+/gmi)
const server = net.createServer((socket) => {
  let currentUser = ''
  let isUser = false
  let isLogged = false
  socket.on('data', (data) => {
    console.log(data.toString())
    const [directive, parameter] = data.toString().split(' ')

    switch (directive) {
      case 'USER':
        if(usernames.includes(parameter)){
          socket.write(`${parameter} succesfully connected, please enter your password`)
          isUser = true
          currentUser = parameter
          isLogged = false
        }
        else{
          socket.write('user name incorrect, please enter a valid userName')
          isLogged = false
        }
        break;
      case 'PASS':
        if(currentUser == 'valentin' && rawusers[0]['password'] == parameter){
          isLogged = true
          socket.write(`password correct, you are now logged in as ${currentUser}`)
        }
        else if (currentUser == 'root' && rawusers[1]['password'] == parameter){
          isLogged = true          
          socket.write(`password correct, you are now logged in as ${currentUser}`)
        }
        else{
          socket.write(`incorrect password, please enter a valid password for username : ${currentUser}`)
        }
        break;
        case 'LIST':
          directorycontent = fs.readdirSync('./','utf-8')
          socket.write(`The current folder (${process.cwd()}) contains : `)
          socket.write(fs.readdirSync('./').toString().replace(/,/g,'\r\n'))
          if(isLogged == false){
           
          }
          break;
        case 'CWD':
            process.chdir(parameter, (err) => {
              if(err) socket.write(`The directory you tried to access doesn't exist, please enter a valid directory`)
              else socket.write(`You changed the working directory to : ${process.cwd()}`)
            })
          
          break;
        case 'RETR':
            try {
              fs.copyFileSync(parameter,'../client/copytest(copied).txt')
              socket.write('File was succesfully copied')
            }
              catch (err){
                 socket.write("File could not be found or doesn't exist")
            }
          break;
        case 'STOR':
          try {
            fs.copyFileSync('../client/'+parameter,'copytest2(copied).txt')
            socket.write('File was succesfully copied')
          }
            catch (err){
               socket.write("File could not be found or doesn't exist")
          }
          
          break;
        case 'PWD':
          socket.write(`The current server directory is : ${process.cwd()}`)
          
          break;
      case 'HELP':
          socket.write(fs.readFileSync('help.txt', (err)=>{
            if (err) socket.write('Help is not accessible from this directory, change directory to server to use HELP')
          }))
        break;
      default:
        socket.write('You didnt enter a valid command, use <HELP> to see different commands')
        break;



    }
})
})

server.listen(5000, () => {
  console.log('Server started at port 5000')
})