import {
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
} from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { createContext, useEffect, useState } from "react";

WebBrowser.maybeCompleteAuthSession();

const CivicAuthContext = createContext();

const CivicAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const discovery = {
    authorizationEndpoint: "https://auth.civic.com/oauth/auth",
    tokenEndpoint: "https://auth.civic.com/oauth/token",
    userInfoEndpoint: "https://auth.civic.com/oauth/userinfo",
  };

  const clientId = "99a8a258-a376-4781-9fbe-50ca70a1ac61";
  const redirectUri = makeRedirectUri({ scheme: "hackborbengal" });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      scopes: ["openid", "profile", "email"],
      redirectUri,
      usePKCE: true,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      (async () => {
        const tokens = await exchangeCodeAsync(
          {
            clientId,
            code: response.params.code,
            redirectUri,
          },
          discovery
        );

        setAccessToken(tokens.accessToken);
        await SecureStore.setItemAsync("accessToken", tokens.accessToken);

        const userInfoRes = await fetch(discovery.userInfoEndpoint, {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        });

        const userInfo = await userInfoRes.json();
        setUser(userInfo);
      })();
    }
  }, [response]);

  const signOut = async () => {
    await SecureStore.deleteItemAsync("accessToken");
    setUser(null);
    setAccessToken(null);
  };

  return (
    <CivicAuthContext.Provider
      value={{
        state: {
          isAuthenticated: !!user,
          user,
          accessToken,
        },
        signIn: () => promptAsync(),
        signOut,
      }}
    >
      {children}
    </CivicAuthContext.Provider>
  );
};

export { CivicAuthContext, CivicAuthProvider };
