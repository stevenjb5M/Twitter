import { AuthToken, Status } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface StatusItemView {
    addItems: (newItems: Status[]) => void;
    displayErrorMessage: (message: string) => void;
}

export abstract class StatusItemPresenter {
    private userService: UserService;
    private _hasMoreItems: boolean = true;
    private _lastItem: Status | null = null;
    private _view: StatusItemView;

    public constructor(view: StatusItemView) {
        this._view = view;
        this.userService = new UserService();
    }

    protected get view() {
        return this._view;
    }

    protected set hasMoreItems(value: boolean) {
        this._hasMoreItems = value;
    }

    protected get hasMoreItems() {
        return this._hasMoreItems;
    }

    protected get lastItem() {
        return this._lastItem;
    }

    public get canLoadMore(): boolean {
        return this.hasMoreItems;
    }

    protected set lastItem(value: Status | null) {
        this._lastItem = value;
    }

    reset() {
        this._lastItem = null;
        this._hasMoreItems = true;
    }

    public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;

    public async getUser(authToken: AuthToken, userAlias: string) {
        return this.userService.getUser(authToken, userAlias);
    }
}