import twilio from 'twilio';
import { generateOTP } from '../utils/auth';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !phoneNumber) {
  console.warn('Twilio credentials not found. OTP will be mocked.');
}

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export interface OTPResult {
  success: boolean;
  otp: string;
  message: string;
}

export const sendOTP = async (phone: string): Promise<OTPResult> => {
  const otp = generateOTP();
  
  // If Twilio is not configured, return mock OTP
  if (!client) {
    console.log(`Mock OTP for ${phone}: ${otp}`);
    return {
      success: true,
      otp,
      message: 'OTP sent successfully (mock mode)'
    };
  }

  try {
    // Send SMS with OTP
    await client.messages.create({
      body: `Codul tău OTP pentru Rork Marketplace este: ${otp}. Expiră în 10 minute.`,
      from: phoneNumber,
      to: phone
    });

    return {
      success: true,
      otp,
      message: 'OTP sent successfully'
    };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return {
      success: false,
      otp: '',
      message: 'Failed to send OTP'
    };
  }
};

export const sendWhatsAppOTP = async (phone: string): Promise<OTPResult> => {
  const otp = generateOTP();
  
  // If Twilio is not configured, return mock OTP
  if (!client) {
    console.log(`Mock WhatsApp OTP for ${phone}: ${otp}`);
    return {
      success: true,
      otp,
      message: 'WhatsApp OTP sent successfully (mock mode)'
    };
  }

  try {
    // Format phone for WhatsApp (remove + and add whatsapp: prefix)
    const whatsappPhone = phone.startsWith('+') ? phone.slice(1) : phone;
    
    // Send WhatsApp message with OTP
    await client.messages.create({
      body: `Codul tău OTP pentru Rork Marketplace este: ${otp}. Expiră în 10 minute.`,
      from: `whatsapp:${phoneNumber}`,
      to: `whatsapp:+${whatsappPhone}`
    });

    return {
      success: true,
      otp,
      message: 'WhatsApp OTP sent successfully'
    };
  } catch (error) {
    console.error('Error sending WhatsApp OTP:', error);
    return {
      success: false,
      otp: '',
      message: 'Failed to send WhatsApp OTP'
    };
  }
};
