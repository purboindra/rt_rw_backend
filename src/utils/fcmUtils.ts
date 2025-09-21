export const pushFcmTokens = (users: any, userId: string): string[] => {
  let fcm_tokens: string[] = [];

  for (const user of users) {
    const devices = user.devices;
    if (devices) {
      for (const device of devices) {
        const fcmToken = device.fcmToken;
        const isRevoked = device.isRevoked;

        if (!isRevoked && user.id !== userId) {
          fcm_tokens.push(fcmToken);
        }
      }
    }
  }

  return fcm_tokens;
};
