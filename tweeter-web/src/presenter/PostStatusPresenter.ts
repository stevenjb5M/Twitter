import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";

export interface PostStatusView {
    setIsLoading: (isLoading: boolean) => void;
    displayInfoMessage: (message: string, duration: number) => string;
    displayErrorMessage: (message: string) => void;
    deleteMessage: (messageId: string) => void;
    setPost: (post: any) => void;
}

export class PostStatusPresenter {
    private view: PostStatusView;
    private service: StatusService;

    public constructor(view: PostStatusView) {
        this.view = view;
        this.service = new StatusService();
    }

    public async submitPost(authToken: AuthToken, post: string, currentUser: User) {
        let postingStatusToastId = "";

        try {
            this.view.setIsLoading(true);
            postingStatusToastId = this.view.displayInfoMessage("Posting Status...", 0);

            const status = new Status(post, currentUser, Date.now());

            await this.service.postStatus(authToken, status);

            this.view.setPost("");
            this.view.displayInfoMessage("Status posted!", 2000);
        } catch (error) {
            this.view.displayErrorMessage(`Failed to post the status because of exception: ${error}`);
        } finally {
            this.view.deleteMessage(postingStatusToastId);
            this.view.setIsLoading(false);
        }
    }
}
