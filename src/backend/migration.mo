import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type OldPost = {
    id : Nat;
    author : Principal;
    title : Text;
    body : Text;
    timestamp : Int;
  };

  type OldActor = {
    posts : Map.Map<Nat, OldPost>;
    nextPostId : Nat;
  };

  type NewPost = {
    id : Nat;
    author : Principal;
    title : Text;
    body : Text;
    photo : Text;
    timestamp : Int;
  };

  type NewActor = {
    posts : Map.Map<Nat, NewPost>;
    nextPostId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newPosts = old.posts.map<Nat, OldPost, NewPost>(
      func(_id, oldPost) {
        { oldPost with photo = "legacy" };
      }
    );
    { old with posts = newPosts };
  };
};
