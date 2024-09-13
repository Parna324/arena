import { resend } from "./resend";
import ResetPasswordEmail from "@/email/resetpassword";
import { ApiResponse } from "./ApiResponse";

export async function SendResetpasswordOtp(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: 'ARENA<smartxcode@smartcraze.online>',
      to: email,
      subject: 'ARENA OTP',
      react: ResetPasswordEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send verification email.' };
  }
}


