import { User } from "./User";
import { Post } from "./Post";

export class Like {
  constructor(
    private _id: number,
    private _userId: number,
    private _postId: number,
    private _user: User,
    private _post: Post
  ) {}

  public get id(): number {
    return this._id;
  }
  public get userId(): number {
    return this._userId;
  }
  public get postId(): number {
    return this._postId;
  }
  public get user(): User {
    return this._user;
  }
  public get post(): Post {
    return this._post;
  }

  public set id(id: number) {
    this._id = id;
  }
  public set userId(userId: number) {
    this._userId = userId;
  }
  public set postId(postId: number) {
    this._postId = postId;
  }
  public set user(user: User) {
    this._user = user;
  }
  public set post(post: Post) {
    this._post = post;
  }
}
