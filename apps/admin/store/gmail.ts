import { atom } from "jotai";

export interface GmailAuthState {
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}

export const gmailAuthState = atom<GmailAuthState>({
	isAuthenticated: false,
	isLoading: true,
	error: null,
});
