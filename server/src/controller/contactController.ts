import { Request, Response } from "express";
import { sendEmail } from "../utils/sendEmail";
import Contact from "../model/contactModel";
export const postContact: any = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, country, message } = req.body;

    if (!name || !email || !phone || !country || !message) {
      return res.status(400).json({ msg: "Provide all the details." });
    }

    const contactDetail = new Contact({
      name,
      email,
      phone,
      country,
      message,
      status: false,
    });

    const createdContactDetail = await contactDetail.save();

    if (!createdContactDetail) {
      return res.status(401).json({ msg: "Contact details not created." });
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

    try{
    await sendEmail({
      to: email,
      subject: "Thank You for Contacting Us!",
      html: emailContent,
    });

    
  const updatedContact = await Contact.findByIdAndUpdate(
    createdContactDetail._id,
    { status: true },
    { new: true } 
  );

  
  return res.status(200).json({
    
    message: "Form submitted and email sent.",
    contact: updatedContact,
  });
} catch (error:any) {
  return res.status(500).json({
    message: "Form submitted but failed to update contact status.",
    error: error.message,
  });
}

  } catch (error: any) {
    
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getContacts: any = async (req: Request, res: Response) => {
  try {
    const userContacts = await Contact.find({});

    if (userContacts.length === 0) {
      return res.status(400).json({ msg: "no contacts found." });
    }

    return res
      .status(200)
      .json({ userContacts, msg: "contacts fetched successfully." });
  } catch (error: any) {
    return res.status(500).json({ msg: "server error", error });
  }
};

export const sendMsg: any = async (req: Request, res: Response) => {
  const { email, resendMsg } = req.body;

  if (!email || !resendMsg) {
    return res
      .status(400)
      .json({ msg: "Email and custom message are required." });
  }

  const contactExists = await Contact.findOne({ email });

  if (!contactExists) {
    return res.status(400).json({ msg: "no contact found with this email" });
  }

  const emailContent = `
  <!DOCTYPE html>
  <html>
    <body style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f0f2f5; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border: 1px solid #e0e0e0;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #2c3e50;">📨 Resent Message</h2>
          <p style="color: #636e72; font-size: 16px;">We appreciate your submission.</p>
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
          <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 10px;">
              <strong>Message:</strong><br>
              <span style="display: inline-block; margin-top: 4px; background-color: #dfe6e9; padding: 10px; border-radius: 6px; color: #2d3436;">
                ${resendMsg}
              </span>
            </li>
          </ul>
        </div>

        <p style="text-align: center; margin-top: 30px; color: #b2bec3; font-size: 14px;">
          This message was sent from our admin panel.
        </p>
      </div>
    </body>
  </html>
  `;

  try {
    await sendEmail({
      to: email,
      subject: "Resend Mail",
      html: emailContent,
    });

    return res.status(200).json({ msg: "email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ msg: "failed to send email." });
  }
};
