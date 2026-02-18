import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, AuthenticationView } from "./Presenter";

export interface RegisterView extends AuthenticationView {
    updateUserInfo: (currentUser: User, displayedUser: User, authToken: AuthToken, remember: boolean) => void;
    navigate: (path: string) => void;
}

export class RegisterPresenter extends Presenter<RegisterView> {
    private service: UserService;

    public constructor(view: RegisterView) {
        super(view);
        this.service = new UserService();
    }

    public async doRegister(firstName: string, lastName: string, alias: string, password: string, imageBytes: Uint8Array, imageFileExtension: string, rememberMe: boolean) {
        await this.doAuthenticationServiceCall(
            () => this.service.register(firstName, lastName, alias, password, imageBytes, imageFileExtension),
            "Registration failed",
            ([user, authToken]) => {
                this.view.updateUserInfo(user, user, authToken, rememberMe);
                this.view.navigate(`/feed/${user.alias}`);
            },
            this.view
        );
    }
}