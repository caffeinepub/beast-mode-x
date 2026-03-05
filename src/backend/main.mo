import Array "mo:core/Array";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";

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

  public type CategoryXP = {
    fitness : Nat;
    intelligence : Nat;
    focus : Nat;
    martial : Nat;
    discipline : Nat;
    mindset : Nat;
  };

  public type ActiveChallenge = {
    challengeId : Text;
    day : Nat;
    startDate : Text;
  };

  public type PlayerProfile = {
    username : Text;
    age : Nat;
    gender : Text;
    goal : Text;
    fitnessLevel : Text;
    bodyType : Text;
    weight : Text;
    height : Text;
    level : Nat;
    xp : Nat;
    skillPoints : Nat;
    stats : PlayerStats;
    achievements : [Nat];
    completedMissions : [Text];
    martialArtsLevel : Nat;
    martialArtsXP : Nat;
    categoryXP : CategoryXP;
    completedHabits : [Text];
    activeChallenge : ?ActiveChallenge;
    weeklyWorkouts : [Text];
  };

  module PlayerProfile {
    public func compareByXP(profile1 : PlayerProfile, profile2 : PlayerProfile) : Order.Order {
      Int.compare(profile2.xp, profile1.xp);
    };
  };

  let players = Map.empty<Principal, PlayerProfile>();
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  let levelThresholds = [
    0, 200, 500, 900, 1400, 2000, 2700, 3500, 4400, 5500, 6700, 7900, 9100, 10300, 11500, 12700, 14000, 15300, 16600, 17900, 19200, 20500, 21800, 23100, 24400, 25700, 27000, 28300, 29600, 30900, 32200, 33500, 34800, 36100, 37400, 38700, 40000, 41300, 42600, 43900, 45200, 46500, 47800, 49100, 50400, 51700, 53000, 54300, 55600, 56900, 58200, 59500, 60800, 62100, 63400, 64700, 66000, 67300, 68600, 69900, 71200, 72500, 73800, 75100, 76400, 77700, 79000, 80300, 81600, 82900, 84200, 85500, 86800, 88100, 89400, 90700, 92000, 93300, 94600, 95900, 97200, 98500, 99800,
  ];

  public query ({ caller }) func xpToLevel(xp : Nat) : async Nat {
    var level : Nat = 1;
    for (threshold in levelThresholds.values()) {
      if (xp >= threshold) {
        level += 1;
      };
    };

    if (level > 200) { 200 } else { level };
  };

  public query ({ caller }) func getPlayerProfile() : async ?PlayerProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    players.get(caller);
  };

  public shared ({ caller }) func registerPlayer(
    username : Text,
    age : Nat,
    gender : Text,
    goal : Text,
    fitnessLevel : Text,
    bodyType : Text,
    weight : Text,
    height : Text,
  ) : async () {
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
      weight;
      height;
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
      completedHabits = [];
      activeChallenge = null;
      weeklyWorkouts = [];
    };

    players.add(caller, newPlayer);
    AccessControl.assignRole(accessControlState, caller, caller, #user);
  };

  public shared ({ caller }) func completeMission(missionId : Text, category : Text, xpReward : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete missions");
    };

    switch (players.get(caller)) {
      case (null) { Runtime.trap("Player not found. Please register first.") };
      case (?current) {
        if (current.completedMissions.find<Text>(func(id) { id == missionId }) != null) {
          Runtime.trap("Mission already completed");
        };

        let newTotalXP = current.xp + xpReward;
        let newLevel = updateLevel(newTotalXP);

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

  public query ({ caller }) func getLeaderboard() : async [PlayerProfile] {
    let sortedPlayers : [PlayerProfile] = players.values().toArray().sort(PlayerProfile.compareByXP);
    sortedPlayers.sliceToArray(0, Int.min(10, sortedPlayers.size()));
  };

  public query ({ caller }) func getPublicProfile(player : Principal) : async ?PlayerProfile {
    players.get(player);
  };

  public shared ({ caller }) func unlockAchievement(badgeId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can unlock achievements");
    };

    switch (players.get(caller)) {
      case (null) { Runtime.trap("Player not found. Please register first.") };
      case (?current) {
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

  public shared ({ caller }) func updateMartialArtsXP(xpToAdd : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update martial arts XP");
    };

    switch (players.get(caller)) {
      case (null) { Runtime.trap("Player not found. Please register first.") };
      case (?current) {
        let newMartialArtsXP = current.martialArtsXP + xpToAdd;
        let newMartialArtsLevel = calculateMartialLevel(newMartialArtsXP);

        let updatedCategoryXP = {
          current.categoryXP with martial = current.categoryXP.martial + xpToAdd
        };

        let newTotalXP = current.xp + xpToAdd;
        let newLevel = updateLevel(newTotalXP);

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

  public shared ({ caller }) func awardCameraXP(xpAmount : Nat, category : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can earn camera XP");
    };

    switch (players.get(caller)) {
      case (null) { Runtime.trap("Player not found. Please register first.") };
      case (?current) {
        let updatedCategoryXP = switch (category) {
          case ("fitness") {
            { current.categoryXP with fitness = current.categoryXP.fitness + xpAmount };
          };
          case ("intelligence") {
            { current.categoryXP with intelligence = current.categoryXP.intelligence + xpAmount };
          };
          case ("focus") {
            { current.categoryXP with focus = current.categoryXP.focus + xpAmount };
          };
          case ("martial") {
            { current.categoryXP with martial = current.categoryXP.martial + xpAmount };
          };
          case ("discipline") {
            { current.categoryXP with discipline = current.categoryXP.discipline + xpAmount };
          };
          case ("mindset") {
            { current.categoryXP with mindset = current.categoryXP.mindset + xpAmount };
          };
          case (_) { current.categoryXP };
        };

        let newXP = current.xp + xpAmount;
        let newLevel = updateLevel(newXP);

        let updatedProfile = {
          current with
          xp = newXP;
          level = newLevel;
          categoryXP = updatedCategoryXP;
        };
        players.add(caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func applySelfPenalty(xpLoss : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can apply penalties to themselves");
    };

    switch (players.get(caller)) {
      case (null) { Runtime.trap("Player not found. Please register first.") };
      case (?current) {
        let newXP = if (current.xp >= xpLoss) {
          current.xp - xpLoss;
        } else {
          0;
        };
        let newLevel = updateLevel(newXP);

        let updatedProfile = {
          current with
          xp = newXP;
          level = newLevel;
        };
        players.add(caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func deletePlayer() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete profiles");
    };

    switch (players.get(caller)) {
      case (null) { Runtime.trap("Player not found. Please register first.") };
      case (?_) {
        players.remove(caller);
      };
    };
  };

  public shared ({ caller }) func resetPlayerProgress() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can reset progress");
    };

    switch (players.get(caller)) {
      case (null) { Runtime.trap("Player not found. Please register first.") };
      case (?current) {
        let resetProfile : PlayerProfile = {
          current with
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
          completedHabits = [];
          activeChallenge = null;
          weeklyWorkouts = [];
        };
        players.add(caller, resetProfile);
      };
    };
  };

  public shared ({ caller }) func completeWorkout(workoutId : Text, xpReward : Nat, category : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete workouts");
    };

    switch (players.get(caller)) {
      case (null) { Runtime.trap("Player not found. Please register first.") };
      case (?current) {
        if (current.completedMissions.find<Text>(func(id) { id == workoutId }) != null) {
          Runtime.trap("Workout already completed");
        };

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

        let newXP = current.xp + xpReward;
        let newLevel = updateLevel(newXP);

        let updatedProfile = {
          current with
          xp = newXP;
          completedMissions = current.completedMissions.concat([workoutId]);
          level = newLevel;
          categoryXP = updatedCategoryXP;
        };
        players.add(caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func startChallenge(challengeId : Text, startDate : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can start challenges");
    };

    switch (players.get(caller)) {
      case (null) { Runtime.trap("Player not found. Please register first.") };
      case (?current) {
        let newChallenge = {
          challengeId;
          day = 1;
          startDate;
        };

        let updatedProfile = { current with activeChallenge = ?newChallenge };
        players.add(caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func advanceChallengeDay() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can advance challenge day");
    };

    switch (players.get(caller)) {
      case (null) { Runtime.trap("Player not found. Please register first.") };
      case (?current) {
        switch (current.activeChallenge) {
          case (null) { Runtime.trap("No active challenge") };
          case (?challenge) {
            let advancedChallenge = {
              challenge with day = challenge.day + 1
            };

            let updatedProfile = {
              current with
              xp = current.xp + 50;
              level = updateLevel(current.xp + 50);
              activeChallenge = ?advancedChallenge;
            };
            players.add(caller, updatedProfile);
          };
        };
      };
    };
  };

  public shared ({ caller }) func completeHabit(habitId : Text, date : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete habits");
    };

    switch (players.get(caller)) {
      case (null) { Runtime.trap("Player not found. Please register first.") };
      case (?current) {
        let habitEntry = habitId.concat(":").concat(date);
        if (current.completedHabits.find<Text>(func(entry) { entry == habitEntry }) != null) {
          Runtime.trap("Habit already completed for this date");
        };

        let updatedProfile = {
          current with
          completedHabits = current.completedHabits.concat([habitEntry]);
          xp = current.xp + 30;
          level = updateLevel(current.xp + 30);
        };
        players.add(caller, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getHabitCompletions() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view habit completions");
    };

    switch (players.get(caller)) {
      case (null) { Runtime.trap("Player not found. Please register first.") };
      case (?profile) {
        profile.completedHabits;
      };
    };
  };

  func updateLevel(xp : Nat) : Nat {
    var level : Nat = 1;
    for (threshold in levelThresholds.values()) {
      if (xp >= threshold) {
        level += 1;
      };
    };

    if (level > 200) { 200 } else { level };
  };

  func calculateMartialLevel(xp : Nat) : Nat {
    if (xp < 100) { 1 } else if (xp < 300) { 2 } else if (xp < 600) { 3 } else if (xp < 1000) { 4 } else if (xp < 1500) {
      5;
    } else if (xp < 2200) { 6 } else if (xp < 3000) { 7 } else if (xp < 4000) { 8 } else if (xp < 5500) { 9 } else {
      10;
    };
  };
};
