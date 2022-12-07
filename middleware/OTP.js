// require ("dotenv").config();

// const accountSid = process.env.ACCOUNT_SID;
// const serviceId = process.env.Service_SID
// const authToken = process.env.AUTH_TOKEN;
const Service_SID = 'VA46b13a823c6950c9ff1f0a701ad6d761';

const Account_SID = 'ACe0d1f0b73ca0d55b9e76e4bc5826fa8e';

const Auth_Token = '2ecf3e47d6b3782f72afcaf28abf31a9';
console.log(Service_SID);

function sendsms(p) {

    const client = require('twilio')(Account_SID, Auth_Token,Service_SID);

    client.verify.v2.services(Service_SID)
                    .verifications
                    .create({to: `+91${p}`, channel: 'sms'})
                    .then(verification => console.log(verification.status));
}



function veryfyotp(num,otp){

    const client = require('twilio')(Account_SID, Auth_Token,Service_SID);

return new Promise((resolve,reject)=>{

    client.verify.v2.services(Service_SID)
          .verificationChecks
          .create({to: `+91${num}`, code:otp})
          .then(verification_check =>{ console.log(verification_check.status)
        resolve(verification_check)
        });
})    

}

module.exports= {sendsms, veryfyotp}