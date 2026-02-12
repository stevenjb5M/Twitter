import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface UserNavigationView {
    setDisplayedUser: (user: User) => void;
    navigate: (path: string) => void;
    displayErrorMessage: (message: string) => void;
}

export class UserNavigationPresenter {
    private view: UserNavigationView;
    private service: UserService;

    constructor(view: UserNavigationView) {
        this.view = view;
        this.service = new UserService();
    }

    async navigateToUser(authToken: AuthToken, currentDisplayedUser: User, alias: string, featurePath: string) {
        try {
            const toUser = await this.service.getUser(authToken, alias);

            if (toUser) {
                if (!toUser.equals(currentDisplayedUser)) {
                    this.view.setDisplayedUser(toUser);
                    this.view.navigate(`${featurePath}/${toUser.alias}`);
                }
            }
        } catch (error) {
            this.view.displayErrorMessage(`Failed to get user because of exception: ${error}`);
        }
    }

}