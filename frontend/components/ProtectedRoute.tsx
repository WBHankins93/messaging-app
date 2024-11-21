import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { getToken } from "../utils/sessionStorage";

interface Props {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
    const router = useRouter();

    useEffect(() => {
        const token = getToken("accessToken");
        if (!token) {
            router.push("/login");
        }
    }, [router]);

    return <>{children}</>
};

export default ProtectedRoute;