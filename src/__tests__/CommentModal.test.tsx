//  it("リプライできるか", async () => {
//     const repostBtn = screen.getByRole("button", { name: /replies/i });
//     await userEvent.click(repostBtn);

//     // Modalが表示されるか
//     await waitFor(() => {
//       const dummyStatus = {
//         id: 2,
//         likes: [],
//         replies: [],
//         reposts: [],
//       };

//       const dummyPostStatuses = {
//         statuses: Array(dummyStatus),
//         likes: [
//           {
//             postId: 2,
//           },
//         ],
//         reposts: [
//           {
//             postId: 2,
//           },
//         ],
//       };

//       const dummyPostIds = [1, 2, 3];

//       render(
//         <CommentModal
//           isOpen={true}
//           onClose={() => {
//             return false;
//           }}
//           parentId={1}
//           fetchLatestPost={() => {}}
//           loginUserId={2}
//           postStatuses={dummyPostStatuses}
//           postIds={dummyPostIds}
//         />
//       );
//     });
//   });
