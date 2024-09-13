import dbConnect from "@/db/dbconnects";
import User from "@/schema/user";
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from "@/helpers/Sendverification";
export async function POST(request: Request) {
    await dbConnect();
  
    try {
      const { username,Fullname, email, password } = await request.json();
  
      const existingVerifiedUserByUsername = await User.findOne({
        username,
        isVerified: true,
      });
      
      if (existingVerifiedUserByUsername) {
        return Response.json(
          {
            success: false,
            message: 'Username is already taken',
          },
          { status: 400 }
        );
      }
      console.log(existingVerifiedUserByUsername);
      
      const existingUserByEmail = await User.findOne({ email });

      let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
  
      if (existingUserByEmail) {
        if (existingUserByEmail.isVerified) {
          return Response.json(
            {
              success: false,
              message: 'User already exists with this email',
            },
            { status: 400 }
          );
        } else {
          const hashedPassword = await bcrypt.hash(password, 10);
          existingUserByEmail.password = hashedPassword;
          existingUserByEmail.verifyCode = verifyCode;
          existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
          await existingUserByEmail.save();
          console.log(existingUserByEmail);
          
        }
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);
  
        const newUser = new User({
          Fullname,
          username,
          email,
          password: hashedPassword,
          verifyCode,
          verifyCodeExpiry: expiryDate,
          isVerified: false,
          
        });
        
        await newUser.save();
        console.log(newUser);
        
      }
  
      // Send verification email
      const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode
      );
      if (!emailResponse.success) {
        return Response.json(
          {
            success: false,
            message: emailResponse.message,
          },
          { status: 500 }
        );
      }
  
      return Response.json(
        {
          success: true,
          message: 'User registered successfully. Please verify your account.',
        },
        { status: 201 }
      );
      
    } catch (error) {
      console.error('Error registering user:', error);
      return Response.json(
        {
          success: false,
          message: 'Error registering user',
        },
        { status: 500 }
      );
    }
  }