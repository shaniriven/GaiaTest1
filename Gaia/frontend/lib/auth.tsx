export const googleOAuth = async (startSSOFlow: any) => {
  try {
    const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
      strategy: "oauth_google",
      // For web, defaults to current path
      // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
      // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
      redirectUrl: AuthSession.makeRedirectUri(),
    });

    // If sign in was successful, set the active session
    if (createdSessionId) {
      setActive!({ session: createdSessionId });
    } else {
      // If there is no `createdSessionId`,
      // there are missing requirements, such as MFA
      // Use the `signIn` or `signUp` returned from `startSSOFlow`
      // to handle next steps
    }
  } catch (err) {}
};
