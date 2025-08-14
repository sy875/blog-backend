// app.test.ts
import dotenv from "dotenv";
dotenv.config();

import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import { User } from "../models/user.models.js";
import {
  adminRoute,
  authRoute,
  categoryRoute,
  commentRoute,
  PostApprovalType,
  postRoute,
  PostStatusType,
} from "../utils/Constants.js";

let userToken = "";
let adminToken = "";

function randomString(length: number) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const normalUser = {
  username: `user_${randomString(6)}`,
  email: `${randomString(8)}@example.com`,
  password: "Test@1234",
};

const adminUser = {
  username: `admin_${randomString(6)}`,
  email: `${randomString(8)}@example.com`,
  password: "Test@1234",
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI!);
  await User.deleteMany({});

  // Register both users
  await request(app).post(`${authRoute}/register`).send(normalUser);
  await request(app).post(`${authRoute}/register`).send(adminUser);

  // Promote admin in DB
  await User.findOneAndUpdate({ email: adminUser.email }, { role: "admin" });

  // Login normal user
  const userLogin = await request(app).post(`${authRoute}/login`).send({
    email: normalUser.email,
    password: normalUser.password,
  });
  userToken = userLogin.body.data.accessToken;

  // Login admin user
  const adminLogin = await request(app).post(`${authRoute}/login`).send({
    email: adminUser.email,
    password: adminUser.password,
  });
  adminToken = adminLogin.body.data.accessToken;
});

afterAll(async () => {
  await mongoose.connection.close();
});

// Helpers for authenticated requests
const userRequest = {
  get: (url: string) =>
    request(app).get(url).set("Authorization", `Bearer ${userToken}`),
  post: (url: string) =>
    request(app).post(url).set("Authorization", `Bearer ${userToken}`),
  put: (url: string) =>
    request(app).put(url).set("Authorization", `Bearer ${userToken}`),
  patch: (url: string) =>
    request(app).patch(url).set("Authorization", `Bearer ${userToken}`),
  delete: (url: string) =>
    request(app).delete(url).set("Authorization", `Bearer ${userToken}`),
};

const adminRequest = {
  get: (url: string) =>
    request(app).get(url).set("Authorization", `Bearer ${adminToken}`),
  post: (url: string) =>
    request(app).post(url).set("Authorization", `Bearer ${adminToken}`),
  put: (url: string) =>
    request(app).put(url).set("Authorization", `Bearer ${adminToken}`),
  delete: (url: string) =>
    request(app).delete(url).set("Authorization", `Bearer ${adminToken}`),
};

