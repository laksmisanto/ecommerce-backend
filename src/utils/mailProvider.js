import nodemailer from "nodemailer";

export default async function mailProvider(email, subject, otp, template) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "ls.computer1998@gmail.com",
      pass: "nixm aqrr pghf zdvr",
    },
  });
  const info = await transporter.sendMail({
    from: "ls.computer1998@gmail.com", // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    text: "Hello world?", // plain text body
    html: template(otp), // html body
  });
}
