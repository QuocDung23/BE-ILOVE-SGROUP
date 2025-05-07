import crypto from "crypto";

function createResetPassToken() {
  const createToken = crypto.randomBytes(32).toString("hex");
  const hashToken = crypto
    .createHash("sha256")
    .update(createToken)
    .digest("hex");
  const expireTime = Date.now() + 10 * 60 * 1000;

  console.log('Reset token:', createToken);
  console.log('Hashed token:', hashToken);
  console.log('Time limit:', expireTime);
  
  return { createToken, hashToken, expireTime };
}

export { createResetPassToken };
