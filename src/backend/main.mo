import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  public type PlayerStats = {
    strength : Nat;
    speed : Nat;
    endurance : Nat;
    intelligence : Nat;
    focus : Nat;
    aura : Nat;
  };

  public type PlayerProfile = {
    username : Text;
    level : Nat;
    xp : Nat;
    skillPoints : Nat;
    stats : PlayerStats;
    achievements : [Nat];
  };

  module PlayerProfile {
    public func compareByXP(profile1 : PlayerProfile, profile2 : PlayerProfile) : Order.Order {
      Int.compare(profile2.xp, profile1.xp);
    };
  };

  let players = Map.empty<Principal, PlayerProfile>();

  // Initialize the access control state
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  public shared ({ caller }) func registerPlayer(username : Text) : async () {
    // No authorization check needed - anyone (including guests) can register
    // This effectively converts a guest to a user
    if (players.containsKey(caller)) {
      Runtime.trap("Player already registered");
    };

    let newPlayer : PlayerProfile = {
      username;
      level = 1;
      xp = 0;
      skillPoints = 0;
      stats = {
        strength = 10;
        speed = 10;
        endurance = 10;
        intelligence = 10;
        focus = 10;
        aura = 10;
      };
      achievements = [];
    };

    players.add(caller, newPlayer);
  };

  public query ({ caller }) func getPlayerProfile() : async ?PlayerProfile {
    // Users can view their own profile
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    players.get(caller);
  };

  public shared ({ caller }) func addXP(xpToAdd : Nat) : async () {
    // Only authenticated users can add XP to their profile
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add XP");
    };

    switch (players.get(caller)) {
      case (null) { Runtime.trap("Player not found. Please register first.") };
      case (?current) {
        let currentXP = current.xp + xpToAdd;

        let levelUps = if (currentXP >= 1000) {
          (currentXP / 1000) - (current.xp / 1000);
        } else { 0 };

        let updatedProfile = {
          current with
          xp = currentXP;
          level = current.level + levelUps;
          skillPoints = current.skillPoints + (levelUps * 5);
        };
        players.add(caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func updateStats(newStats : PlayerStats) : async () {
    // Only authenticated users can update their stats
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update stats");
    };

    switch (players.get(caller)) {
      case (null) { Runtime.trap("Player not found. Please register first.") };
      case (?current) {
        let updatedProfile = { current with stats = newStats };
        players.add(caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func unlockAchievement(badgeId : Nat) : async () {
    // Only authenticated users can unlock achievements
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can unlock achievements");
    };

    switch (players.get(caller)) {
      case (null) { Runtime.trap("Player not found. Please register first.") };
      case (?current) {
        // Check if achievement already unlocked
        if (current.achievements.find<Nat>(func(id) { id == badgeId }) != null) {
          Runtime.trap("Achievement already unlocked");
        };

        let updatedAchievements = current.achievements.concat([badgeId]);
        let updatedProfile = { current with achievements = updatedAchievements };
        players.add(caller, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getLeaderboard() : async [PlayerProfile] {
    // No authorization check - leaderboard is public and accessible to everyone
    let sortedPlayers : [PlayerProfile] = players.values().toArray().sort(PlayerProfile.compareByXP);
    sortedPlayers.sliceToArray(0, Int.min(10, sortedPlayers.size()));
  };
};
