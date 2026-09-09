import jwt from "jsonwebtoken";

export const ACCESS_TOKEN_COOKIE = "token";
export const REFRESH_TOKEN_COOKIE = "refreshToken";

export const ACCESS_TOKEN_TTL = "15m";
export const REFRESH_TOKEN_TTL = "7d";

const isProductionLike =
  process.env.NODE_ENV === "production" || Boolean(process.env.RENDER);

const cookieBase = {
  httpOnly: true,
  sameSite: isProductionLike ? "None" : "Lax",
  secure: isProductionLike,
  path: "/",
};

export const accessCookieOptions = {
  ...cookieBase,
  maxAge: 15 * 60 * 1000,
};

export const refreshCookieOptions = {
  ...cookieBase,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const signAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
  });
};

export const signRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_TTL,
  });
};

export const setAuthCookies = (res, payload) => {
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken({
    ...payload,
    type: "refresh",
  });

  res.cookie(ACCESS_TOKEN_COOKIE, accessToken, accessCookieOptions);
  res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, refreshCookieOptions);

  return { accessToken, refreshToken };
};

export const clearAuthCookies = (res) => {
  res.clearCookie(ACCESS_TOKEN_COOKIE, cookieBase);
  res.clearCookie(REFRESH_TOKEN_COOKIE, cookieBase);
};

export const parseCookies = (cookieHeader = "") => {
  return cookieHeader
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean)
    .reduce((acc, item) => {
      const [key, ...rest] = item.split("=");
      acc[key] = decodeURIComponent(rest.join("="));
      return acc;
    }, {});
};
