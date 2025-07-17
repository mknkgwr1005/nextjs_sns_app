// __mocks__/apiClient.ts
const mockApiClient = {
  get: jest.fn().mockResolvedValue({
    data: [
      {
        type: "post",
        post: {
          id: 1,
          content: "Hello",
          userId: "user1",
          author: {
            profile: {
              profileImageUrl: "https://example.com/image.png", // ← 必須
            },
          },
        },
        user: {
          id: "user1",
          username: "Taro",
        },
        createdAt: "2023-01-01T00:00:00.000Z",
      },
    ],
  }),
  post: jest.fn().mockResolvedValue({
    data: {
      type: "post",
      post: {
        id: 2,
        content: "New post",
        userId: "user1",
        author: {
          profile: {
            profileImageUrl: "https://example.com/image2.png",
          },
        },
      },
      user: {
        id: "user1",
        username: "Taro",
      },
      createdAt: "2023-01-02T00:00:00.000Z",
    },
  }),
};

export default mockApiClient;
