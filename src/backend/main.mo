import Array "mo:core/Array";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";

(with migration = Migration.run)
actor {
  public type PlayerStats = {
    strength : Nat;
    speed : Nat;
    endurance : Nat;
    intelligence : Nat;
    focus : Nat;
    aura : Nat;
  };

  public type CategoryXP = {
    fitness : Nat;
    intelligence : Nat;
    focus : Nat;
    martial : Nat;
    discipline : Nat;
    mindset : Nat;
  };

  public type PlayerProfile = {
    username : Text;
    age : Nat;
    gender : Text;
    goal : Text;
    fitnessLevel : Text;
    bodyType : Text;
    level : Nat;
    xp : Nat;
    skillPoints : Nat;
    stats : PlayerStats;
    achievements : [Nat];
    completedMissions : [Text];
    martialArtsLevel : Nat;
    martialArtsXP : Nat;
    categoryXP : CategoryXP;
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

  public shared ({ caller }) func registerPlayer(username : Text, age : Nat, gender : Text, goal : Text, fitnessLevel : Text, bodyType : Text) : async () {
    // No authorization check needed - anyone (including guests) can register
    // This effectively converts a guest to a user
    if (players.containsKey(caller)) {
      Runtime.trap("Player already registered");
    };

    let newPlayer : PlayerProfile = {
      username;
      age;
      gender;
      goal;
      fitnessLevel;
      bodyType;
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
      completedMissions = [];
      martialArtsLevel = 1;
      martialArtsXP = 0;
      categoryXP = {
        fitness = 0;
        intelligence = 0;
        focus = 0;
        martial = 0;
        discipline = 0;
        mindset = 0;
      };
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

  public shared ({ caller }) func completeMission(missionId : Text, category : Text, xpReward : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete missions");
    };

    switch (players.get(caller)) {
      case (null) { Runtime.trap("Player not found. Please register first.") };
      case (?current) {
        // Check for duplicate mission completion
        if (current.completedMissions.find<Text>(func(id) { id == missionId }) != null) {
          Runtime.trap("Mission already completed");
        };

        // Update total XP first
        let newTotalXP = current.xp + xpReward;

        // Determine new level based on updated total XP
        let tempLevel = newTotalXP / 100.toNat();
        let newLevel = tempLevel + 1;

        // Update category XP based on the category of the mission
        let updatedCategoryXP = switch (category) {
          case ("fitness") {
            { current.categoryXP with fitness = current.categoryXP.fitness + xpReward };
          };
          case ("intelligence") {
            { current.categoryXP with intelligence = current.categoryXP.intelligence + xpReward };
          };
          case ("focus") {
            { current.categoryXP with focus = current.categoryXP.focus + xpReward };
          };
          case ("martial") {
            { current.categoryXP with martial = current.categoryXP.martial + xpReward };
          };
          case ("discipline") {
            { current.categoryXP with discipline = current.categoryXP.discipline + xpReward };
          };
          case ("mindset") {
            { current.categoryXP with mindset = current.categoryXP.mindset + xpReward };
          };
          case (_) { current.categoryXP };
        };

        let updatedProfile = {
          current with
          xp = newTotalXP;
          level = newLevel;
          completedMissions = current.completedMissions.concat([missionId]);
          categoryXP = updatedCategoryXP;
        };
        players.add(caller, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getMissionCompletions() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view mission completions");
    };

    switch (players.get(caller)) {
      case (null) { Runtime.trap("Player not found. Please register first.") };
      case (?profile) {
        profile.completedMissions;
      };
    };
  };

  public query ({ caller }) func getPublicProfile(player : Principal) : async ?PlayerProfile {
    // No authorization check - profiles are public
    players.get(player);
  };

  public shared ({ caller }) func unlockAchievement(badgeId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can unlock achievements");
    };

    switch (players.get(caller)) {
      case (null) { Runtime.trap("Player not found. Please register first.") };
      case (?current) {
        // Check for duplicate achievement
        if (current.achievements.find<Nat>(func(id) { id == badgeId }) != null) {
          Runtime.trap("Achievement already unlocked");
        };

        let updatedAchievements = current.achievements.concat([badgeId]);
        let updatedProfile = { current with achievements = updatedAchievements };
        players.add(caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func updateStats(newStats : PlayerStats) : async () {
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

  public query ({ caller }) func getLeaderboard() : async [PlayerProfile] {
    // No authorization check - leaderboard is public
    let sortedPlayers : [PlayerProfile] = players.values().toArray().sort(PlayerProfile.compareByXP);
    sortedPlayers.sliceToArray(0, Int.min(10, sortedPlayers.size()));
  };

  public shared ({ caller }) func updateMartialArtsXP(xpToAdd : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update martial arts XP");
    };

    switch (players.get(caller)) {
      case (null) { Runtime.trap("Player not found. Please register first.") };
      case (?current) {
        let newMartialArtsXP = current.martialArtsXP + xpToAdd;
        let newMartialArtsLevel = newMartialArtsXP / 500 + 1;

        let updatedCategoryXP = {
          current.categoryXP with martial = current.categoryXP.martial + xpToAdd
        };

        let newTotalXP = current.xp + xpToAdd;
        let tempLevel = newTotalXP / 100.toNat();
        let newLevel = tempLevel + 1;

        let updatedProfile = {
          current with
          martialArtsXP = newMartialArtsXP;
          martialArtsLevel = newMartialArtsLevel;
          xp = newTotalXP;
          level = newLevel;
          categoryXP = updatedCategoryXP;
        };
        players.add(caller, updatedProfile);
      };
    };
  };
};
