import firebase from "firebase/compat/app";
import { CartOrderType } from "../contexts/CartContext";
import { CartItemType } from "./Client";

export type UserType = {
  name: string;
  email: string;
  phoneNumber: string;
};

export type UserMessageType = {
  createdFor: string;
  ref: {
    type: "order" | "event" | "unprompted";
    id?: string;
  };
  log: [
    {
      createdAt: Date;
      by: string;
      message: string;
    }
  ];
  id: string;
  status: "OPEN" | "CLOSED";
  createdAt: firebase.firestore.Timestamp;
};

type UserOrderStatusType =
  | "ERROR"
  | "IN-COMPLETE"
  | "PAID"
  | "CANCELLED"
  | "IN-PROGRESS"
  | "READY"
  | "COMPLETED";

type UserOrderVersionType = "v1" | "v2";

export type newUserOrderType = {
  version: UserOrderVersionType;
  shortCode: number;
  error?: any;
  store: {
    id: string;
    branch: {
      name: string;
      phone: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    };
  };
  customer: {
    id: string;
    email: string;
    phoneNumber: string;
    name: string;
    note: string;
  };
  order: {
    logistics: "delivery" | "pickup";
    managed_delivery: boolean;
    status: UserOrderStatusType;
    cart: CartOrderType;
    channel: "STORE" | "WEB" | "APP";
    eta: Date;
    expectRefund?: string;
    challenge?: number;
    location?: {
      lat: number;
      lng: number;
      text: string;
    };
    reviewText: string;
    reviewRating: number;
    customerCancellation: boolean;
    total: number;
    deliveryTotal: number;
  };
  createdAt: firebase.firestore.Timestamp;
  id?: string;
};

export type UserOrderType = {
  version: UserOrderVersionType;
  logistics: "delivery" | "pickup";
  branch: string;
  managed_delivery: boolean;
  discount?: {
    discount: number;
    type: string;
  };
  deliveryTotal: number;
  storeName: string;
  storeWebsite: string;
  storeAlphaSenderID: string;
  branchName: string;
  branchPhoneNumber: string;
  branchCoordinates: {
    lat: number;
    lng: number;
  };
  location: {
    lat: number;
    lng: number;
    text: string;
  };
  cart: CartItemType[];
  total: number;
  store: string;
  shortCode: number;
  customerNote: string;
  customerId: string;
  customerEmail: string;
  customerPhoneNumber: string;
  customerName: string;
  createdAt?: firebase.firestore.Timestamp;
  status:
    | "ERROR"
    | "IN-COMPLETE"
    | "PAID"
    | "CANCELLED"
    | "IN-PROGRESS"
    | "READY"
    | "COMPLETED";
  deliveryTotalPaid: boolean;
  error?: any;
  customerRequestCancellation: boolean;
  reviewText: string;
  reviewRating: number;
  channel: "STORE" | "WEB" | "APP";
  eta: Date;
  branchTextNotificationPhoneNumber: string;
  expectRefund?: string;
  challenge: number;
  id?: string;
};
