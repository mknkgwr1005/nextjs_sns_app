import { User } from "../types/User";
import { Post } from "../types/Post";
import { Profile } from "../types/Profile";
import { Follow } from "../types/Follow";
import { Like } from "../types/Like";

// ダミーのProfile、Follow、Likeを用意
export const dummyFollows: Follow[] = [];
export const dummyLikes: Like[] = [];
export const dummyPosts: Post[] = [];

// ユーザーインスタンスを作成
// ① 先に空のUserを仮で作成（profileにはnull）
export const dummyUser = new User(
  1,
  "Taro",
  "test@example.com",
  "password",
  [], // posts
  null, // profile はまだ未定
  [], // followers
  [], // following
  [] // likes
);

// ② Profileを作成し、userとして dummyUser を渡す
export const dummyProfile = new Profile(
  1,
  "Hello",
  "/racoon.png", // プロフィール画像のパス
  1,
  dummyUser
);

// ③ user側の profile をセットし直す
dummyUser.profile = dummyProfile;

// Postインスタンスも作成
export const dummyPost = new Post(
  1,
  "Hello world",
  "2023-01-01T00:00:00.000Z",
  1,
  dummyUser,
  [], // いいね
  [] // コメント
);

const dummyParentId = 1;

// mockApiClientの作成
const mockApiClient = {
  get: jest.fn((url: string, body?: any) => {
    if (url === "/posts/timeline") {
      return Promise.resolve({
        data: [
          {
            type: "post",
            createdAt: "2023-01-01T00:00:00.000Z",
            post: dummyPost,
          },
        ],
      });
    } else if (url === `/posts/get_parent_post/${dummyParentId}`) {
      return Promise.resolve({
        data: dummyPost,
      });
    }
    return Promise.resolve({ data: [] }); // その他エンドポイントは空データ
  }),
  post: jest.fn((url: string, body?: any) => {
    if (url === "/posts/add_like") {
      return Promise.resolve({
        data: {
          isLiked: true,
          newLike: {
            postId: 1,
            userId: 2,
          },
        },
      });
    } else if (url === "/posts/add_repost") {
      return Promise.resolve({
        data: {
          type: "repost",
          createdAt: "2023-01-01T00:00:00.000Z",
          post: dummyPost,
          respostedBy: dummyUser,
          isReposted: true,
        },
      });
    } else if (url === `/posts/reply/${dummyParentId}`) {
      return Promise.resolve({
        data: {
          type: "post",
          createdAt: "2023-01-01T00:00:00.000Z",
          post: dummyPost,
        },
      });
    } else if (url === "/auth/login") {
      const { email, password } = body || {};
      if (email === "fail@example.com" && password === "failpass") {
        return Promise.reject({
          response: {
            status: 401,
            data: {
              error: "your email address or password is not registered",
            },
          },
        });
      } else {
        const token = "12345678ADHRWEWOSAAA";
        return Promise.resolve({
          data: {
            token: token,
            dummyUser: dummyUser,
          },
        });
      }
    }
    return Promise.resolve({ data: [] }); // その他エンドポイントは空データ
  }),
};

export default mockApiClient;
