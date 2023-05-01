import { createContext, useContext, useEffect, useState } from "react";
// import { remoteConfig } from '../firebase';

export type RemoteConfigContextType = {
  // loading: boolean;
  flags: any;
};

const RemoteConfigContext = createContext<RemoteConfigContextType>({
  // loading: true,
  flags: {},
});

export const useRemoteConfig = () =>
  useContext<RemoteConfigContextType>(RemoteConfigContext);

type ProviderType = {
  children: React.ReactNode;
};

export function RemoteConfigContextProvider({ children }: ProviderType) {
  // const [loading, setLoading] = React.useState(true);
  const [flags, setFlags] = useState<any>(null);

  useEffect(() => {
    // remoteConfig
    //   .fetchAndActivate()
    //   .then(() => {
    //     const val = remoteConfig.getValue(
    //       window.location.pathname.substring(1),
    //     );
    //     const themeConfig = JSON.parse(val.asString());
    //     setFlags(themeConfig);
    //     // setLoading(false);
    //   })
    //   .catch((error) => console.error(error));
  }, []);

  const value = {
    // loading,
    flags,
  };

  return (
    <RemoteConfigContext.Provider value={value}>
      {children}
    </RemoteConfigContext.Provider>
  );
}
