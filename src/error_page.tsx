import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  const errorMessage = () => {
    if (typeof error === "object" && error !== null && "message" in error) {
      return (error as { message: string }).message;
    }
    return "Unknown error";
  };

  const errorStatusText = () => {
    if (typeof error === "object" && error !== null && "statusText" in error) {
      return (error as { statusText: string }).statusText;
    }
    return "";
  };

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{errorStatusText() || errorMessage()}</i>
      </p>
    </div>
  );
}