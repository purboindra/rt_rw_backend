export interface CreateActivityParams {
  /// Epoch
  date: number;
  title: string;
  type: string;
  accessToken: string;
  description?: string;
  picId: string;
  createdById: string;
  userIds: string[];
}

export interface UpdateActivityParams {
  /// Epoch
  date?: number;
  accessToken: string;
  description?: string;
  picId?: string;
  userIds?: string[];
}

export interface UpsertFcmTokenInterface {
  fcmToken: string;
  platform: DevicePlatformEnum;
  deviceModel?: string;
  osVersion?: string;
  appVersion?: string;
  userId: string;
}

export interface NotifyFCMInterface {
  title: string;
  body: string;
  fcmTokens: string[];
  data?: Record<string, string>;
  collapseKey?: string;
  ttlSeconds?: number;
  idempotencKey?: string;
}

export interface CreateUserInput {
  name: string;
  phone: string;
  email?: string;
  address: string;
  role: Role;
  rtId: string;
}
