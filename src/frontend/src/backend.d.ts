import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Post {
    id: PostId;
    title: string;
    body: string;
    author: Principal;
    timestamp: Time;
    photo: string;
}
export type Time = bigint;
export interface UserProfile {
    name: string;
}
export type PostId = bigint;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPost(title: string, body: string, photo: string): Promise<PostId>;
    deletePost(postId: PostId): Promise<void>;
    getAllPosts(): Promise<Array<Post>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPost(postId: PostId): Promise<Post>;
    getPostsByAuthor(author: Principal): Promise<Array<Post>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updatePost(postId: PostId, title: string, body: string, photo: string): Promise<void>;
}
