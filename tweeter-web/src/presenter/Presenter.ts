
export interface View {
    displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
    displayInfoMessage: (message: string, duration: number) => string;
    deleteMessage: (messageId: string) => void;
}

export interface AuthenticationView extends View {
    setIsLoading: (isLoading: boolean) => void;
}

export abstract class Presenter<V extends View> {
    private _view: V;

    protected constructor(view: V) {
        this._view = view;
    }


    protected async doFailureReportingOperation(operation: () => Promise<void>, operationDescription: string) {
        try {
            await operation();
        } catch (error) {
            this.view.displayErrorMessage(`Failed to load ${operationDescription} because of exception: ${error}`);
        }
    };

    protected async doAuthenticationOperation(operation: () => Promise<void>, operationDescription: string, view: AuthenticationView) {
        view.setIsLoading(true);
        try {
            await this.doFailureReportingOperation(operation, operationDescription);
        } finally {
            view.setIsLoading(false);
        }
    };

    protected async doAuthenticationServiceCall<T>(
        operation: () => Promise<T>,
        errorMessage: string,
        onSuccess: (result: T) => void,
        view: AuthenticationView
    ): Promise<void> {
        view.setIsLoading(true);
        try {
            const result = await operation();
            onSuccess(result);
        } catch (error) {
            this.view.displayErrorMessage(errorMessage);
        } finally {
            view.setIsLoading(false);
        }
    };

    protected get view() {
        return this._view;
    }
}