import TUser from "./user"

type TMessage = {
  type: "text";
  content: string;
  author: Omit<TUser, "email">;
  createAt: Date;
  read: boolean;
}

export default TMessage
