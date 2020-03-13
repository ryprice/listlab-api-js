/**
 * Represents a person identity which may or may not be
 * a real user in the system. It could also just be a string
 * representation of that person's name, or an email address
 * of someone who has been invited but has not created an account.
 */
export default class MaybeUser {

  userId: number;

  name: string;

  public constructor(userId: number, name: string) {
    this.userId = userId;
    this.name = name;
  }

  public equals(other: MaybeUser) {
    if (this.userId && other.userId) {
      return this.userId === other.userId;
    } else if (
      this.name != null && this.name.length > 0 &&
      other.name != null && other.name.length > 0
    ) {
      return this.name === other.name;
    } else {
      return (
        !this.userId &&
        !other.userId &&
        (this.name == null || this.name.length === 0) &&
        (other.name == null || other.name.length === 0)
      );
    }
  }
}
