import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface RegisterView {
    updateUserInfo: (currentUser: User, displayedUser: User, authToken: AuthToken, remember: boolean) => void;
    navigate: (path: string) => void;
    setIsLoading: (isLoading: boolean) => void;
    displayErrorMessage: (message: string) => void;
}

export class RegisterPresenter {
    private service: UserService;
    private view: RegisterView;

    public constructor(view: RegisterView) {
        this.service = new UserService();
        this.view = view;
    }

    public async doRegister(firstName: string, lastName: string, alias: string, password: string, imageBytes: Uint8Array, imageFileExtension: string, rememberMe: boolean) {
        try {
            this.view.setIsLoading(true);

            const [user, authToken] = await this.service.register(firstName, lastName, alias, password, imageBytes, imageFileExtension);

            this.view.updateUserInfo(user, user, authToken, rememberMe);
            this.view.navigate(`/feed/${user.alias}`);
        } catch (error) {
            this.view.displayErrorMessage("Registration failed");
        } finally {
            this.view.setIsLoading(false);
        }
    }
}