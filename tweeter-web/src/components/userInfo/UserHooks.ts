import { useContext, useRef } from "react";
import { UserInfoActionsContext, UserInfoContext } from "./UserInfoContexts";
import { useNavigate } from "react-router-dom";
import { User } from "tweeter-shared";
import { useMessageActions } from "../toaster/MessageHooks";
import { UserNavigationPresenter, UserNavigationView } from "../../presenter/UserNavigationPresenter";

export const useUserInfo = () => useContext(UserInfoContext);
export const useUserInfoActions = () => useContext(UserInfoActionsContext);
export const useUserNavigation = () => {
    const { displayErrorMessage } = useMessageActions();
    const { displayedUser, authToken } = useUserInfo();
    const { setDisplayedUser } = useUserInfoActions();
    const navigate = useNavigate();


    const listener: UserNavigationView = {
        setDisplayedUser: (user: User) => setDisplayedUser(user),
        navigate: (path: string) => navigate(path),
        displayErrorMessage: displayErrorMessage
    };

    const presenterRef = useRef(new UserNavigationPresenter(listener));

    const navigateToUser = async (event: React.MouseEvent, featurePath: string): Promise<void> => {
        event.preventDefault();

        const alias = extractAlias(event.target.toString());
        presenterRef.current.navigateToUser(authToken!, displayedUser!, alias, featurePath);
    };

    const extractAlias = (value: string): string => {
        const index = value.indexOf("@");
        return value.substring(index);
    };

    return {navigateToUser}
}