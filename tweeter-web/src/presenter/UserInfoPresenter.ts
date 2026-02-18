import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { Presenter, MessageView } from "./Presenter";

export interface UserInfoView extends MessageView {
    setIsFollower: (isFollower: boolean) => void;
    setFolloweeCount: (count: number) => void;
    setFollowerCount: (count: number) => void;
    setIsLoading: (isLoading: boolean) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
    private service: FollowService;

    public constructor(view: UserInfoView) {
        super(view);
        this.service = new FollowService();
    }

    private async doOperationWithMessage<T>(
        toastMessage: string,
        operation: () => Promise<T>,
        operationDescription: string,
        onSuccess: (result: T) => void
    ): Promise<void> {
        const toastId = this.view.displayInfoMessage(toastMessage, 0);
        this.view.setIsLoading(true);
        try {
            const result = await operation();
            onSuccess(result);
        } catch (error) {
            this.view.displayErrorMessage(`Failed to ${operationDescription} because of exception: ${error}`);
        } finally {
            this.view.deleteMessage(toastId);
            this.view.setIsLoading(false);
        }
    }
    
    public async setIsFollowerStatus(authToken: AuthToken, currentUser: User, displayedUser: User) {
        await this.doFailureReportingOperation(async () => {
            if (currentUser === displayedUser) {
                this.view.setIsFollower(false);
            } else {
                const isFollower = await this.service.getIsFollowerStatus(authToken, currentUser, displayedUser);
                this.view.setIsFollower(isFollower);
            }
        }, "retrieve follower status");
    }

    public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
        await this.doFailureReportingOperation(async () => {
            const count = await this.service.getFolloweeCount(authToken, displayedUser);
            this.view.setFolloweeCount(count);
        }, "retrieve followee count");
    }

    public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
        await this.doFailureReportingOperation(async () => {
            const count = await this.service.getFollowerCount(authToken, displayedUser);
            this.view.setFollowerCount(count);
        }, "retrieve follower count");
    }

    public async followDisplayedUser(authToken: AuthToken, displayedUser: User) {
        await this.doOperationWithMessage(
            `Following ${displayedUser.name}...`,
            () => this.service.follow(authToken, displayedUser),
            "follow user",
            ([followerCount, followeeCount]) => {
                this.view.setIsFollower(true);
                this.view.setFollowerCount(followerCount);
                this.view.setFolloweeCount(followeeCount);
            }
        );
    }

    public async unfollowDisplayedUser(authToken: AuthToken, displayedUser: User) {
        await this.doOperationWithMessage(
            `Unfollowing ${displayedUser.name}...`,
            () => this.service.unfollow(authToken, displayedUser),
            "unfollow user",
            ([followerCount, followeeCount]) => {
                this.view.setIsFollower(false);
                this.view.setFollowerCount(followerCount);
                this.view.setFolloweeCount(followeeCount);
            }
        );
    }
}