import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";


export interface UserItemView {
    addItems: (newItems: User[]) => void;
    displayErrorMessage: (message: string) => void;
}

export abstract class UserItemPresenter {
    public userService: UserService;
    private _hasMoreItems: boolean = true;
    private _lastItem: User | null = null;
    private _view: UserItemView;

    protected constructor(view: UserItemView) {
        this._view = view;
        this.userService = new UserService();
    }

    protected get view() {
        return this._view;
    }

    protected get hasMore() {
        return this._hasMoreItems;
    }

    protected set hasMoreItems(hasMore: boolean) {
        this._hasMoreItems = hasMore;
    }

    public get hasMoreItems() {
        return this._hasMoreItems;
    }

    protected get lastItem() {
        return this._lastItem;
    }

    protected set lastItem(lastItem: User | null) {
        this._lastItem = lastItem;
    }

    reset() {
        this._lastItem = null;
        this._hasMoreItems = true;
    }

    public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;

    public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
        return this.userService.getUser(authToken, alias);
    };
}
