import { create } from "domain";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import nodemailer from "nodemailer";
import { config } from "../config/config";

interface data {
  subject: string;
  text: string;
  to: string;
  hmtl: string;
}

const sendMail = async (
  data: data,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // hostname
      port: 587, // port for secure SMTP
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: config.email,
        pass: config.password,
      },
    });

    const mailOptions = {
      from: "<tamim11903060@gmail.com>", // sender address
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.hmtl,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return next(createHttpError(500, "Something went wrong"));
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).json({ message: "Email sent successfully" });
      }
    });
  } catch (error) {
    return next(createHttpError(500, "Something went wrong"));
  }
};

export { sendMail };
