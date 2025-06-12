import { User } from "./User";

export class Profile {
  constructor(
    private _id: number,
    private _bio: string | null,
    private _profileImageUrl: string | null,
    private _userId: number,
    private _user: User
  ) {}

  public get id(): number {
    return this._id;
  }
  public set id(id: number) {
    this._id = id;
  }

  public get bio(): string | null {
    return this._bio;
  }
  public set bio(bio: string | null) {
    this._bio = bio;
  }

  public get profileImageUrl(): string | null {
    return this._profileImageUrl;
  }
  public set profileImageUrl(profileImageUrl: string | null) {
    this._profileImageUrl = profileImageUrl;
  }

  public get userId(): number {
    return this._userId;
  }
  public set userId(userId: number) {
    this._userId = userId;
  }

  public get user(): User {
    return this._user;
  }
  public set user(user: User) {
    this._user = user;
  }
}
