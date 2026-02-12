import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";

export interface UserInfoView {
    setIsFollower: (isFollower: boolean) => void;
    setFolloweeCount: (count: number) => void;
    setFollowerCount: (count: number) => void;
    setIsLoading: (isLoading: boolean) => void;
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (message: string, duration: number) => string;
    deleteMessage: (messageId: string) => void;
}

export class UserInfoPresenter {
    private service: FollowService;
    private view: UserInfoView;

    public constructor(view: UserInfoView) {
        this.service = new FollowService();
        this.view = view;
    }
    
    public async setIsFollowerStatus(authToken: AuthToken, currentUser: User, displayedUser: User) {
        try {
            if (currentUser === displayedUser) {
                this.view.setIsFollower(false);
            } else {
                const isFollower = await this.service.getIsFollowerStatus(authToken, currentUser, displayedUser);
                this.view.setIsFollower(isFollower);
            }
        } catch (error) {
            this.view.displayErrorMessage("Error retrieving follower status.");
        }
    }

    public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
        try {
            const count = await this.service.getFolloweeCount(authToken, displayedUser);
            this.view.setFolloweeCount(count);
        } catch (error) {
            this.view.displayErrorMessage("Error retrieving followee count.");
        }
    }

    public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
        try {
            const count = await this.service.getFollowerCount(authToken, displayedUser);
            this.view.setFollowerCount(count);
        } catch (error) {
            this.view.displayErrorMessage("Error retrieving follower count.");
        }
    }

    public async followDisplayedUser(authToken: AuthToken, displayedUser: User) {
        const followingUserToast = this.view.displayInfoMessage(`Following ${displayedUser.name}...`, 0);

        try {
            this.view.setIsLoading(true);

            const [followerCount, followeeCount] = await this.service.follow(authToken, displayedUser);

            this.view.setIsFollower(true);
            this.view.setFollowerCount(followerCount);
            this.view.setFolloweeCount(followeeCount);
        } catch (error) {
            this.view.displayErrorMessage("Error following user.");
        } finally {
            this.view.deleteMessage(followingUserToast);
            this.view.setIsLoading(false);
        }
    }

    public async unfollowDisplayedUser(authToken: AuthToken, displayedUser: User) {
        const unfollowingUserToast = this.view.displayInfoMessage(`Unfollowing ${displayedUser.name}...`, 0);

        try {
            this.view.setIsLoading(true);

            const [followerCount, followeeCount] = await this.service.unfollow(authToken, displayedUser);

            this.view.setIsFollower(false);
            this.view.setFollowerCount(followerCount);
            this.view.setFolloweeCount(followeeCount);
        } catch (error) {
            this.view.displayErrorMessage("Error unfollowing user.");
        } finally {
            this.view.deleteMessage(unfollowingUserToast);
            this.view.setIsLoading(false);
        }
    }
}