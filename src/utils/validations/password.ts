export default class PasswordValidator {
  static validate = (input: string) =>
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,20}$/
      .test(input)
}