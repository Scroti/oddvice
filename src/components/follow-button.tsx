"use client";

import { useFollow } from "@/lib/settings";

/** Heart toggle to follow/unfollow a match. Stops the click from triggering a
 * parent link (e.g. the match card). Filled lime when followed. */
export function FollowButton({ matchId, size = 18 }: { matchId: string; size?: number }) {
  const [following, toggle] = useFollow(matchId);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      aria-label={following ? "Unfollow match" : "Follow match"}
      className="grid place-items-center rounded-full p-1.5 transition hover:bg-white/10"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={following ? "#C8F04A" : "none"}
        stroke={following ? "#C8F04A" : "currentColor"}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={following ? "" : "text-white/45"}
      >
        <path d="M12 20s-7-4.4-9.3-8.7A5 5 0 0 1 12 5.5a5 5 0 0 1 9.3 5.8C19 15.6 12 20 12 20z" />
      </svg>
    </button>
  );
}
