import { User } from "./User";
import { Like } from "./Like";

export class Post {
  constructor(
    private _id: number,
    private _content: string,
    private _createdAt: string,
    private _authorId: number,
    private _author: User,
    private _replies: Post[],
    private _parentId?: number,
    private _parent?: Post,
    private _likes?: Like[],
    private _mediaUrl?: string
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

  public get replies(): Post[] {
    return this._replies;
  }
  public set replies(replies: Post[]) {
    this._replies = replies;
  }

  public get parentId(): number | undefined {
    return this._parentId;
  }
  public set parentId(parentId: number | undefined) {
    this._parentId = parentId;
  }

  public get parent(): Post | undefined {
    return this._parent;
  }
  public set parent(parent: Post | undefined) {
    this._parent = parent;
  }

  public get likes(): Like[] | undefined {
    return this._likes;
  }
  public set likes(likes: Like[] | undefined) {
    this._likes = likes;
  }

  public get mediaUrl(): string | undefined {
    return this._mediaUrl;
  }
  public set mediaUrl(mediaUrl: string | undefined) {
    this._mediaUrl = mediaUrl;
  }
}
