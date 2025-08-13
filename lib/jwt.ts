import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev_super_secret_change_me");
const issuer = "avsec-quiz";
const audience = "avsec-users";

export async function sign(payload: object) {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(issuer)
    .setAudience(audience)
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verify(token: string) {
  const { payload } = await jwtVerify(token, secret, { issuer, audience });
  return payload;
}
