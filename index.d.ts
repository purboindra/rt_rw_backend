export interface CreateActivityParams {
  /// Epoch
  date: number;
  title: string;
  type: string;
  accessToken: string;
  description?: string;
  picId: string;
}

export interface UpdateActivityParams {
  /// Epoch
  date: number;
  title: string;
  type: string;
  accessToken: string;
  description?: string;
}
