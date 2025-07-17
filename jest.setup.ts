// jest.setup.ts
import * as dotenv from "dotenv";

// test用envファイルを読み込むよう設定
dotenv.config({ path: ".env.test" });

require("@testing-library/jest-dom");

beforeAll(() => {
  window.alert = jest.fn();
});
