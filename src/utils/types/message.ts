import TUser from "./user"

type TMessage = {
  id: string;
  type: "text";
  content: string;
  author: Omit<TUser, "email">;
  date: Date;
  read: boolean;
}

export default TMessage
