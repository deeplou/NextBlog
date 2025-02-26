import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import ucfirst from "@/components/ucfirst";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const name = formData.get("name");
        const email = formData.get("email");
        const SECRET_KEY = process.env.SECRET_KEY;
        const url = process.env.API_URL;

        if (!name || !email) {
            return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
        }

        // Create JWT token
        const token = jwt.sign({ name, email }, SECRET_KEY, { expiresIn: "1h" });

        // Generate secure login URL
        const loginUrl = `${url}/?token=${token}`;

        // Send email with login link
        await sendEmail(email, loginUrl, name);

        return NextResponse.json({ msg: "Check your email to login", token }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Function to send email
async function sendEmail(email, loginUrl, name) {
    let transporter = nodemailer.createTransport({
        service: "gmail", // Use a real SMTP service in production
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    let mailOptions = {
        from: `"Secure Login" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your Secure Login Link",
        html: `
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                            <tr>
                                <td align="center" style="padding: 20px 0;">
                                    <h2 style="color: #333;">Hello ${ucfirst(name.split(' ')[0])},</h2>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 10px 20px; color: #555; font-size: 16px;">
                                    <p>Click the link below to securely log in:</p>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 20px;">
                                    <a href="${loginUrl}" style="background-color: #007BFF; color: #ffffff; text-decoration: none; font-size: 18px; font-weight: bold; padding: 10px 32px; border-radius: 100px; display: inline-block;">
                                        Log In
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 20px 20px 10px; color: #777; font-size: 14px;">
                                    <p>This link expires in 1 hour.</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        `,
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("Email sent: ", info.response);
    } catch (error) {
        console.error("Error sending email: ", error);
    }
}
