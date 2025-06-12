import { Post } from "./Post";
import { Profile } from "./Profile";
import { Follow } from "./Follow";
import { Like } from "./Like";

export class User {
  constructor(
    private _id: number,
    private _username: string,
    private _email: string,
    private _password: string,
    private _posts: Post[],
    private _profile: Profile | null,
    private _followers: Follow[],
    private _following: Follow[],
    private _likes: Like[]
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

  public get posts(): Post[] {
    return this._posts;
  }
  public set posts(posts: Post[]) {
    this._posts = posts;
  }

  public get profile(): Profile | null {
    return this._profile;
  }
  public set profile(profile: Profile | null) {
    this._profile = profile;
  }

  public get followers(): Follow[] {
    return this._followers;
  }
  public set followers(followers: Follow[]) {
    this._followers = followers;
  }

  public get following(): Follow[] {
    return this._following;
  }
  public set following(following: Follow[]) {
    this._following = following;
  }

  public get likes(): Like[] {
    return this._likes;
  }
  public set likes(likes: Like[]) {
    this._likes = likes;
  }
}
