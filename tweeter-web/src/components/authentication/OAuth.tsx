import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useMessageActions } from "../toaster/MessageHooks";

interface Props {
  provider: string;
}

const OAuth = (props: Props) => {
  const { displayInfoMessage } = useMessageActions();

  const displayInfoMessageWithDarkBackground = (message: string): void => {
    displayInfoMessage(
      message,
      3000,
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