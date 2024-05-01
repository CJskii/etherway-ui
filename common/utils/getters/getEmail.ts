export const getVerifyEmailData = ({
  email,
  verificationLink,
}: {
  email: string;
  verificationLink: string;
}) => {
  return {
    From: {
      Email: "hello@etherway.io",
      Name: "Etherway",
    },
    To: [
      {
        Email: email,
      },
    ],
    Subject: "Verify your email address",
    HTMLPart: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
          <!-- Header Image -->
          <img src="https://pbs.twimg.com/profile_banners/1634697370247233538/1710699959/1500x500" alt="Etherway Logo" style="width: 100%; height: auto;">
      
          <!-- Main Content Area -->
          <div style="padding: 20px; text-align: center;">
            <h1 style="color: #333;">Hello,</h1>
            <p>Welcome to Etherway! You're one step away from completing your sign-up.</p>
            
            <p>Please activate your account by clicking the button below:</p>
            
            <!-- Activation Button -->
            <a href="${verificationLink}" style="display: inline-block; margin-top: 15px; margin-bottom: 15px; padding: 10px 20px; background-color: #0077cc; color: #fff; text-decoration: none; border-radius: 5px;">Activate Account</a>
      
            <p>If the button above doesn't work, copy and paste the following link into your web browser:</p>
            <p style="word-wrap: break-word; color: #0077cc;">${verificationLink}</p>
      
            <p>If you didn't sign up for an Etherway account, you can safely ignore this email.</p>
          </div>
      
          <!-- Footer -->
          <div style="background-color: #f4f4f4; padding: 10px; text-align: center;">
            <p>If you'd like to learn more, visit our <a href="https://www.etherway.io" style="color: #0077cc; text-decoration: none;">website</a> or reach out to us directly.</p>
            <p>This message was sent to <a href="mailto:${email}" style="color: #0077cc;">${email}</a>.</p>
          </div>
        </div>
        `,
  };
};

export const getWelcomeEmailData = ({
  email,
  unsubscribeLink,
}: {
  email: string;
  unsubscribeLink: string;
}) => {
  return {
    From: {
      Email: "hello@etherway.io",
      Name: "Etherway",
    },
    To: [
      {
        Email: email,
      },
    ],
    Subject: "Welcome to Etherway!",
    HTMLPart: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
          <!-- Header Image -->
          <img src="https://pbs.twimg.com/profile_banners/1634697370247233538/1710699959/1500x500" alt="Welcome to Etherway" style="width: 100%; height: auto;">
    
          <!-- Content Area -->
          <div style="padding: 20px;">
            <h1 style="color: #333;">Welcome aboard,</h1>
            <p>We're happy to have you with us. Etherway is your gateway to minting, bridging and airdrops across various chains.</p>
            
            <p>Start your journey by checking out what's happening right now:</p>
    
            <!-- Social Links -->
            <p>🐦 <a href="https://twitter.com/etherway_io" style="color: #0077cc; text-decoration: none;">Twitter: Join the conversation</a></p>
            <p>📢 <a href="https://t.me/+IFXADMbhrSAyNTE0" style="color: #0077cc; text-decoration: none;">Telegram: Get real-time updates</a></p>
            <p>💬 <a href="https://discord.gg/GcS5r5NWfh" style="color: #0077cc; text-decoration: none;">Discord: Connect with the community</a></p>
    
            <p>If you ever have questions or need a helping hand, our community and support team are here for you. Let's make something great together!</p>
    
            <p>Warm regards,</p>
            <p>The Etherway Team</p>
          </div>
    
          <!-- Footer -->
          <div style="background-color: #f4f4f4; padding: 10px; text-align: center;">
            <p>If you'd like to learn more, visit our <a href="https://www.etherway.io" style="color: #0077cc; text-decoration: none;">website</a> or reach out to us directly.</p>
            <p>This message was sent to <a href="mailto:${email}" style="color: #0077cc;">${email}</a>. If you no longer wish to receive these emails, you can <a href="${unsubscribeLink}" style="color: #0077cc; text-decoration: none;">unsubscribe at any time</a>.</p>
          </div>
        </div>
      `,
  };
};
