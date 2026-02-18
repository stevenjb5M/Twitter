import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, AuthenticationView } from "./Presenter";

export interface LoginView extends AuthenticationView {
    updateUserInfo: (currentUser: User, displayedUser: User, authToken: AuthToken, remember: boolean) => void;
    navigate: (path: string) => void;
}

export class LoginPresenter extends Presenter<LoginView> {
    private service: UserService;

    public constructor(view: LoginView) {
        super(view);
        this.service = new UserService();
    }

    public async doLogin(alias: string, password: string, remember: boolean, originalUrl?: string) {
        await this.doAuthenticationServiceCall(
            () => this.service.login(alias, password),
            "Login failed",
            ([user, authToken]) => {
                this.view.updateUserInfo(user, user, authToken, remember);
                if (originalUrl) {
                    this.view.navigate(originalUrl);
                } else {
                    this.view.navigate(`/feed/${user.alias}`);
                }
            },
            this.view
        );
    }
}