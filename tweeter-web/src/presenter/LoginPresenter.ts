import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface LoginView {
    updateUserInfo: (currentUser: User, displayedUser: User, authToken: AuthToken, remember: boolean) => void;
    navigate: (path: string) => void;
    setIsLoading: (isLoading: boolean) => void;
    displayErrorMessage: (message: string) => void;
}

export class LoginPresenter {
    private service: UserService;
    private view: LoginView;

    public constructor(view: LoginView) {
        this.service = new UserService();
        this.view = view;
    }

    public async doLogin(alias: string, password: string, remember: boolean, originalUrl?: string) {
        try {
            this.view.setIsLoading(true);

            const [user, authToken] = await this.service.login(alias, password);

            this.view.updateUserInfo(user, user, authToken, remember);

            if (originalUrl) {
                this.view.navigate(originalUrl);
            } else {
                this.view.navigate(`/feed/${user.alias}`);
            }
        } catch (error) {
            this.view.displayErrorMessage("Login failed");
        } finally {
            this.view.setIsLoading(false);
        }
    }
}