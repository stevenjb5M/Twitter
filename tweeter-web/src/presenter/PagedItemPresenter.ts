import { AuthToken, User} from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { Service } from "../model.service/Service";
import { UserService } from "../model.service/UserService";

export const PAGE_SIZE = 10;

export interface PagedItemView<T> extends View {
    addItems: (newItems: T[]) => void;
}

export abstract class PagedItemPresenter<T, U extends Service> extends Presenter<PagedItemView<T>> {
    private _service: U;
    private _hasMoreItems: boolean = true;
    private _lastItem: T | null = null;
    private userService: UserService;

    public constructor(view: PagedItemView<T>) {
        super(view);
        this._service = this.serviceFactory();
        this.userService = new UserService();
    }

    protected set hasMoreItems(value: boolean) {
        this._hasMoreItems = value;
    }

    public get hasMoreItems() {
        return this._hasMoreItems;
    }

    protected get lastItem() {
        return this._lastItem;
    }
    protected get service() {
        return this._service;
    }

    public get canLoadMore(): boolean {
        return this.hasMoreItems;
    }

    protected set lastItem(value: T | null) {
        this._lastItem = value;
    }

    reset() {
        this._lastItem = null;
        this._hasMoreItems = true;
    }

    // Template method, base class controls the flow and order. 
    public async loadMoreItems(authToken: AuthToken, userAlias: string) {
        this.doFailureReportingOperation(async () => {
            const [newItems, hasMore] = await this.getMoreItems(authToken, userAlias);

            this.hasMoreItems = hasMore;
            this.lastItem = newItems.length > 0 ? newItems[newItems.length - 1] : null;
            this.view.addItems(newItems);
        }, this.itemDescription())
    };

    protected abstract itemDescription(): string;

    public abstract getMoreItems(authToken: AuthToken, userAlias: string): Promise<[T[], boolean]> 

    protected abstract serviceFactory(): U;

    public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
        return this.userService.getUser(authToken, alias);
    }
}