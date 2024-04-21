const nodemailer = require('nodemailer')
const dotenv = require('dotenv');
dotenv.config()
var inlineBase64 = require('nodemailer-plugin-inline-base64');


const sendEmailCreateOrder = async (email,orderItems) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'letuan3132001@gmail.com', // generated ethereal user
      pass: 'qcko phwa cnfp qgxx', // generated ethereal password
    },
  });
  transporter.use('compile', inlineBase64({cidPrefix: 'somePrefix_'}));

  let listItem = '';
  const attachImage = []
  orderItems.forEach((order) => {
    listItem += `<div>
    <div>
      Bạn đã đặt sản phẩm <b>${order.name}</b> với số lượng: <b>${order.amount}</b> và giá là: <b>${order.price} VND</b></div>
    </div>`
    attachImage.push({path: order?.image})
  })

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'letuan3132001@gmail.com', // sender address
    to: 'letuan3132001@gmail.com', // list of receivers
    subject: "Bạn đã đặt hàng tại PetMart", // Subject line
    text: "Hello world?", // plain text body
    html: `<div><b>Bạn đã đặt hàng thành công tại PetMart</b></div> ${listItem}`,
    attachments: attachImage,
  });
}

module.exports = {
  sendEmailCreateOrder
}