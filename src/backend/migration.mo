import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  // OLD TYPE DEFINITIONS (from old backend)
  type OldPlayerStats = {
    strength : Nat;
    speed : Nat;
    endurance : Nat;
    intelligence : Nat;
    focus : Nat;
    aura : Nat;
  };

  type OldCategoryXP = {
    fitness : Nat;
    intelligence : Nat;
    focus : Nat;
    martial : Nat;
    discipline : Nat;
    mindset : Nat;
  };

  type OldPlayerProfile = {
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
    stats : OldPlayerStats;
    achievements : [Nat];
    completedMissions : [Text];
    martialArtsLevel : Nat;
    martialArtsXP : Nat;
    categoryXP : OldCategoryXP;
  };

  // NEW TYPE DEFINITIONS (from new backend)
  type NewPlayerStats = OldPlayerStats;
  type NewCategoryXP = OldCategoryXP;

  type NewPlayerProfile = {
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
    stats : NewPlayerStats;
    achievements : [Nat];
    completedMissions : [Text];
    martialArtsLevel : Nat;
    martialArtsXP : Nat;
    categoryXP : NewCategoryXP;
  };

  // Migration function called by the main actor via the with-clause
  public func run(old : { players : Map.Map<Principal, OldPlayerProfile> }) : { players : Map.Map<Principal, NewPlayerProfile> } {
    // Convert old profiles to new profiles (mapping fields directly)
    let newPlayers = old.players.map<Principal, OldPlayerProfile, NewPlayerProfile>(
      func(_id, oldProfile) {
        // Direct mapping of unchanged fields
        {
          oldProfile with
          achievements = oldProfile.achievements;
          completedMissions = oldProfile.completedMissions;
          categoryXP = oldProfile.categoryXP;
        };
      }
    );
    { players = newPlayers };
  };
};
