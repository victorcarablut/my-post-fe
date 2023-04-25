// ⦿ important: in [.env (file)] the name of API should start with -> REACT_APP_
// URL HOST
// const host = "localhost";
// export const url = `http://${host}:8080/api`;

const host_backend = process.env.REACT_APP_MY_POST_BE_API;

export const url = host_backend;