import { isRouteErrorResponse, useRouteError } from "react-router-dom";

function ErrorBoundary() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        // the response json is automatically parsed to
        // `error.data`, you also have access to the status
        return (
            <div>
                <h1>{error.status}</h1>
                <h2>{error.data}</h2>
                <p>
                    Go ahead and email Dorothy if you
                    feel like this is a mistake.
                </p>
            </div>
        );
    }

    // rethrow to let the parent error boundary handle it
    // when it's not a special case for this route
    throw error;
}

export default ErrorBoundary