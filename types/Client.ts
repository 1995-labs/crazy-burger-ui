// entity describes a client
export type ClientType = {
  id: string; // from firebase
  name: string; // max length 50
  website: string; // max length 50
  // branches: ClientBranchType[];
  // menu: ClientCatalogItemType[];
  logo: string; // from firebase storage, exact
  // dimensions needed?
  active: boolean;
  // config: {
  // useGoogleForDelivery: boolean;
  // tax: { label: string; value: number; enable: boolean }[];
  // };
  alphaSenderID: string;

  // menuTags: ClientCatalogTagConfigType[];
  // more?
};

// entity describes a client branch location
export type ClientBranchType = {
  id: string; // from firebase
  name: string; // max length 25
  delivery: boolean;
  pickup: boolean;
  phoneNumber: string; // max length 8-10
  textNotificationPhoneNumber: string;
  online: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  // more?
};

// entity describes a client catalog item
export type ClientCatalogItemType = {
  available: string[];
  show: string[];
  description?: string; // max length 100
  image: string; // from firebase
  name: string; // max length 25
  price: number; // positive int
  id: string; // from firebase
  tags: string[];
  new: string[];
  config_limits: {
    add: number;
    remove: number;
  };
  // favorite: string[];
  // more?
};

export type ClientCatalogTagConfigType = {
  id: string;
  label: string;
  show: string[];
  default: string[];
};

// entity describes a client catalog item
// options array - optional, required if
// present

// export type ClientCatalogConfigType = {
//   id: string; // from firebase
//   label: string; // max length 20
//   avaliable: string[];
//   value: number; // positive int
// };

export type ClientCatalogConfigType_Choices = {
  id: string;
  label: string;
  order: number;
  available: string[];
  value: number;
  ref?: string;
};

export type ClientCatalogConfigType_Type = "ADD" | "REMOVE";

export type ClientCatalogConfigType = {
  id: string;
  type: ClientCatalogConfigType_Type;
  limit?: number;
  label: string;
  isRequired: boolean;
  order: number;
  choices: choicesv2[];
  hide: string[];
  value?: number;
};

export type choicesv2 = {
  id?: string;
  label: string;
  order: number;
  // available: string[];
  value: number;
  ref?: string;
  refPriceOverride?: number;
};

export type CartItemChoicesConfigType = {
  id: string;
  label: string;
  // order: number;
  // avaliable: string[];
  value: number;
};

export type CartItemConfigType = {
  id: string;
  type: ClientCatalogConfigType_Type;
  label: string;
  order: number;
  choice: CartItemChoicesConfigType;
};

export type CartItemAddorRemoveConfigType = {
  id: string;
  label: string;
  // order: number;
  // avaliable: string[];
  value: number;
};

// entity describes a cart item
export type CartItemType = {
  name: string; // max length 25
  price: number; // positive int
  id: string; // from firebase
  cartId: string;
  options?: CartItemConfigType[];
  note: string;
  add?: CartItemAddorRemoveConfigType[];
  remove?: CartItemAddorRemoveConfigType[];
  // more?
};
