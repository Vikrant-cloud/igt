import type { ReactNode } from "react";

const AuthLayout = ({ children, type }: { children: ReactNode, type: string }) => {
  return (
    <div className="auth-layout bg-gradient-to-br from-purple-800 via-blue-700 to-red-400">
      <div className="flex flex-1 flex-col justify-center px-6 py-8 lg:px-8">
        <div className="sm:mx-auto sm:w-full">
          <img
            alt="Company logo"
            src="/images/logo.png"
            className="mx-auto h-32 w-auto"
          />
          <h1 className="mt-1 text-center text-3xl/9 font-bold tracking-tight text-white">
            {type}
          </h1>
        </div>
      </div>
      {children}
    </div>
  );
}
export default AuthLayout;