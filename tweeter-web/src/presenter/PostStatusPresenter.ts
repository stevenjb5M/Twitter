import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { Presenter, MessageView } from "./Presenter";

export interface PostStatusView extends MessageView {
    setIsLoading: (isLoading: boolean) => void;
    setPost: (post: any) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
    private service: StatusService;

    public constructor(view: PostStatusView) {
        super(view);
        this.service = new StatusService();
    }

    public async submitPost(authToken: AuthToken, post: string, currentUser: User) {
        let postingStatusToastId = "";

        this.view.setIsLoading(true);
        try {
            postingStatusToastId = this.view.displayInfoMessage("Posting Status...", 0);

            await this.doFailureReportingOperation(async () => {
                const status = new Status(post, currentUser, Date.now());
                await this.service.postStatus(authToken, status);
                this.view.setPost("");
                this.view.displayInfoMessage("Status posted!", 2000);
            }, "post the status");
        } finally {
            this.view.deleteMessage(postingStatusToastId);
            this.view.setIsLoading(false);
        }
    }
}
