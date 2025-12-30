import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from './index';

// Configure Google OAuth Strategy
if (config.oauth.google.clientId && config.oauth.google.clientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.oauth.google.clientId,
        clientSecret: config.oauth.google.clientSecret,
        callbackURL: config.oauth.google.callbackUrl,
      },
      (accessToken, refreshToken, profile, done) => {
        // Transform Google profile to our user format
        const user = {
          provider: 'google',
          id: profile.id,
          email: profile.emails?.[0]?.value || '',
          displayName: profile.displayName,
          name: profile.displayName,
        };
        return done(null, user);
      }
    )
  );
}

// Apple OAuth would be configured here similarly
// Note: Apple OAuth requires additional setup with certificates

export default passport;
