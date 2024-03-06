const mailVerificationTemplate = (otp) => {
  return `
    <div style="width:100%;max-width:300px;margin:0 auto;background:124076;padding:20px;box-shadow:2px 4px 8px #222222;border-radius:8px;text-align:center;">
        <h1 style="color:#fff;background:#070F2B;padding:4px 0px; margin-bottom:20px">Your OTP</h1>
        <p style="font-size:16px;color:#070F2B">This is your one time verification code</p>
        <h2 style="letter-spacing:8px;background:#F1F6F9;color:#070F2B">${otp}</h2>
        <button style="border:none;outline:none;border-radius:4px;letter-spacing:1px;padding:8px 14px; background:#070F2B; color:#fff;">Continue</button>
    </div>
    `;
};
export default mailVerificationTemplate;
