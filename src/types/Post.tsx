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
    private _likes: Like[],
    private _parentId?: number | null,
    private _parent?: Post | null,
    private _mediaUrl?: string | null,
    private _reposts?: Post[]
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

  public get likes(): Like[] {
    return this._likes;
  }
  public set likes(likes: Like[]) {
    this._likes = likes;
  }

  public get parentId(): number | null | undefined {
    return this._parentId;
  }
  public set parentId(parentId: number | null | undefined) {
    this._parentId = parentId;
  }

  public get parent(): Post | null | undefined {
    return this._parent;
  }
  public set parent(parent: Post | null | undefined) {
    this._parent = parent;
  }

  public get mediaUrl(): string | null | undefined {
    return this._mediaUrl;
  }
  public set mediaUrl(mediaUrl: string | null | undefined) {
    this._mediaUrl = mediaUrl;
  }

  public get reposts(): Post[] | undefined {
    return this._reposts;
  }
  public set reposts(reposts: Post[] | undefined) {
    this._reposts = reposts;
  }
}
