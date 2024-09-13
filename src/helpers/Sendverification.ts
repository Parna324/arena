import { resend } from "./resend";
import VerificationEmail from "@/email/VerificationEmail";
import { ApiResponse } from "./ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: 'ARENA<arena@smartcraze.online>',
      to: email,
      subject: 'ARENA OTP',
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send verification email.' };
  }
}