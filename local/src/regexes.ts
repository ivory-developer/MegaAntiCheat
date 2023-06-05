import { PlayerState, Team } from "./player";


const REGEX_STATUS = new RegExp(/^#\s*(\d+)\s"(.*)"\s+\[(U:\d:\d+)\]\s+(\d*:?\d\d:\d\d)\s+(\d+)\s*(\d+)\s*(active|spawning).*$/);
export interface StatusCapture {
    userid: string;
    name: string;
    steamid32: string;
    time: string;
    ping: number;
    loss: number;
    state: PlayerState;
}
export function matchStatus(line: string): StatusCapture | null {
    let arr = REGEX_STATUS.exec(line);
    if (arr === null) return null;

    return {
        userid: arr[1],
        name: arr[2],
        steamid32: arr[3],
        time: arr[4],
        ping: Number(arr[5]),
        loss: Number(arr[6]),
        state: arr[7] == "active" ? PlayerState.Active : PlayerState.Spawning,
    };
}


const REGEX_LOBBY = new RegExp(/^  Member\[(\d+)] \[(U:\d:\d+)]  team = TF_GC_TEAM_(\w+)  type = MATCH_PLAYER\s*$/);
export interface LobbyCapture {
    steamid32: string;
    team: Team;
}
export function matchLobby(line: string): LobbyCapture | null {
    let arr = REGEX_LOBBY.exec(line);
    if (arr === null) return null;

    let team = Team.None;
    if (arr[3] === "INVADERS") team = Team.Invaders;
    else if (arr[3] === "DEFENDERS") team = Team.Defenders;

    return {
        steamid32: arr[2],
        team: team,
    }
}


const REGEX_CHAT = new RegExp(/^(?:\*DEAD\*)?(?:\(TEAM\))?\s?(.*)\s:\s\s(.*)$/);
export interface ChatCapture {
    playerName: string;
    steamid32?: string;
    message: string;
}
export function matchChat(line: string): ChatCapture | null {
    let arr = REGEX_CHAT.exec(line);
    if (arr === null) return null;

    return {
        playerName: arr[1],
        message: arr[2],
    }
}


const REGEX_KILL = new RegExp(/^(.*)\skilled\s(.*)\swith\s(.*)\.(\s\(crit\))?$/);
export interface KillCapture {
    killerName: string;
    killerSteamid?: string;
    victimName: string;
    victimSteamid?: string;
    weapon: string;
    crit: boolean;
}
export function matchKill(line: string): KillCapture | null {
    let arr = REGEX_KILL.exec(line);
    if (arr === null) return null;

    return {
        killerName: arr[1],
        victimName: arr[2],
        weapon: arr[3],
        crit: arr[4] != undefined,
    };
}
