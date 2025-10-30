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
                <circle cx="40" cy="40" r="38" stroke="#EA5455" strokeWidth="4" fill="#FFF4F4"/>
                <path d="M28 36V50" stroke="#EA5455" strokeWidth="4" strokeLinecap="round"/>
                <path d="M40 30V50" stroke="#EA5455" strokeWidth="4" strokeLinecap="round"/>
                <path d="M52 36V50" stroke="#EA5455" strokeWidth="4" strokeLinecap="round"/>
                <circle cx="40" cy="66" r="2" fill="#EA5455" />
            </svg>
            <h1 className="text-28 fw-700 mb-24">403 Forbidden</h1>
            <div className="text-18 text-light-3 mb-24">You are not authorized to access the {role.toUpperCase()} panel.</div>
            <button onClick={() => router.push("/")} className="button bg-dark-3 text-white rounded-8 px-15 py-15 text-16">Return to Homepage</button>
        </div>
    );
};

export default Forbidden403;