// Category
describe("Category routes", () => {
  it("should NOT allow normal user to create a category", async () => {
    const res = await userRequest.post(`${categoryRoute}/`).send({
      name: "User Created Category",
      description: "Should fail",
    });
    expect(res.statusCode).toBe(403); // Forbidden
  });

  it("should allow admin to create a category", async () => {
    const name = randomString(10);

    const res = await adminRequest.post(`${categoryRoute}/`).send({
      name,
      description: "Created by admin",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.name).toBe(name);
  });
});

//Post test
describe("Post routes", () => {
  let approvedPostId: string;
  let unApprovedPostId: string;

  beforeAll(async () => {
    const randomstr = randomString(5);
    const randomstr2 = randomString(5);
    const postData = {
      title: "Test Post for CRUD" + randomstr,
      description: "Testing get, update, delete",
      body: "This is a test post body",
      isFeatured: false,
      status: PostStatusType.PUBLISHED,
    };
    const postData2 = {
      ...postData,
      title: "Test Post for CRUD -2" + randomstr2,
    };
    const res = await userRequest.post(`${postRoute}/`).send(postData);
    const res2 = await userRequest.post(`${postRoute}/`).send(postData2);

    const adminres = await adminRequest
      .put(`${adminRoute}/posts/${res.body.data._id}/approve`)
      .send({
        status: "APPROVED",
        approvalComment: "Looks good",
      });
    // console.log("===========", res2);
    approvedPostId = res.body.data._id;
    unApprovedPostId = res2.body.data._id;
  });

  it("should allow user to create a post", async () => {
    const randomstr = randomString(5);
    const postData = {
      title: "10 Tips for Writing Clean Code" + randomstr,
      description:
        "A beginner-friendly guide to improving code readability and maintainability.",
      body: "Writing clean code is essential for long-term maintainability...",
      status: PostStatusType.PUBLISHED,
      isFeatured: true,
    };
    const res = await adminRequest.post(`${postRoute}/`).send(postData);
    // console.log("--------------------->", res);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.title).toBe(postData.title);
  });

  it("should get all posts ", async () => {
    const res = await userRequest.get(`${postRoute}/`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.some((p: any) => p._id === approvedPostId)).toBe(true);
  });

  it("should get a post by ID", async () => {
    const res = await userRequest.get(`${postRoute}/${approvedPostId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data._id).toBe(approvedPostId);
  });

  it("should update a post", async () => {
    let randomstr = randomString(5);
    const updatedData = { title: "Updated Test Post" + randomstr };
    const res = await userRequest
      .put(`${postRoute}/${unApprovedPostId}`)
      .send(updatedData);
    // console.log(
    //   "un app id =============>",
    //   unApprovedPostId,
    //   "user token ===> ",
    //   userToken,
    //   "admin token  ===>",
    //   adminToken
    // );
    expect(res.statusCode).toBe(200);
    expect(res.body.data.updatedPost.title).toBe(updatedData.title);
  });

  it("should delete a post", async () => {
    const res = await userRequest.delete(`${postRoute}/${unApprovedPostId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  it("should get all pending posts as admin", async () => {
    // Create another post to have pending posts
    let randomstr = randomString(5);
    const postData = {
      title: "Pending Post" + randomstr,
      description: "Pending approval",
      body: "Body of pending post",
      status: PostStatusType.PUBLISHED,
      isFeatured: false,
    };
    const created = await userRequest.post(`${postRoute}/`).send(postData);
    // console.log("created ===", created);
    const res = await adminRequest.get(`${adminRoute}/posts`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data.allPendingPost)).toBe(true);
    expect(
      res.body.data.allPendingPost.some(
        (p: any) => p._id === created.body.data._id
      )
    ).toBe(true);
  });

  it("should allow admin to update post approval status", async () => {
    // Get a pending post
    const pendingRes = await adminRequest.get(`${adminRoute}/posts`);
    const pendingPostId = pendingRes.body.data.allPendingPost[0]._id;

    const res = await adminRequest
      .put(`${adminRoute}/posts/${pendingPostId}/approve`)
      .send({
        status: PostApprovalType.APPROVED,
        comment: "Looks good",
      });

    // console.log("approval ===", res);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.approvalStatus).toBe(PostApprovalType.APPROVED);
    expect(res.body.data.approvalComment).toBe("Looks good");
  });
});

//comment routes

describe("Comment routes", () => {
  let postId: string;
  let commentId: string;

  beforeAll(async () => {
    const randomstr = randomString(5);
    const postData = {
      title: "Test Post for CRUD" + randomstr,
      description: "Testing get, update, delete",
      body: "This is a test post body",
      isFeatured: false,
      status: PostStatusType.PUBLISHED,
    };

    const res = await userRequest.post(`${postRoute}/`).send(postData);
    const adminres = await adminRequest
      .put(`${adminRoute}/posts/${res.body.data._id}/approve`)
      .send({
        status: "APPROVED",
        approvalComment: "Looks good",
      });
    postId = res.body.data._id;
    // console.log("post is ==>", postId);
  });

  it("should allow user to create a comment", async () => {
    const res = await userRequest.post(`${commentRoute}/${postId}`).send({
      comment: "This is a test comment",
    });
    // console.log("comment is ==>", res);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.comment.comment).toBe("This is a test comment");

    commentId = res.body.data.comment._id;
  });

  it("should get all comments for a post", async () => {
    const res = await userRequest.get(`${commentRoute}/${postId}`);
    // console.log(res.body);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data.allComments)).toBe(true);
    expect(
      res.body.data.allComments.some((c: any) => c._id === commentId)
    ).toBe(true);
  });

  it("should allow user to update their comment", async () => {
    const res = await userRequest.patch(`${commentRoute}/${commentId}`).send({
      comment: "Updated test comment",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.comment).toBe("Updated test comment");
  });

  it("should allow user to delete their comment", async () => {
    const res = await userRequest.delete(`${commentRoute}/${commentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});

