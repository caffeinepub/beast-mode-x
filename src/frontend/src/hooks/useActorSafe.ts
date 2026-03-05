/**
 * useActorSafe — wraps useActor and fixes the isFetching glitch.
 *
 * The raw `actorQuery.isFetching` stays `true` during background refetches
 * even after the actor is already available, which disables every button in
 * the UI indefinitely.  This wrapper returns `isFetching = true` ONLY while
 * the actor has not yet been resolved for the first time.
 */
import { useActor } from "./useActor";

export function useActorSafe() {
  const { actor, isFetching } = useActor();
  return {
    actor,
    // Only "fetching" when there is no actor yet
    isFetching: isFetching && !actor,
  };
}
