import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface AppNavbarView {
    displayInfoMessage: (message: string, duration: number) => string;
    displayErrorMessage: (message: string) => void;
    deleteMessage: (messageId: string) => void;
    clearUserInfo: () => void;
    navigate: (path: string) => void;
}

export class AppNavbarPresenter {
    private service: UserService;
    private view: AppNavbarView;

    public constructor(view: AppNavbarView) {
        this.service = new UserService();
        this.view = view;
    }

    public async logOut(authToken: AuthToken) {
        const loggingOutToastId = this.view.displayInfoMessage("Logging out...", 0);

        try {
            await this.service.logout(authToken);

            this.view.deleteMessage(loggingOutToastId);
            this.view.clearUserInfo();
            this.view.navigate("/login"); 
        } catch (error) {
            this.view.displayErrorMessage("Failed to log out. Please try again.");
        }
    }
}