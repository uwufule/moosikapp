type Timestamp<T> = T & {
  iat: number;
  exp: number;
};

export default Timestamp;
