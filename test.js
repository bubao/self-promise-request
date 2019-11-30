const Requests = require('./')

// const request = new Req()

Requests.on('process',(data)=>{
    console.log(data)
})

Requests.request({url: 'https://download.sublimetext.com/Sublime%20Text%20Build%203211%20x64%20Setup.exe',pipe:'./1.exe'})