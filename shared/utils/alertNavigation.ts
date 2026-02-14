export type AlertType =
  | "SCHEDULE_ASSIGNEE_ADDED"
  | "SCHEDULE_POSITION_ADDED"
  | "NOTICE_UPDATED"
  | "TODO_DUE_TODAY"
  | "TEAM_MEMBER_JOINED"
  | "TEAM_DISSOLVED";

type AlertNavigationTarget = {
  href: string;
  method: "push" | "replace";
};

const toTeamId = (teamId: number | string | null | undefined) => {
  if (teamId == null) return null;
  const parsed = Number(teamId);
  if (Number.isNaN(parsed)) return null;
  return parsed;
};

export const getAlertNavigationTarget = (params: {
  type?: string | null;
  teamId?: number | string | null;
}): AlertNavigationTarget | null => {
  const { type, teamId } = params;
  if (!type) return null;

  const parsedTeamId = toTeamId(teamId);

  switch (type as AlertType) {
    case "SCHEDULE_ASSIGNEE_ADDED":
    case "SCHEDULE_POSITION_ADDED":
    case "NOTICE_UPDATED":
      if (parsedTeamId == null) return null;
      return { href: `/${parsedTeamId}/calendar`, method: "push" };

    case "TODO_DUE_TODAY":
      if (parsedTeamId == null) return null;
      return { href: `/${parsedTeamId}/calendar/todos`, method: "push" };

    case "TEAM_MEMBER_JOINED":
      if (parsedTeamId == null) return null;
      return { href: `/(team)/members?teamId=${parsedTeamId}`, method: "push" };

    case "TEAM_DISSOLVED":
      return { href: "/teams/check", method: "replace" };

    default:
      return null;
  }
};
