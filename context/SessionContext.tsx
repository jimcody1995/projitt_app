'use client';

import axios from "axios";
import { useParams, usePathname, useRouter } from "next/navigation";

import { createContext, useContext, useState, ReactNode, useLayoutEffect, JSX, useEffect } from "react";

/**
 * Session type representing authentication token and status.
 */
type Session = {
    token: string | null;
    authenticated: boolean;
    full_name: string | null;
    email: string | null;
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
    const [session, setSessionState] = useState<Session>({ token: null, authenticated: false, full_name: null, email: null });
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const params = useParams();
    const path = usePathname();
    useEffect(() => {
        // const loadSession = async () => {
        //     setLoading(true);
        //     if (session.token) {
        //         axios.defaults.headers.common["Authorization"] = `Bearer ${session.token}`;
        //         setSessionState({ token: session.token, authenticated: true });
        //         setTimeout(() => setLoading(false), 1000);
        //         const jobId = params.jobId;
        //         if (path === '/applicant/recruitment/signin' || path === '/') {
        //             if (jobId && applicantId) {
        //                 router.replace(`/applicant/recruitment/apply?jobId=${jobId}&applicantId=${applicantId}`);
        //             } else {
        //                 router.replace(`/applicant/recruitment/apply?jobId=1&applicantId=${applicantId}`);
        //             }
        //         }
        //     } else {
        setSessionState({ token: null, authenticated: false, full_name: null, email: null });
        setTimeout(() => setLoading(false), 1000);
        if (window.location.pathname.startsWith('/meeting')) {
            return
        }
        else if (window.location.pathname !== '/' && window.location.pathname !== '/applicant/recruitment/signin') {
            router.replace(`/applicant/recruitment/signin?redirect=${encodeURIComponent(window.location.pathname)}`);
        }
        else {
            router.replace('/applicant/recruitment/signin');
        }
        //     }
        // }
        // loadSession();

    }, []);

    /**
     * Sets the session state and stores token in localStorage.
     *
     * @param {Session} session - The session object containing token and auth status
     */
    const setSession = (session: Session): void => {
        setSessionState({ ...session });
    };

    /**
     * Clears the session state and removes the token from localStorage.
     */
    const clearSession = (): void => {
        setSessionState({ token: null, authenticated: false, full_name: null, email: null });
        // localStorage.removeItem("session");
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
