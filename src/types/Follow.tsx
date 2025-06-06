import { User } from "./User";

export class Follow {
  constructor(
    private _id: number,
    private _followerId: number,
    private _followingId: number,
    private _follower: User,
    private _following: User
  ) {}

  public get id(): number {
    return this._id;
  }
  public get followerId(): number {
    return this._followerId;
  }
  public get followingId(): number {
    return this._followingId;
  }
  public get follower(): User {
    return this._follower;
  }
  public get following(): User {
    return this._following;
  }

  public set id(id: number) {
    this._id = id;
  }
  public set followerId(followerId: number) {
    this._followerId = followerId;
  }
  public set followingId(followingId: number) {
    this._followingId = followingId;
  }
  public set follower(follower: User) {
    this._follower = follower;
  }
  public set following(following: User) {
    this._following = following;
  }
}
