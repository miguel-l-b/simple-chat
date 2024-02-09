import TUser from "./user"

type TMessage = {
  id: string;
  type: "text";
  content: string;
  author: Omit<TUser, "email">;
  createAt: Date;
  read: boolean;
}

export default TMessage
