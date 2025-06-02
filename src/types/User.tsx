import { Post } from "./Post";
import { Profile } from "./Profile";

export class User {
  constructor(
    private _id: number,
    private _username: string,
    private _email: string,
    private _password: string,
    private _posts: Array<Post>,
    private _profile: Profile
  ) {}

  public get id(): number {
    return this._id;
  }

  public set id(id: number) {
    this._id = id;
  }

  public get username(): string {
    return this._username;
  }

  public set username(username: string) {
    this._username = username;
  }

  public get email(): string {
    return this._email;
  }

  public set email(email: string) {
    this._email = email;
  }

  public get password(): string {
    return this._password;
  }

  public set password(password: string) {
    this._password = password;
  }

  public get posts(): Array<Post> {
    return this._posts;
  }

  public set posts(posts: Array<Post>) {
    this._posts = posts;
  }

  public get profile(): Profile {
    return this._profile;
  }

  public set profile(profile: Profile) {
    this._profile = profile;
  }
}
