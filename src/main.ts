import { decodeJwt } from "jose";
import { ok, err, Result } from "neverthrow";

const token = process.env.TOKEN;

function createErrorMessage(error: unknown, message: string) {
  if (error instanceof Error) {
    return err(`${message}: ${error.message}`);
  }
  return err(`${message}: ${error}`);
}

function getExpData(token: string) {
  try {
    const decoded = decodeJwt(token);
    return ok({ decoded });
  } catch (error) {
    return createErrorMessage(error, "getExpData");
  }
}

function getExpireDateTimeLocal(exp: number | undefined) {
  try {
    if (!exp) return err("exp is undefined");
    const convertExp = exp * 1000;
    const dateLocal = new Date(convertExp).toLocaleDateString();
    const timeLocal = new Date(convertExp).toLocaleTimeString();
    return ok({ dateLocal, timeLocal });
  } catch (error) {
    return createErrorMessage(error, "getExpireDateTimeLocal");
  }
}

function getExpire(tokenParam: string) {
  return getExpData(tokenParam)?.match(
    (data) => {
      const exp = data.decoded.exp;
      return getExpireDateTimeLocal(exp);
    },
    (error) => {
      return err(error);
    }
  );
}

getExpire("")?.match(
  (data) => console.log("🌼 :", data),
  (error) => console.error("⛑️ : ", error)
);
