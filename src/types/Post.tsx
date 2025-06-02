import { Profile } from "./Profile";
import { User } from "./User";

export class Post {
  constructor(
    private _id: number,
    private _content: string,
    private _createdAt: string,
    private _authorId: number,
    private _author: User
  ) {}
  public get id(): number {
    return this._id;
  }

  public set id(id: number) {
    this._id = id;
  }

  public get content(): string {
    return this._content;
  }

  public set content(content: string) {
    this._content = content;
  }

  public get createdAt(): string {
    return this._createdAt;
  }

  public set createdAt(createdAt: string) {
    this._createdAt = createdAt;
  }

  public get authorId(): number {
    return this._authorId;
  }

  public set authorId(authorId: number) {
    this._authorId = authorId;
  }

  public get author(): User {
    return this._author;
  }

  public set author(author: User) {
    this._author = author;
  }
}
