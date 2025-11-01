import { useRouter } from "next/navigation";

const Forbidden403 = ({ role }) => {
    const router = useRouter();
    return (
        <div className="d-flex flex-column justify-center items-center" style={{ minHeight: "100vh" }}>
            <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mb-30"
            >
                <circle cx="40" cy="40" r="38" stroke="#EA5455" strokeWidth="4" fill="#FFF4F4" />
                <rect x="24" y="36" width="32" height="20" rx="4" stroke="#EA5455" strokeWidth="4" fill="#FFF4F4" />
                <rect x="34" y="25" width="12" height="12" rx="3" stroke="#EA5455" strokeWidth="3" fill="#FFF4F4" />
                <path d="M28 46L52 46" stroke="#EA5455" strokeWidth="4" strokeLinecap="round" />
                <circle cx="40" cy="56" r="2" fill="#EA5455" />
                <line x1="31" y1="60" x2="49" y2="60" stroke="#EA5455" strokeWidth="3" strokeLinecap="round" />
                <path d="M36 34 L44 34" stroke="#EA5455" strokeWidth="2.5" strokeLinecap="round"/>
                <ellipse cx="40" cy="40" rx="24" ry="27" fill="none" stroke="#FFD6D6" strokeWidth="2" />
                <circle cx="40" cy="45" r="8" fill="#EA5455" fillOpacity="0.09" />
                <path d="M36 48 Q40 53 44 48" stroke="#EA5455" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>
            <h1 className="text-28 fw-700 mb-24">403 Forbidden</h1>
            <div className="text-18 text-light-3 mb-24">You are not authorized to access the {role.toUpperCase()} panel.</div>
            <button onClick={() => router.push("/")} className="button bg-dark-3 text-white rounded-8 px-15 py-15 text-16">Return to Homepage</button>
        </div>
    );
};

export default Forbidden403;
