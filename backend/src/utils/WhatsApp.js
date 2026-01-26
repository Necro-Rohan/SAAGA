const axios = require("axios");

const sendWhatsappOtp = async (to, otpCode) => {
  try {
    const response = await axios({
      method: "POST",
      url: `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "91" + to, // Adds India country code automatically
        type: "template",
        template: {
          name: "auth_otp", // MAKE SURE THIS MATCHES YOUR TEMPLATE NAME IN DASHBOARD
          language: { code: "en_US" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: otpCode }, // Replaces {{1}} in template
              ],
            },
            {
              type: "button",
              sub_type: "url",
              index: 0,
              parameters: [
                { type: "text", text: otpCode }, // For the "Copy Code" button
              ],
            },
          ],
        },
      },
    });
    return response.data;
  } catch (error) {
    console.error("WhatsApp API Error:", error.response?.data || error.message);
    throw new Error("Failed to send WhatsApp OTP");
  }
};

module.exports = { sendWhatsappOtp };
