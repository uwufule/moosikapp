interface ApiResponse<T = undefined> {
  message: string;
  result: T;
}

export default ApiResponse;
