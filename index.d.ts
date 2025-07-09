export interface CreateActivityParams {
  /// Epoch
  date: number;
  title: string;
  type: string;
  accessToken: string;
  description?: string;
  picId: string;
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
