const net = require('net')
const { cpuUsage } = require('process')
const client = new net.Socket()
const readline = require('readline')

client.connect(5000, '127.0.0.1', () => {
  console.log('Please type HELP to see the commands you can use')
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
   });
   waitInput()
   function waitInput() {
     rl.question('', function(answer) {
       if (answer == "QUIT"){
           rl.close();
           process.exit(0)
       } else {
         client.write(answer)
           waitInput();
       }
     });
   }
})

client.on('data', (data) => {
  console.log(data.toString())
})