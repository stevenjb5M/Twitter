import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ToastType } from "../toaster/Toast";
import { useContext } from "react";
import { ToastActionsContext } from "../toaster/ToastContexts";

interface Props {
    provider: string;
}

const OAuth = (props: Props) => {
    const { displayToast } = useContext(ToastActionsContext);

    const displayInfoMessageWithDarkBackground = (message: string): void => {
        displayToast(
          ToastType.Info,
          message,
          3000,
          undefined,
          "text-white bg-primary"
        );
      };
    
    const capitalizedProvider = props.provider.charAt(0).toUpperCase() + props.provider.slice(1);
    const infoMessage = `${capitalizedProvider} registration is not implemented.`;

    return (
        <button
              type="button"
              className="btn btn-link btn-floating mx-1"
              onClick={() =>
                displayInfoMessageWithDarkBackground(infoMessage)
              }
            >
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`${props.provider}Tooltip`}>{capitalizedProvider}</Tooltip>}
              >
                <FontAwesomeIcon icon={["fab", props.provider] as any} />
              </OverlayTrigger>
            </button>
    )
}

export default OAuth;