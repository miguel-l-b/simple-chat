import TLoginToken from "@/types/login-token"
import Cache from "./cache"

export default function validToken(token: TLoginToken["id"]): boolean {
  const login_token = Cache.get<TLoginToken>("login_token", token)
  if(!login_token) return false
  if(login_token.expiresIn < new Date()) {
    Cache.delete("login-token", token)
    return false
  }
  return true
}
