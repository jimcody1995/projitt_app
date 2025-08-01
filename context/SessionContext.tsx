'use client';

import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState, ReactNode, useLayoutEffect, JSX } from "react";

/**
 * Session type representing authentication token and status.
 */
type Session = {
    token: string | null;
    authenticated: boolean;
};

/**
 * Context type for session management, including session state,
 * setter, clearer, and loading indicator.
 */
type SessionContextType = {
    session: Session;
    setSession: (session: Session) => void;
    clearSession: () => void;
    loading: boolean;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

/**
 * SessionProvider wraps the application and manages authentication session state.
 * It handles loading state, storing session token in localStorage, setting
 * axios default headers, and route protection/redirection.
 *
 * @param {Object} props
 * @param {ReactNode} props.children - The children components to be wrapped by the provider
 * @returns JSX.Element - The context provider wrapping children with session state
 */
export const SessionProvider = ({ children }: { children: ReactNode }): JSX.Element => {
    const [session, setSessionState] = useState<Session>({ token: null, authenticated: false });
    const [loading, setLoading] = useState(true);
    const router = useRouter();


    useLayoutEffect(() => {
        const loadSession = async () => {
            setLoading(true);
            const stored = localStorage.getItem("session");

            if (stored) {
                axios.defaults.headers.common["Authorization"] = `Bearer ${stored}`;
                setSessionState({ token: stored, authenticated: true });
                setTimeout(() => setLoading(false), 1000);
                router.replace('/applicant/recruitment/apply');
            } else {
                setSessionState({ token: null, authenticated: false });
                setTimeout(() => setLoading(false), 1000);
                router.replace('/applicant/recruitment/signin');
            }
        }
        loadSession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Sets the session state and stores token in localStorage.
     *
     * @param {Session} session - The session object containing token and auth status
     */
    const setSession = (session: Session): void => {
        setSessionState({ ...session });
        localStorage.setItem("session", session.token || "");
    };

    /**
     * Clears the session state and removes the token from localStorage.
     */
    const clearSession = (): void => {
        setSessionState({ token: null, authenticated: false });
        localStorage.removeItem("session");
    };

    return (
        <SessionContext.Provider value={{ session, setSession, clearSession, loading }}>
            {children}
        </SessionContext.Provider>
    );
};

/**
 * Custom hook to access session context. Throws error if used outside provider.
 *
 * @returns {SessionContextType} The session context value
 */
export const useSession = (): SessionContextType => {
    const context = useContext(SessionContext);
    if (!context) throw new Error("useSession must be used within SessionProvider");
    return context;
};
