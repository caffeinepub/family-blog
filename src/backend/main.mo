import Map "mo:core/Map";
import Order "mo:core/Order";
import Array "mo:core/Array";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type PostId = Nat;

  public type Post = {
    id : PostId;
    author : Principal;
    title : Text;
    body : Text;
    timestamp : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  module Post {
    public func compareByTimestamp(p1 : Post, p2 : Post) : Order.Order {
      if (p1.timestamp < p2.timestamp) { #less } else if (p1.timestamp > p2.timestamp) {
        #greater;
      } else {
        #equal;
      };
    };
  };

  let posts = Map.empty<PostId, Post>();
  var nextPostId = 0;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createPost(title : Text, body : Text) : async PostId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create posts");
    };
    let post : Post = {
      id = nextPostId;
      author = caller;
      title;
      body;
      timestamp = Time.now();
    };
    posts.add(nextPostId, post);
    nextPostId += 1;
    post.id;
  };

  public query ({ caller }) func getPost(postId : PostId) : async Post {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view posts");
    };
    switch (posts.get(postId)) {
      case (null) { Runtime.trap("Post does not exist."); };
      case (?post) { post };
    };
  };

  public query ({ caller }) func getAllPosts() : async [Post] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view posts");
    };
    posts.values().toArray().sort(Post.compareByTimestamp);
  };

  public shared ({ caller }) func updatePost(postId : PostId, title : Text, body : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update posts");
    };
    switch (posts.get(postId)) {
      case (null) { Runtime.trap("No post to update"); };
      case (?post) {
        if (post.author != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the author or an admin can update this post");
        };
        let updated : Post = {
          post with
          title;
          body;
        };
        posts.add(postId, updated);
      };
    };
  };

  public shared ({ caller }) func deletePost(postId : PostId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete posts");
    };
    switch (posts.get(postId)) {
      case (null) { Runtime.trap("Post does not exist."); };
      case (?post) {
        if (post.author != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the author or an admin can delete this post");
        };
        ignore posts.remove(postId);
      };
    };
  };

  public query ({ caller }) func getPostsByAuthor(author : Principal) : async [Post] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view posts");
    };
    let filteredPosts = posts.values().filter(func(post) { post.author == author });
    filteredPosts.toArray().sort(Post.compareByTimestamp);
  };
};
