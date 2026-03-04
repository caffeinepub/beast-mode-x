import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type OldPlayerStats = {
    strength : Nat;
    speed : Nat;
    endurance : Nat;
    intelligence : Nat;
    focus : Nat;
    aura : Nat;
  };

  type OldPlayerProfile = {
    username : Text;
    level : Nat;
    xp : Nat;
    skillPoints : Nat;
    stats : OldPlayerStats;
    achievements : [Nat];
  };

  type OldActor = {
    players : Map.Map<Principal, OldPlayerProfile>;
  };

  type NewPlayerStats = {
    strength : Nat;
    speed : Nat;
    endurance : Nat;
    intelligence : Nat;
    focus : Nat;
    aura : Nat;
  };

  type CategoryXP = {
    fitness : Nat;
    intelligence : Nat;
    focus : Nat;
    martial : Nat;
    discipline : Nat;
    mindset : Nat;
  };

  type NewPlayerProfile = {
    username : Text;
    age : Nat;
    gender : Text;
    goal : Text;
    fitnessLevel : Text;
    bodyType : Text;
    level : Nat;
    xp : Nat;
    skillPoints : Nat;
    stats : NewPlayerStats;
    achievements : [Nat];
    completedMissions : [Text];
    martialArtsLevel : Nat;
    martialArtsXP : Nat;
    categoryXP : CategoryXP;
  };

  type NewActor = {
    players : Map.Map<Principal, NewPlayerProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let newPlayers = old.players.map<Principal, OldPlayerProfile, NewPlayerProfile>(
      func(_id, oldProfile) {
        {
          username = oldProfile.username;
          age = 0;
          gender = "unknown";
          goal = "unknown";
          fitnessLevel = "beginner";
          bodyType = "average";
          level = oldProfile.level;
          xp = oldProfile.xp;
          skillPoints = oldProfile.skillPoints;
          stats = oldProfile.stats;
          achievements = oldProfile.achievements;
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
      }
    );
    { players = newPlayers };
  };
};
