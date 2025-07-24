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

export const dummyFollower = new User(
  1,
  "Hanako",
  "hanako@example.com",
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
dummyFollower.profile = dummyProfile;

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

export const dummyFollowerPost = new Post(
  1,
  "I am your follower.",
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
    if (url === "/posts/get_latest_post") {
      const { postLength } = body.params;
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
    } else if (url === "/posts/get_following_post") {
      return Promise.resolve({
        data: [
          {
            type: "post",
            createdAt: "2023-01-01T00:00:00.000Z",
            post: dummyFollowerPost,
          },
        ],
      });
    }
    return Promise.resolve({ data: [] }); // その他エンドポイントは空データ
  }),
  post: jest.fn((url: string, body?: any) => {
    if (url === "/auth/register") {
      const { username, email, password } = body || {};
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordPattern = /^[\w]{8,}$/;

      if (!username || !email || !password) {
        return Promise.reject({
          response: {
            data: {
              error: "Invalid Value",
            },
          },
        });
      }
      if (!email.match(emailPattern)) {
        return Promise.reject({
          response: {
            data: {
              error: "Invalid email address",
            },
          },
        });
      }
      if (!password.match(passwordPattern)) {
        return Promise.reject({
          response: {
            data: {
              error: "Invalid password",
            },
          },
        });
      }
      return Promise.resolve({
        data: {
          user: dummyUser,
        },
      });
    } else if (url === "/posts/add_like") {
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
        return new Promise((_, reject) => {
          setTimeout(() => {
            // 意図的に遅延させないと、ローディングが表示されない
            reject({
              response: {
                status: 401,
                data: {
                  error: "your email address or password is not registered",
                },
              },
            });
          }, 100);
        });
      } else {
        const token = "12345678ADHRWEWOSAAA";
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              data: {
                token: token,
                dummyUser: dummyUser,
              },
            });
          }, 100);
        });
      }
    } else if (url === "/posts/post") {
      const { content, mediaUrl } = body;

      if (!content) {
        return Promise.reject({
          message: "投稿内容がありません。",
        });
      }

      const newPost = new Post(
        1,
        content,
        "2023-01-01T00:00:00.000Z",
        1,
        dummyUser,
        [],
        [],
        0,
        undefined,
        mediaUrl
      );

      return Promise.resolve({
        data: {
          type: "post",
          createdAt: "2023-01-01T00:00:00.000Z",
          post: newPost,
        },
      });
    } else if (url === "/posts/get_post_status") {
      const mockData = {
        likes: [
          {
            id: 8,
            userId: 1,
            postId: 6,
          },
        ],
        reposts: [
          {
            id: 3,
            userId: 1,
            postId: 31,
            createdAt: "2025-06-26T05:42:57.242Z",
          },
        ],
        statuses: [
          {
            id: 1,
            content: "hello",
            createdAt: "2025-06-06T02:05:41.730Z",
            authorId: 1,
            parentId: null,
            mediaUrl: null,
            replies: [
              {
                id: 20,
                content: "こんちは",
                createdAt: "2025-06-19T05:37:35.068Z",
                authorId: 2,
                parentId: 1,
                mediaUrl: null,
              },
            ],
            likes: [
              {
                id: 16,
                userId: 2,
                postId: 1,
              },
            ],
            reposts: [],
          },
        ],
      };
      return Promise.resolve({
        data: mockData,
      });
    }

    return Promise.resolve({ data: [] }); // その他エンドポイントは空データ
  }),
};

export default mockApiClient;
