// lib/utils/device.ts
import * as SecureStore from "expo-secure-store";
import { v4 as uuidv4 } from "uuid";
import * as Application from "expo-application";
import * as Network from "expo-network";
import * as Device from "expo-device";
import { Platform } from "react-native";

const DEVICE_ID_KEY = "device-id";

export const getDeviceId = async (): Promise<{
  deviceId: string;
  ip: string;
  userAgent: string;
  os: string;
  deviceType: string;
}> => {
  let deviceId = await SecureStore.getItemAsync(DEVICE_ID_KEY);
  const ip = await Network.getIpAddressAsync();
  const userAgent = "";
  const os = Device.osName ?? "Unknown";
  const deviceType = Device.modelName ?? "Unknown";

  if (!deviceId) {
    let newDeviceId: string | undefined;
    if (Platform.OS !== "web" && Application?.applicationId) {
      newDeviceId = Application.applicationId;
    }
    if (!newDeviceId) {
      deviceId = uuidv4();
    } else {
      deviceId = newDeviceId;
    }
    await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceId);
  }
  return { deviceId, ip, userAgent, os, deviceType };
};
