require('dotenv').config();
const { reject } = require('lodash');
const nodemailer = require("nodemailer");
const { resolve } = require('path');



let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Phan Thị Bảo Ngọc" <baon57674@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        html: getBodyHTML(dataSend)
        ,
    });
}


let getBodyHTML = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
        <h3>Dear ${dataSend.patientName}!</h3>
        <p>You have received an email, you have booked Bao Ngoc's online medical examination appointment</p>
        <p>Information to schedule an appointment:</p>
        <div>
        <b>Time: ${dataSend.time}</b>
        </div>
        <div>
        <b>Doctor: ${dataSend.doctorName}</b>
        </div>
        <p>If the above information is true, please click on the link below to confirm and complete the procedure to book an appointment.</p>

        <div>
        <a href="${dataSend.redirectLink} target="_blank">Click here</a>
        </div>

        <div>Sincerely thank<div/>
        
        `
    }
    if (dataSend.language === 'en') {
        result = `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email thì đã đặt lịch khám bệnh online của Bảo Ngọc</p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div>
        <b>Thời gian: ${dataSend.time}</b>
        </div>
        <div>
        <b>Bác sĩ: ${dataSend.doctorName}</b>
        </div>
        <p>Nếu các thông tin trên là đúng sự thật vui lòng click vào link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh</p>

        <div>
        <a href="${dataSend.redirectLink} target="_blank">Click here</a>
        </div>

        <div>Xin chân thành cảm ơn<div/>
        
        `

    }
    return result;
}


let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = ''
    if (dataSend.language === 'en') {
        result = `
        <h3>Dear ${dataSend.patientName}!</h3>
        <p>You have received an email, you have booked Bao Ngoc's online medical examination appointment</p>
        <p>Prescription/invoice information is sent in the attached file.</p>

        <div>Sincerely thank<div/>
        
        `
    }
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email thì đã đặt lịch khám bệnh online của Bảo Ngọc</p>
        <p>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm.</p>
     
        <div>Xin chân thành cảm ơn<div/>
        
        `

    }
    return result;

}


let sendAttachment = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {




            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_APP, // generated ethereal user
                    pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
                },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"Bảo Ngọc" <baon57674@gmail.com>', // sender address
                to: dataSend.email, // list of receivers
                subject: "Kết quả đặt lịch khám bệnh", // Subject line
                html: getBodyHTMLEmailRemedy(dataSend),
                attachments: [
                    {
                        filename: `remedy - ${dataSend.patientId} - ${new Date().getTime()}.png`,
                        content: dataSend.imgBase64.split("base64,")[1],
                        encoding: 'base64'
                    }

                ]
                ,
            });

            resolve(true)
        } catch (e) {
            reject(e)
        }
    })

}


module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment
}