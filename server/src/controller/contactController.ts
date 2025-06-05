import { Request, Response } from "express";
import { sendEmail } from "../utils/sendEmail";
import Contact from "../model/contactModel";

export const postContact:any = async (req: Request, res: Response) => {
  const { name, email, phone, country, message } = req.body;
  if (!name || !email || !phone || !country || !message) {
    return res.status(400).json({ msg: "provide all the details" });
  }

  const contactDetail = new Contact({
    name,
    email,
    phone,
    country,
    message,
  });
  const createdContactDetail = await contactDetail.save();
  if (!createdContactDetail) {
    return res.status(401).json({ msg: "contact details not created" });
  }

 const emailContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f4f4f4; border-radius: 8px;">
    <h2 style="color: #2c3e50;">Thank You, ${name}!</h2>
    <p style="color: #34495e;">Here is what you submitted:</p>
    <ul style="list-style: none; padding: 0; color: #2d3436;">
      <li style="margin-bottom: 8px;"><strong>Email:</strong> ${email}</li>
      <li style="margin-bottom: 8px;"><strong>Phone:</strong> ${phone}</li>
      <li style="margin-bottom: 8px;"><strong>Country:</strong> ${country}</li>
      <li style="margin-bottom: 8px;"><strong>Message:</strong> ${message}</li>
    </ul>
  </div>
`;

  await sendEmail({
    to: email,
    subject: "Thank You for Contacting Us!",
    html: emailContent,
  });
  
  
  return res.status(200).json({ message: "Form submitted and email sent." });
};
