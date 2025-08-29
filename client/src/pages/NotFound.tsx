const NotFound = () => {
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
            <div className="text-center w-full">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
                <a href="/" className="text-blue-500 hover:text-blue-700 underline">
                    Go to home
                </a>
            </div>
        </div>
    );
};

export default NotFound;