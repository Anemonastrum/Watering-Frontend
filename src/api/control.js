import api from "./axios";

export const setPump = (state, duration) =>
  api.post("/control/pump", { state, duration });

export const updateConfig = (config) =>
  api.post("/control/config", config);

export function setAutoMode(auto_mode) {
  return axios.post("/control/config", {
    auto_mode,
  });
  
}