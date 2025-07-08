export interface CreateActivityParams {
  date: string;
  title: string;
  type: string;
  accessToken: string;
  description?: string;
}

export interface UpdateActivityParams {
  date: string;
  title: string;
  type: string;
  accessToken: string;
  description?: string;
}
