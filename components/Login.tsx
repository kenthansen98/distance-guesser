import Link from "next/link";

const Login = () => {
    return(
        <div className=" bg-white shadow-2xl w-1/3 h-60 m-auto rounded-lg p-8 flex">
            <Link href="/api/auth/signin">
                <a className=" bg-gradient-to-r from-blue-800 to-green-800 text-lg font-bold m-auto p-2 text-white rounded-md shadow-sm transition hover:scale-105">Sign In</a>
            </Link>
        </div>
    )
};

export default Login;