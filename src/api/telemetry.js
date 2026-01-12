import api from "./axios";

export const getLatestTelemetry = () =>
  api.get("/telemetry/latest");

export const getPumpDaily = () =>
  api.get("/telemetry/pump/daily");

export const getAlerts = () =>
  api.get("/telemetry/alerts");

export const getHourlyStats = () =>
  api.get("/telemetry/hourly");

export const getDailyStats = () =>
  api.get("/telemetry/daily");

export const getDailyPumpUsage = () =>
  api.get("/telemetry/pump/daily");
