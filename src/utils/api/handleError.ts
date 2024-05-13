interface ToastType {
  success: (message: string) => void;
  error: (message: string) => void;
}

export const handleAPIError = ({
  response,
  toast,
  setApiError,
}: {
  response: Response;
  toast: ToastType;
  setApiError: (value: boolean) => void;
}) => {
  if (response?.status == 200) {
    console.log("Interaction successfully recorded");
    toast.success("Interaction successfully recorded");
    setApiError(false);
  } else if (response?.status == 405) {
    console.log("405: Method Not allowed");
    toast.error("405: Method Not allowed");
    setApiError(true);
  } else if (response?.status == 400) {
    // let _error = await response.json();
    console.error("400: Missing parameters");
    toast.error("400: Missing parameters");
    setApiError(true);
  } else if (response?.status == 401) {
    console.error("You must be signed in to interact with the API");
    toast.error("401: You must be signed in to interact with the API");
    setApiError(true);
  } else if (response?.status == 500) {
    console.error("Internal Server Error");
    toast.error("500: Internal Server Error");
    setApiError(true);
  } else {
    console.error("Error occured during APICall");
    toast.error("Error occured during APICall");
    setApiError(true);
  }
};
