import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, MessageView } from "./Presenter";

export interface AppNavbarView extends MessageView {
    clearUserInfo: () => void;
    navigate: (path: string) => void;
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
    private service: UserService;

    public constructor(view: AppNavbarView) {
        super(view);
        this.service = new UserService();
    }

    public async logOut(authToken: AuthToken) {
        const loggingOutToastId = this.view.displayInfoMessage("Logging out...", 0);

        try {
            await this.doFailureReportingOperation(async () => {
                await this.service.logout(authToken);
                this.view.clearUserInfo();
                this.view.navigate("/login");
            }, "logout");
        } finally {
            this.view.deleteMessage(loggingOutToastId);
        }
    }
}