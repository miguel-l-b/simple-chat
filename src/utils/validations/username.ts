export default class UsernameValidator {
  static validate = (input: string) =>
    input.length >= 3 &&
    input.length <= 20 &&
    /^[a-zA-Z0-9-_]+$/
      .test(input)
}