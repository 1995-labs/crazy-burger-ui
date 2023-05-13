import React, { createContext } from "react";
import { BranchProvider } from "./internals/BranchContext";
import { CartProvider } from "./internals/CartContext";
import { OrderNotificationContextProvider } from "./internals/OrderNotificationContext";
import { RecordProvider } from "./internals/RecordContext";
import { RewardsProvider } from "./internals/RewardsContext";
import { SearchContextProvider } from "./internals/SearchContext";
import { StoreMenuContextProvider } from "./internals/StoreMenuContext";
import { StoreStatusProvider } from "./internals/StoreStatusContext";
import { StoreTagsContextProvider } from "./internals/StoreTagsContext";
import { UserProvider } from "./internals/UserContext";

const MajorContext = createContext<{}>({});

type ProviderType = {
  children: React.ReactNode;
};

export const MajorProvider = ({ children }: ProviderType) => {
  const value: {} = {};

  return (
    <MajorContext.Provider value={value}>
      {/* <FirebaseProvider> */}
      <UserProvider>
        <RecordProvider>
          <RewardsProvider>
            <CartProvider>
              <BranchProvider>
                <StoreStatusProvider>
                  <StoreMenuContextProvider>
                    <StoreTagsContextProvider>
                      <OrderNotificationContextProvider>
                        <SearchContextProvider>
                          {children}
                        </SearchContextProvider>
                      </OrderNotificationContextProvider>
                    </StoreTagsContextProvider>
                  </StoreMenuContextProvider>
                </StoreStatusProvider>
              </BranchProvider>
            </CartProvider>
          </RewardsProvider>
        </RecordProvider>
      </UserProvider>
      {/* </FirebaseProvider> */}
    </MajorContext.Provider>
  );
};
