import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavigationView extends View {
    setDisplayedUser: (user: User) => void;
    navigate: (path: string) => void;
}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
    private service: UserService;

    constructor(view: UserNavigationView) {
        super(view);
        this.service = new UserService();
    }

    async navigateToUser(authToken: AuthToken, currentDisplayedUser: User, alias: string, featurePath: string) {
        await this.doFailureReportingOperation(async () => {
            const toUser = await this.service.getUser(authToken, alias);
            if (toUser) {
                if (!toUser.equals(currentDisplayedUser)) {
                    this.view.setDisplayedUser(toUser);
                    this.view.navigate(`${featurePath}/${toUser.alias}`);
                }
            }
        }, "navigate to user");
    }

}