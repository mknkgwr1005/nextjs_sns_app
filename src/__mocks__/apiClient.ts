import { User } from "../types/User";
import { Post } from "../types/Post";
import { Profile } from "../types/Profile";
import { Follow } from "../types/Follow";
import { Like } from "../types/Like";

// ダミーのProfile、Follow、Likeを用意

const dummyFollows: Follow[] = [];
const dummyLikes: Like[] = [];
const dummyPosts: Post[] = [];

// ユーザーインスタンスを作成
// ① 先に空のUserを仮で作成（profileにはnull）
const dummyUser = new User(
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
const dummyProfile = new Profile(1, "Hello", "", 1, dummyUser);

// ③ user側の profile をセットし直す
dummyUser.profile = dummyProfile;

// Postインスタンスも作成
const dummyPost = new Post(
  1,
  "Hello world",
  "2023-01-01T00:00:00.000Z",
  1,
  dummyUser,
  [],
  []
);

const mockApiClient = {
  get: jest.fn((url: string) => {
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
    }

    return Promise.resolve({ data: [] }); // その他エンドポイントは空データ
  }),

  post: jest.fn().mockResolvedValue({ data: { success: true } }),
};

export default mockApiClient;
